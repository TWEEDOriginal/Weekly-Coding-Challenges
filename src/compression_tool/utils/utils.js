const MinHeap = require("./heap");
const { HuffLeafNode, buildHuffTree } = require("./huffmanTree");

function buildBinaryTree(frequencyMap) {
  const heap = new MinHeap();

  for (const [element, frequency] of Object.entries(frequencyMap)) {
    heap.insert(new HuffLeafNode(element, frequency));
  }

  return buildHuffTree(heap);
}

module.exports = {
  buildBinaryTree,
};
