#include <iostream>
#include <fstream>
#include <vector>
#include <algorithm>
#include <cstdint>

#include "Assignment_1_2.h"


Assignment_1_2::Assignment_1_2(void)
	: AssignmentBase("Assignment_1_2")
{
}


Assignment_1_2::~Assignment_1_2(void)
{
}

void Assignment_1_2::Do()
{
	std::string inputPath = "E:\\Algorithm_II\\Assignment1\\jobs.txt";
		
	std::ifstream in;
	in.open(inputPath, std::ios_base::in);
	if (in.fail())
	{
		std::cout<<"Read file error, check input path " << inputPath<<std::endl;
		return;
	}

	int jobCount = 0;
	in>>jobCount;

	struct Job
	{
		int weight;
		int length;
	};

	struct LessJob
	{
		bool operator () (Job & a, Job & b)
		{
			double scoreA = (double)a.weight / a.length;
			double scoreB = (double)b.weight / b.length;
			return scoreA > scoreB;
		}
	};

	std::vector<Job> jobVector;	
	jobVector.resize(jobCount);

	for(int i = 0; i < jobCount; ++i)
	{
		in>>jobVector[i].weight;
		in>>jobVector[i].length;
	}
	in.close();

	//
	// The 3 lines below are equal
	//

	//std::sort(&jobVector[0], &jobVector[0]+jobCount, LessJob());
	//std::sort(jobVector.begin(), jobVector.end(), LessJob());
	std::sort(jobVector.data(), jobVector.data() + jobCount, LessJob());



	uint64_t time = 0;
	uint64_t score = 0;
	for(int i = 0; i < jobCount; ++i)
	{
		time += jobVector[i].length;
		score += time * jobVector[i].weight;
		//std::cout<<GetLabel()<<score<<std::endl;
	}

	std::cout<<GetLabel()<<score<<std::endl;
}
