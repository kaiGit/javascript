#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <cstdint>
#include <set>
#include <map>
#include <hash_map>
#include <hash_set>
#include <queue>


#include "Assignment_1_3.h"


Assignment_1_3::Assignment_1_3(void)
	: AssignmentBase("Assignment_1_3")
{
}


Assignment_1_3::~Assignment_1_3(void)
{
}

void Assignment_1_3::Do()
{
	std::string inputPath = "E:\\Algorithm_II\\Assignment1\\edges.txt";
	//std::string inputPath = "E:\\Algorithm_II\\Assignment1\\edges-test-4-case1.txt";
		
	std::ifstream in;
	in.open(inputPath, std::ios_base::in);
	if (in.fail())
	{
		std::cout<<"Read file error, check input path " << inputPath<<std::endl;
		return;
	}

	int numOfNodes = 0;
	int numOfEdges = 0;

	in>>numOfNodes;
	in>>numOfEdges;

	struct Edge
	{
		int startNode;
		int endNode;
		int cost;
	};

	std::vector<Edge> edgeVector;	
	edgeVector.resize(numOfEdges);

	for(int i = 0; i < numOfEdges; ++i)
	{
		in>>edgeVector[i].startNode;
		in>>edgeVector[i].endNode;
		in>>edgeVector[i].cost;
	}
	in.close();

	// Now the reading of input data has finished, 
	// What I need
	// 1) Given a index, find all outgoint edges
	std::hash_map<int, std::vector<Edge>> edgeTable;
	for(int i = 0; i < numOfEdges; ++i)
	{
		Edge edge = edgeVector[i];
		
		auto it = edgeTable.find(edge.startNode);
		if (it == edgeTable.end())
		{
			edgeTable[edge.startNode] = std::vector<Edge>();
		}

		std::vector<Edge>& edgeList = edgeTable[edge.startNode];
		edgeList.push_back(edge);

		// Register twice because it's undirected graph
		Edge edge2 = edge;
		std::swap(edge2.endNode, edge2.startNode);
		it = edgeTable.find(edge2.startNode);
		if (it == edgeTable.end())
		{
			edgeTable[edge2.startNode] = std::vector<Edge>();
		}

		std::vector<Edge>& edgeList2 = edgeTable[edge2.startNode];
		edgeList2.push_back(edge2);
	}

	// 2) a heap, that can always give the smallest edge
	struct VertexWithCost
	{
		int vertex;
		int cost;
	};

	struct LessPointWithCost
	{
		bool operator () (const VertexWithCost& a, const VertexWithCost& b)
		{
			if (a.cost < b.cost)
				return true;
			else if (a.cost > b.cost)
				return false;
			else
				return a.vertex < b.vertex;
		}
	};
	typedef std::set<VertexWithCost, LessPointWithCost> VertexQueueType;
	VertexQueueType edgeQueue;

	// 3) Given a vertex, I need to locate its position in the queue, so I can
	// Update its cost when a new edge has been discovered.
	typedef VertexQueueType::iterator VertexNodeType;
	std::hash_map<int, VertexNodeType> vertexPosInQueue;

	// 4) initialize the process
	// Push vertex 0 into the mst, and add edges starting from 0 to the heap
	// 4.1 need to define the vertex finding process first
	struct ProcessNewEdge
	{
		ProcessNewEdge(VertexQueueType& edgeQueue, std::hash_map<int, VertexNodeType>& vertexPosInQueue)
			: mEdgeQueue(edgeQueue)
			, mVertexPosInQueue(vertexPosInQueue)
		{}

		void operator() (const Edge& edge)
		{
			VertexWithCost vwc;
			vwc.cost = edge.cost;
			vwc.vertex = edge.endNode;

			auto it = mVertexPosInQueue.find(vwc.vertex);
			if (it == mVertexPosInQueue.end())
			{
				auto insert_result = mEdgeQueue.insert(vwc);
				auto pos = insert_result.first;
				mVertexPosInQueue[vwc.vertex] = pos;
			}
			else
			{
				auto pos = it->second;
				if (vwc.cost < pos->cost)
				{
					mEdgeQueue.erase(pos);
					auto insert_result = mEdgeQueue.insert(vwc);
					auto pos = insert_result.first;
					mVertexPosInQueue[vwc.vertex] = pos;
				}
			}
		}

		std::hash_map<int, VertexNodeType>& mVertexPosInQueue;
		VertexQueueType& mEdgeQueue;
	};

	ProcessNewEdge processNewEdge(edgeQueue, vertexPosInQueue);

	// 4.2 initial 0
	// Reach vertex 0 is using cost 0
	{
		VertexWithCost vwc;
		vwc.cost = 0;
		vwc.vertex = 1;
		auto insert_result = edgeQueue.insert(vwc);
		auto pos = insert_result.first;
		vertexPosInQueue[vwc.vertex] = pos;
	}

	// 5) GO
	std::hash_set<int> mstVectices; // Do I still need this one?
	std::vector<VertexWithCost> mstBuildOrder;

	while (!edgeQueue.empty())
	{
		// pop first
		VertexWithCost vwc = *edgeQueue.begin();
		edgeQueue.erase(edgeQueue.begin());
		vertexPosInQueue.erase(vwc.vertex);

		// record mst 
		mstBuildOrder.push_back(vwc);
		mstVectices.insert(vwc.vertex);
		/*std::cout<<mstVectices.size()<<std::endl;*/


		// add new edges
		auto edgesFromNewVertex = edgeTable[vwc.vertex];
		int i = 0;
		for (auto edge : edgesFromNewVertex)
		{
			++i;
			if (mstVectices.find(edge.endNode) == mstVectices.end())
				processNewEdge(edge);
		}
	}
	
	int64_t mstCost = 0;
	for (unsigned int i = 1; i < mstBuildOrder.size(); ++i)
	{
		const VertexWithCost& vwc = mstBuildOrder[i];
		mstCost += vwc.cost;
	}
	std::cout<<GetLabel()<<mstCost<<std::endl;
}

