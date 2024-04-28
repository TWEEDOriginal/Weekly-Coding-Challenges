function populateArrs(elem, pivot, leftArr, rightArr, unique) {
  if (elem < pivot) {
    leftArr.push(elem);
  } else if (elem === pivot) {
    //allow duplicates
    if (!unique) {
      rightArr.push(elem);
    }
  } else {
    rightArr.push(elem);
  }
}

function quickSort(arr, unique) {
  if (arr.length <= 1) return arr;
  const pivotIdx = Math.floor(Math.random() * arr.length);
  let pivot = arr[pivotIdx];
  let leftArr = [];
  let rightArr = [];

  for (let i = 0; i < pivotIdx; i++) {
    populateArrs(arr[i], pivot, leftArr, rightArr, unique);
  }
  //skip pivot
  for (let i = pivotIdx + 1; i < arr.length; i++) {
    populateArrs(arr[i], pivot, leftArr, rightArr, unique);
  }

  return [...quickSort(leftArr, unique), pivot, ...quickSort(rightArr, unique)];
}

console.log(quickSort([3, 2, 4, 1, 6, 5]));
console.log(quickSort([6, 5, 4, 3, 2, 1]));
console.log(quickSort([1, 2, 2, 2, 3, 4, 5, 5, 6]));
console.log(quickSort([1, 2, 2, 2, 3, 4, 5, 5, 6, 1]));

console.log(quickSort([1, 2, 2, 2, 3, 4, 5, 5, 6], true));
console.log(quickSort([1, 2, 2, 2, 3, 4, 5, 5, 6, 1], true));
module.exports = quickSort;
