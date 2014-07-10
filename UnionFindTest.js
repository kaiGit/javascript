var unionfind = require('./UnionFind.js');

var uf = new unionfind.UnionFind();

// 1, 2, 3, 4
// 1 - 2
// 3 - 4
// 1 - 4
uf.add(1);
uf.add(2);
uf.add(3);
uf.add(4);

uf.union(1, 2);

AssertEqual(1, 2);
uf.debugPrint();

uf.union(3, 4);
AssertEqual(3, 4);
uf.debugPrint();

uf.union(1, 4);
AssertEqual(1, 2);
AssertEqual(1, 3);
AssertEqual(1, 4);
AssertEqual(2, 3);
AssertEqual(2, 4);
AssertEqual(3, 4);
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
