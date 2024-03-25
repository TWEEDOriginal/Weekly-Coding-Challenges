/** Huffman tree node implementation: Base class */
class HuffBaseNode {
  constructor(weight, isLeaf) {
    this.frequency = weight;
    this.isleaf = isLeaf;
    //min heap left and right
    this.left = null;
    this.right = null;
    this.binaryCode = "";
  }
  isLeaf() {
    return this.isleaf;
  }
  weight() {
    return this.frequency;
  }
}

/** Huffman tree node: Leaf class */
class HuffLeafNode extends HuffBaseNode {
  constructor(element, weight) {
    super(weight, true);
    this.element = element;
  }
  value() {
    return this.element;
  }
}

/** Huffman tree node: Internal class */
class HuffInternalNode extends HuffBaseNode {
  //leftChild smaller, rightChild larger
  constructor(left, right, weight) {
    super(weight, false);
    this.leftChild = left;
    this.rightChild = right;
  }

  generatePrefixCodeTable() {
    const prefixCodeTable = {};
    function dfs(node, code) {
      if (!node) return;
      if (node.isLeaf()) {
        prefixCodeTable[node.value()] = code;
        return;
      }
      dfs(node.leftChild, code + "0");
      dfs(node.rightChild, code + "1");
    }

    dfs(this, "");
    return prefixCodeTable;
  }
}

function buildHuffTree(heap) {
  let tmp1,
    tmp2,
    tmp3 = heap.root;
  while (heap.size > 1) {
    // While two items left
    tmp1 = heap.extract_min();
    tmp2 = heap.extract_min();
    tmp3 = new HuffInternalNode(tmp1, tmp2, tmp1.weight() + tmp2.weight());
    heap.insert(tmp3); // Return new node to correct position in heap
  }
  return tmp3;
}



module.exports = {
  HuffBaseNode,
  HuffLeafNode,
  buildHuffTree,
};
