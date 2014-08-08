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
#include <bitset>
#include <assert.h>
#include "Assignment_5_1.h"

using namespace std;

namespace
{
	struct City
	{
		float x;
		float y;
	};

	float distance(const vector<City>& map, int i, int j)
	{
		static stdext::hash_map<int, float> cache;

		// i and j are 1 based city index
		int x = i << 16 | j;
		auto it = cache.find(x);
		if (it != cache.end())
			return it->second;

		const City& ci = map[i-1];
		const City& cj = map[j-1];
		float dist = sqrt((ci.x - cj.x) * (ci.x - cj.x) + (ci.y - cj.y) * (ci.y - cj.y));
		cache[x] = dist;

		return dist;
	}

	unsigned int key(unsigned int arrayFlags, unsigned int j)
	{
		return (j << 26) | arrayFlags;
	}

	void selectImpl(unsigned int input, unsigned int count, unsigned int start, vector<unsigned int>& output, unsigned int selected, unsigned int selectedCount)
	{
		if (selectedCount == count)
		{
			output.push_back(selected);
			return;
		}

		if (start >= 32)
			return;

		// if current bit is 0, then go to next start
		if (!(input & (1 << start)))
		{
			selectImpl(input, count, start+1, output, selected, selectedCount);
		}
		else
		{
			// option 1, select current one
			selectImpl(input, count, start+1, output, selected | 1 << start, selectedCount + 1);

			// option 2, don't select current one
			selectImpl(input, count, start+1, output, selected, selectedCount);
		}
	}

	vector<unsigned int> select(unsigned int input, unsigned int count)
	{
		if (count == 0)
			return vector<unsigned int>();

		vector<unsigned int> output;

		selectImpl(input, count, 0, output, 0, 0);

		return output;
	}

	//
	// return the shortest path weight
	//
	float tsm(const vector<City>& map)
	{
		auto *pA = new stdext::hash_map<int, float>();
		auto *pB = new stdext::hash_map<int, float>();
		
		const size_t n = map.size();
		const float MAX_FLOAT = FLT_MAX;
		const float	Infinity = FLT_MAX;
		unsigned int allCityFlags = 0;

		{
			// base case
    		stdext::hash_map<int, float>& A = *pA;
			for (int i = 1; i <= n; ++i)
			{
				if (i == 1)
					A[key(1<<i, 1)] = 0;
				else
					A[key(1<<i, 1)] = Infinity;

				allCityFlags |= 1 << i;
			}
		}

		for (int m = 2; m <= n; ++m)
		{
			stdext::hash_map<int, float>& A = *pA; // in this loop, assume A is pre-populated, and B is the target to fill.
			stdext::hash_map<int, float>& B = *pB;

			cout<<"m = "<<m<<endl;

			// Compose set S that's of m size, and always contain 1, so the first of S must be 1	
			auto arrayOfSwo1 = select(allCityFlags ^ (1 << 1), m-1); // populate arrayOfSwo1 of all possible S of m size
			cout<<"finish prepare arrayOfSwo1 "<<arrayOfSwo1.size()<<endl;

			for (auto it = arrayOfSwo1.begin(); it != arrayOfSwo1.end(); ++it)
			{
				auto sFlag = *it;
				sFlag |= 1 << 1; // add missing city 1

				// Convert all bigs to arraies
				int setElements[32];
				int setCount;

				memset(setElements, 0, sizeof(setElements));
				setCount = 0;
				for (auto t = 1; t <= 31; ++t)
				{
					if (sFlag & (1 << t))
						setElements[setCount++] = t;
				}
				
				assert(setCount == m);

				for (auto indexJ = 1; indexJ < setCount; ++indexJ) // J cannot be 1, so skip 0
				{
					auto j = setElements[indexJ];

					auto key_Sj = key(sFlag, j);
					float temp = Infinity;

					auto ckj = Infinity;
					auto SwoJFlags = sFlag ^ (1 << j);
					uint32_t key_swoj_k = 0;
					auto newPath = Infinity;

					for (auto indexK = 0; indexK < setCount; ++indexK)
					{
						if (indexK == indexJ)
							continue;

						auto k = setElements[indexK];

						ckj = distance(map, k, j);
						key_swoj_k = key(SwoJFlags, k);
						auto it_key = A.find(key_swoj_k);
						if (it_key == A.end())
						{
							if (k == 1)
								newPath = Infinity;
							else
								throw "Key not existing in A";
						}
						else
						{
							newPath = it_key->second + ckj;
						}

						if (newPath < temp)
						{
							temp = newPath;
						}

					} // end of looking for k

					B[key_Sj] = temp;


				} // end of looping for J
			} // end of looping arrayOfSwo1

			pA->clear();
			swap(pA, pB);
		} // end loop m

		auto overall = Infinity;
		{
			auto A = *pA;
			float cj1 = 0;
			// allCityFlags
			for (auto j = 2; j <= n; ++j) {
				auto newKey = key(allCityFlags, j);
				cj1 = distance(map, j, 1);
				auto newPath = A[newKey] + cj1;
				if (newPath < overall) {
					overall = newPath;
				}
			}
		}
	
		delete pA;
		pA = NULL;
		delete pB;
		pB = NULL;

		return overall;
	} // end of tsm function
} // end of anonymous namespace

