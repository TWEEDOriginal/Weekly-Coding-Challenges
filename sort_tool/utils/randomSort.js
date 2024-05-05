/**
 * Computes the Hash value of a given string using
 * Polynomial Rolling Hash Function.
 *
 */
function computeHash(word) {
  const prime = 31;
  const mod = 10e9 + 9;
  let hashValue = 0;
  let power = 1;
  for (let i = 0; i < word.length; i++) {
    const code = word.codePointAt(i);
    if (code !== undefined) {
      hashValue = (hashValue + code * power) % mod;
    }
    power = (power * prime) % mod;
  }
  return hashValue;
}

/**
 * randomly shuffle array
 * Fisher Yates Method.
 *
 */
function shuffleArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    const idx = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[idx]] = [arr[idx], arr[i]];
  }
  return arr;
}

function randomSort(arr) {
  const map = new Map();

  for (let word of arr) {
    const hash = computeHash(word);
    const words = map.has(hash) ? map.get(hash).words : [];
    words.push(word);
    map.set(hash, {
      words,
      hash,
    });
  }

  const hashArr = shuffleArray([...map.keys()]);
  const newArray = [];

  for (let hash of hashArr) {
    const elem = map.get(hash);
    for (let word of elem.words) {
      newArray.push(word);
    }
  }

  return newArray;
}

module.exports = randomSort;
