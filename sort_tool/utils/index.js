const { radixSortString: radixSort } = require("./radixSort");

function removeDuplicatesFromSortedArray(arr) {
  let slow = 0;

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] != arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  // remove excess
  arr.splice(slow + 1);
}

function removeDuplicatesFromUnSortedArray(arr) {
  let set = new Set();
  let newArray = [];

  for (let word of arr) {
    if (!set.has(word)) newArray.push(word);

    set.add(word);
  }
  return newArray;
}

module.exports = {
  removeDuplicatesFromSortedArray,
  removeDuplicatesFromUnSortedArray,
  heapSort: require("./heapSort"),
  quickSort: require("./quickSort"),
  mergeSort: require("./mergeSort"),
  radixSort,
  randomSort: require("./randomSort"),
};
