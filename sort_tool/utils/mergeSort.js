function skipDuplicate(arr, idx, res, unique) {
  if (unique && res[res.length - 1] === arr[idx]) {
    idx++;
  }
  return idx;
}

function merge(left, right, unique) {
  const res = [];
  let i = 0,
    j = 0;
  const leftLen = left.length,
    rightLen = right.length;

  while (i < leftLen && j < rightLen) {
    if (left[i] <= right[j]) {
      // allow duplicates
      if (!unique || res[res.length - 1] != left[i]) {
        res.push(left[i]);
      }
      i++;
    } else {
      // allow duplicates
      if (!unique || res[res.length - 1] != right[j]) {
        res.push(right[j]);
      }
      j++;
    }
  }
  i = skipDuplicate(left, i, res, unique);
  // insert remaining elems of left arr
  while (i < leftLen) {
    res.push(left[i]);
    i++;
  }

  j = skipDuplicate(right, j, res, unique);
  // insert remaining elems of right arr
  while (j < rightLen) {
    res.push(right[j]);
    j++;
  }

  return res;
}

function mergeSort(arr, unique) {
  if (arr.length <= 1) return arr;

  const middle = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, middle), unique);
  const right = mergeSort(arr.slice(middle), unique);

  return merge(left, right, unique);
}

console.log(mergeSort([3, 2, 4, 1, 6, 5]));
console.log(mergeSort([6, 5, 4, 3, 2, 1]));
console.log(mergeSort([1, 2, 2, 2, 3, 4, 5, 5, 6]));
console.log(mergeSort([1, 2, 2, 2, 3, 4, 5, 5, 6, 1]));

console.log(mergeSort([1, 2, 2, 2, 3, 4, 5, 5, 6], true));
console.log(mergeSort([1, 2, 2, 2, 3, 4, 5, 5, 6, 1], true));

module.exports = mergeSort;
