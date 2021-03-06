function UFNode(id)
{
  this.id = id;
  this.parent = this;
  this.rank = 0;
}

function UnionFind()
{
  this.all = {}

  this.elementCount = 0;
  this.clusterCount = 0;

  // add a new id into this UnionFind container
  this.add = add;

  // Combine the group of 2 nodes
  // Use Union on Rank optimization
  // Return the new Root id
  this.union = union;

  // Find the Root id of current node
  // return null if this id is not in current UnionFind container
  // Use Path compression optimization
  this.find = find;

  this.getClusterCount = getClusterCount;

  this.debugPrint = debugPrint;

  this.debugPrintAllLeadIds = debugPrintAllLeadIds;

  // This callback is invoked whenever 2 cluster is merged.
  this.mergeCallback = null;
}

function add(id)
{
  if (id in this.all)
    return;

  var obj = new UFNode(id);
  this.all[id] = obj;

  ++this.clusterCount;
  ++this.elementCount;
}

function union(id1, id2)
{
  if (!(id1 in this.all))
    return null;

  if (!(id2 in this.all))
    return null;

  var node1 = this.all[id1];
  var node2 = this.all[id2];

  var leadNode1 = findNodeByNode(node1);
  var leadNode2 = findNodeByNode(node2);

  // If they are already in the same group
  if (leadNode1 === leadNode2)
    return leadNode2.id;

  // Else, I need to do rank based merge
  if (leadNode1.rank !== leadNode2.rank)
  {
    var small = leadNode1;
    var large = leadNode2;
    if (leadNode1.rank > leadNode2.rank)
    {
      small = leadNode2;
      large = leadNode1;
    }

    small.parent = large;

    this.mergeCallback && this.mergeCallback(leadNode1.id, leadNode2.id);
    --this.clusterCount;
    return large.id;
  }

  // Worse case, rank is the same, need to modify rank
  leadNode2.parent = leadNode1;
  leadNode1.rank += 1;

  this.mergeCallback && this.mergeCallback(leadNode1.id, leadNode2.id);
  --this.clusterCount;
  return leadNode1.id;
}

function find(id)
{
  if (!(id in this.all))
    return null;

  var leadNode = findNodeByNode(this.all[id]);
  if (leadNode === null)
    return null;

  return leadNode.id;
}

function findNodeByNode(node)
{
  if (node.parent !== node)
  {
    var leadNode = findNodeByNode(node.parent);

    if (node.parent !== leadNode)
      node.parent = leadNode;

    return leadNode;
  }

  return node;
}

function debugPrint()
{
  console.log("debugPrint Begin");
  for(x in this.all)
  {
    console.log(x + " -> " + this.all[x].parent.id);
  }
  console.log("debugPrint End\n");
}

function debugPrintAllLeadIds() {
  var allLeads = {}

  console.log("debugPrintAllLeadIds Begin");
  for(x in this.all)
  {
    var leadId = this.find(x);
    allLeads[leadId] = true;
  }

  for (leadId in allLeads)
    console.log(leadId);

  console.log("debugPrintAllLeadIds End\n");

  return allLeads;
}

function getClusterCount() {
  var result = {
          clusterCount : this.clusterCount,
          elementCount : this.elementCount
        };
  return result;
}

exports.UnionFind = UnionFind
