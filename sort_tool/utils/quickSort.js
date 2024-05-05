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

module.exports = quickSort;
