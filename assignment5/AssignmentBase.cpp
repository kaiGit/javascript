#include "AssignmentBase.h"

AssignmentBase::AssignmentBase(const char * pName)
	: mName(pName)
{
}

AssignmentBase::~AssignmentBase()
{
	mName.clear();
}

std::string AssignmentBase::GetLabel()
{
	return "The output of " + mName + " is : ";
}