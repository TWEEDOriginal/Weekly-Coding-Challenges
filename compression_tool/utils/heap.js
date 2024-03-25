const { HuffBaseNode } = require("./huffmanTree");

class MinHeap {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  weight() {
    return this.root.weight();
  }
  getLastPosition(numberOfNodes) {
    const positions = [];
    while (numberOfNodes != 1) {
      numberOfNodes % 2 === 0
        ? positions.push("left")
        : positions.push("right");
      numberOfNodes = Math.floor(numberOfNodes / 2);
    }
    return positions;
  }

  swap(curr, node, prev, move) {
    let tempLeft = curr.left;
    let tempRight = curr.right;

    curr.left = node.left;
    curr.right = node.right;

    node.left = tempLeft;
    node.right = tempRight;

    move === "left" ? (prev.left = node) : (prev.right = node);

    return [node, curr];
  }

  swapParentWithChild(curr, prev, move, minChild) {
    let tempRight = curr.right;
    let tempLeft = curr.left;
    let minNode;

    if (minChild === "left") {
      minNode = curr.left;
    } else {
      minNode = curr.right;
    }

    curr.left = minNode.left;
    curr.right = minNode.right;

    if (minChild === "left") {
      // make left equal to parent
      minNode.left = curr; //former parent
      minNode.right = tempRight;
    } else {
      //make right equal to parent
      minNode.right = curr; //former parent
      minNode.left = tempLeft;
    }

    move === "left" ? (prev.left = minNode) : (prev.right = minNode);

    return minNode;
  }

  insert(node) {
    if (!this.root) {
      this.root = node;
      this.size = 1;
      return;
    }
    //for getting last available position
    const positions = this.getLastPosition(this.size + 1);

    const preRoot = new HuffBaseNode(0, false);
    preRoot.right = this.root;
    let curr = this.root,
      prev = preRoot;
    let move = "right";

    while (positions.length > 0) {
      if (curr.weight() > node.weight()) {
        [curr, node] = this.swap(curr, node, prev, move);
      }
      move = positions.pop();
      prev = curr;
      if (move === "left") {
        curr = curr.left;
        continue;
      }
      curr = curr.right;
    }
    //insert at last available position
    move === "left" ? (prev.left = node) : (prev.right = node);
    this.size++;
    this.root = preRoot.right;
  }

  extract_min() {
    if (!this.root) {
      return;
    }
    let node;
    if (this.size <= 1) {
      node = this.root;
      this.root = null;
      this.size = 0;

      return node;
    }
    const positions = this.getLastPosition(this.size);
    let curr = this.root,
      prev;
    let move;
    // get rightmost node
    while (positions.length > 0) {
      move = positions.pop();
      prev = curr;
      move === "left" ? (curr = curr.left) : (curr = curr.right);
    }
    if (move === "left") {
      node = prev.left;
      prev.left = null;
    } else {
      node = prev.right;
      prev.right = null;
    }
    const preRoot = new HuffBaseNode(0, false);
    preRoot.right = this.root;
    move = "right";
    prev = preRoot;
    //save root node as result and swap root node with right most node
    [curr, node] = this.swap(this.root, node, prev, move);

    //starting at root node
    //if root > any child, swap root node with min child
    //else break
    let minNode;
    while (curr) {
      if (curr.left && curr.right) {
        let min = Math.min(curr.left.weight(), curr.right.weight());

        if (curr.weight() > min) {
          if (min === curr.left.weight()) {
            minNode = this.swapParentWithChild(curr, prev, move, "left");

            move = "left";
            prev = minNode;
            continue;
          } else {
            minNode = this.swapParentWithChild(curr, prev, move, "right");

            move = "right";
            prev = minNode;
            continue;
          }
        } else {
          break;
        }
      } else if (curr.left && !curr.right) {
        if (curr.weight() > curr.left.weight()) {
          this.swapParentWithChild(curr, prev, move, "left");
        }
        break;
      } else {
        break;
      }
    }

    this.size--;
    this.root = preRoot.right;
    return node;
  }

  bfs(root) {
    const nodes = [];
    const queue = [root];
    while (queue.length) {
      let l = queue.length;
      while (l > 0) {
        //unshift
        const node = queue.shift();
        nodes.push({ element: node.element, weight: node.weight() });
        if (node.left) {
          queue.push(node.left);
        }
        if (node.right) {
          queue.push(node.right);
        }
        l -= 1;
      }
    }
    return nodes;
  }
}

module.exports = MinHeap;
