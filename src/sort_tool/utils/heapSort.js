function insert(arr, elem) {
  arr.push(elem);
  const len = arr.length;
  let parentIndex = Math.floor(len / 2 - 1);
  let childIndex = len - 1;
  while (parentIndex >= 0) {
    if (arr[parentIndex] > arr[childIndex]) break;

    [arr[parentIndex], arr[childIndex]] = [arr[childIndex], arr[parentIndex]];
    childIndex = parentIndex;
    parentIndex = Math.floor((childIndex + 1) / 2 - 1);
  }

  return arr;
}

function heapify(arr, len, parentIndex) {
  let largest = parentIndex;
  const leftIndex = parentIndex * 2 + 1;
  const rightIndex = leftIndex + 1;

  if (leftIndex < len && arr[leftIndex] > arr[largest]) {
    largest = leftIndex;
  }
  if (rightIndex < len && arr[rightIndex] > arr[largest]) {
    largest = rightIndex;
  }

  if (largest !== parentIndex) {
    [arr[largest], arr[parentIndex]] = [arr[parentIndex], arr[largest]];
    heapify(arr, len, largest);
  }
  return arr;
}

/**
 *
 * Steps:
 * 1. Build a max-heap.
 * 2. The maximal element is at the root of the tree, switch it with the last element of the tree.
 * 3. New tree is gotten by ignoring the last position (this is already sorted). New tree is not a max-heap, heapify it.
 * 4. Go to step 2 and repeat until tree is empty.
 *
 */

function heapSort(arr, heapified) {
  const len = arr.length;
  //not yet a max heap
  if (!heapified) {
    let lastParentIndex = Math.floor(len / 2 - 1);
    while (lastParentIndex >= 0) {
      heapify(arr, len, lastParentIndex);
      lastParentIndex--;
    }
  }
  let lastChildIndex = len - 1;

  while (lastChildIndex >= 0) {
    //flip child with root
    [arr[lastChildIndex], arr[0]] = [arr[0], arr[lastChildIndex]];
    heapify(arr, lastChildIndex, 0);
    lastChildIndex--;
  }
  return arr;
}

module.exports = {
  heapSort,
  insert,
};
