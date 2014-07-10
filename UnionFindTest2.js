var unionfind = require('./UnionFind.js');

var uf = new unionfind.UnionFind();

// 1, 2, 3, 4, 5, 6, 7, 8
// 1 - 2
// 3 - 4
// 5 - 6
// 7 - 8
// 1 - 4
// 6 - 7
// 1 - 6

for (var i = 1; i <= 8; ++i)
  uf.add(i);

uf.union(1, 2);
uf.union(3, 4);
uf.union(5, 6);
uf.union(7, 8);

uf.debugPrint();

uf.union(1, 4);
uf.union(6, 7);

uf.debugPrint();

uf.union(1, 6);
uf.debugPrint();

function AssertEqual(id1, id2)
{
  var leadId1 = uf.find(id1);
  var leadId2 = uf.find(id2);

  if (leadId1 !== leadId2)
    console.error("Error  " + id1.toString() + ", " + id2.toString() + " are not in the same group. ");
  else
    console.log("Correct " + id1.toString() + ", " + id2.toString() + " are in the same group. ");
}

for (var i = 1; i <= 8; ++i)
{
  for (var j = 1; j <= 8; ++j)
  {
    AssertEqual(i, j);
  }
}

uf.debugPrint();