Assignment_5_1::Assignment_5_1(void)
	: AssignmentBase("Assignment_5_1")
{
}


Assignment_5_1::~Assignment_5_1(void)
{
}

void Assignment_5_1::Do(void)
{
	//std::string inputPath = "E:\\Algorithm_II\\Assignment1\\edges.txt";
	//std::string inputPath = "D:\\SystemRelated\\Kai\\Documents\\Visual Studio 2012\\Projects\\TestCpp\\Assignment_1_1\\testdata\\tsp.small4_16898.1.txt";
	//std::string inputPath = "D:\\SystemRelated\\Kai\\Documents\\Visual Studio 2012\\Projects\\TestCpp\\Assignment_1_1\\testdata\\tsp.small3_10.4721.txt";
	std::string inputPath = "D:\\SystemRelated\\Kai\\Documents\\Visual Studio 2012\\Projects\\TestCpp\\Assignment_1_1\\testdata\\tsp.txt";
		
	std::ifstream in;
	in.open(inputPath, std::ios_base::in);
	if (in.fail())
	{
		std::cout<<"Read file error, check input path " << inputPath<<std::endl;
		return;
	}

	int numOfCities = 0;

	in>>numOfCities;
	std::vector<City> cityVector;	
	cityVector.resize(numOfCities);

	for(int i = 0; i < numOfCities; ++i)
	{
		in>>cityVector[i].x;
		in>>cityVector[i].y;
	}
	in.close();

	auto result = tsm(cityVector);
	cout<<"tsm result = "<<result<<endl;
}


void TestSelect()
{
	// vector<unsigned int> select(unsigned int input, unsigned int count)
	{
		auto result = select(1 | 2 | 4, 0);
		cout<<"select(1 | 2 | 4, 0);"<<endl;
		for (auto x: result)
		{
			std::bitset<32> bs(x);
			cout<<bs<<endl;
		}
		cout<<endl;
	}

	{
		auto result = select(1 | 2 | 4, 1);
		cout<<"select(1 | 2 | 4, 1);"<<endl;
		for (auto x: result)
		{
			std::bitset<32> bs(x);
			cout<<bs<<endl;
		}
		cout<<endl;
	}

	{
		auto result = select(1 | 2 | 4 | 8, 2);
		cout<<"select(1 | 2 | 4 | 8, 2);"<<endl;
		for (auto x: result)
		{
			std::bitset<32> bs(x);
			cout<<bs<<endl;
		}
		cout<<endl;
	}

	{
		auto result = select(1 | 2 | 4, 3);
		cout<<"select(1 | 2 | 4, 3);"<<endl;
		for (auto x: result)
		{
			std::bitset<32> bs(x);
			cout<<bs<<endl;
		}
		cout<<endl;
	}
}

void Assignment_5_1::Test()
{
	TestSelect();
}