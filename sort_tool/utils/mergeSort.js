function skipDuplicate(arr, idx, res, unique) {
  if (unique && res[res.length - 1] === arr[idx]) {
    idx++;
  }
  return idx;
}

function pushDuplicate(arr, idx, res, unique) {
  // allow duplicates or push unique
  if (!unique || res[res.length - 1] != arr[idx]) {
    res.push(arr[idx]);
  }
}

function merge(left, right, unique) {
  const res = [];
  let i = 0,
    j = 0;
  const leftLen = left.length,
    rightLen = right.length;

  while (i < leftLen && j < rightLen) {
    if (left[i] <= right[j]) {
      pushDuplicate(left, i, res, unique);
      i++;
    } else {
      pushDuplicate(right, j, res, unique);
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

module.exports = mergeSort;
