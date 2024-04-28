function removeDuplicatesFromSortedArray(arr) {
  let slow = 0;

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] != arr[slow]) {
      slow++;
      arr[slow] = arr[fast];
    }
  }
  const lastIndex = arr.length - 1;
  // remove excess
  arr.splice(slow + 1);
}

removeDuplicatesFromSortedArray([1, 2, 2, 2, 3, 4, 5, 5, 6]);
removeDuplicatesFromSortedArray([1, 2, 3, 4, 5, 6]);

module.exports = {
  removeDuplicatesFromSortedArray,
};
