function sortIthDigit(arr, ithDigit) {
  const countArray = new Array(10).fill(0);
  const sortArray = new Array(arr.length);

  for (let num of arr) {
    const countIndex = Math.floor(num / ithDigit) % 10;
    countArray[countIndex]++;
  }
  for (let i = 1; i < 10; i++) {
    countArray[i] += countArray[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i];
    const countIndex = Math.floor(num / ithDigit) % 10;
    const sortIndex = --countArray[countIndex];
    sortArray[sortIndex] = num;
  }

  return sortArray;
}

function radixSortInteger(arr) {
  const maxNum = Math.max(...arr);
  let ithDigit = 1;

  while (maxNum / ithDigit > 0) {
    arr = sortIthDigit(arr, ithDigit);
    ithDigit *= 10;
  }
  return arr;
}

function sortIthCharCodeDigit(stringArr, charCodeArray, ithDigit) {
  const countArray = new Array(10).fill(0);
  const sortArray = new Array(stringArr.length);
  const sortCodeArray = new Array(stringArr.length);

  for (let num of charCodeArray) {
    const countIndex = Math.floor(num / ithDigit) % 10;
    countArray[countIndex]++;
  }

  for (let i = 1; i < 10; i++) {
    countArray[i] += countArray[i - 1];
  }

  for (let i = stringArr.length - 1; i >= 0; i--) {
    const word = stringArr[i];
    const num = charCodeArray[i];
    const countIndex = Math.floor(num / ithDigit) % 10;
    const sortIndex = --countArray[countIndex];
    sortArray[sortIndex] = word;
    sortCodeArray[sortIndex] = num;
  }

  return [sortArray, sortCodeArray];
}
function getCharCode(str, ithLetterIdx) {
  if (ithLetterIdx < str.length) {
    return str.charCodeAt(ithLetterIdx);
  }
  return 0;
}

function sortIthLetter(stringArr, ithLetterIdx) {
  let maxCharCode = 0;
  let charCodeArray = [];
  for (let word of stringArr) {
    const charCode = getCharCode(word, ithLetterIdx);
    maxCharCode = Math.max(maxCharCode, charCode);
    charCodeArray.push(charCode);
  }
  let ithDigit = 1;

  while (maxCharCode / ithDigit > 0) {
    [stringArr, charCodeArray] = sortIthCharCodeDigit(
      stringArr,
      charCodeArray,
      ithDigit
    );
    ithDigit *= 10;
  }
  return stringArr;
}

function getMaxLength(arr) {
  let maxLength = 0;
  for (let i = 1; i < arr.length; i++) {
    maxLength = Math.max(maxLength, arr[i].length);
  }
  return maxLength;
}

function radixSortString(arr) {
  const maxLength = getMaxLength(arr);

  for (let i = maxLength - 1; i >= 0; i--) {
    arr = sortIthLetter(arr, i);
  }

  return arr;
}
/** @note More efficient */

// function sortIthLetter(arr, ithLetterIdx) {
//   const countArray = new Array(65536).fill(0);
//   const sortArray = new Array(arr.length);

//   for (let word of arr) {
//     const countIndex = getCharCode(word, ithLetterIdx);
//     countArray[countIndex]++;
//   }

//   for (let i = 1; i < countArray.length; i++) {
//     countArray[i] += countArray[i - 1];
//   }

//   for (let i = arr.length - 1; i >= 0; i--) {
//     const word = arr[i];
//     const countIndex = getCharCode(word, ithLetterIdx);
//     const sortIndex = --countArray[countIndex];
//     sortArray[sortIndex] = word;
//   }

//   return sortArray;
// }

// function radixSortString(arr) {
//   const maxLength = getMaxLength(arr);

//   for (let i = maxLength - 1; i >= 0; i--) {
//     arr = sortIthLetter(arr, i);
//   }

//   return arr;
// }

module.exports = {
  radixSortString,
  radixSortInteger,
};
