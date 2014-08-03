#pragma once
#include <string>


class AssignmentBase
{
public:
	AssignmentBase(const char * pName);
	virtual ~AssignmentBase();

	virtual void Do() = 0;

	virtual std::string GetLabel();
protected:
	std::string mName;
};
