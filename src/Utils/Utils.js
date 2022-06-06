function duration(duration, useMilli = false) {
    let remain = duration;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
    let milliseconds = remain;
    let time = {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
    let parts = []
    if (time.days) {
      let ret = time.days + ' ngày'
      parts.push(ret)
    }
    if (time.hours) {
      let ret = time.hours + ' giờ'
      parts.push(ret)
    }
    if (time.minutes) {
      let ret = time.minutes + ' phút'
      parts.push(ret)
  
    }
    if (time.seconds) {
      let ret = time.seconds + ' giây'
      parts.push(ret)
    }
    if (useMilli && time.milliseconds) {
      let ret = time.milliseconds + ' ms'
      parts.push(ret)
    }
    if (parts.length === 0) {
      return ['instantly']
    } else {
      return parts.join(', ')
    }
}



/**
 * Capitalizes a string
 * @param {string} string
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Removes specifed array element
 * @param {Array} arr
 * @param {*} value
 */
function removeElement(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

/**
 * Trims array down to specified size
 * @param {Array} arr
 * @param {int} maxLen
 */
function trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`and **${len}** more...`);
    }
    return arr;
}

/**
 * Trims joined array to specified size
 * @param {Array} arr
 * @param {int} maxLen
 * @param {string} joinChar
 */
function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
    let string = arr.join(joinChar);
    const diff = maxLen - 15; // Leave room for "And ___ more..."
    if (string.length > maxLen) {
        string = string.slice(0, string.length - (string.length - diff));
        string = string.slice(0, string.lastIndexOf(joinChar));
        string =
            string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
    }
    return string;
}

/**
 * Gets current array window range
 * @param {Array} arr
 * @param {int} current
 * @param {int} interval
 */
function getRange(arr, current, interval) {
    const max =
        arr.length > current + interval ? current + interval : arr.length;
    current = current + 1;
    return arr.length === 1 || arr.length === current || interval === 1
        ? `[${current}]`
        : `[${current} - ${max}]`;
}

/**
 * Gets the ordinal numeral of a number
 * @param {int} number
 */
function getOrdinalNumeral(number) {
    let numberStr = number.toString();
    if (numberStr === '11' || numberStr === '12' || numberStr === '13')
        return numberStr + 'th';
    if (numberStr.endsWith(1)) return numberStr + 'st';
    else if (numberStr.endsWith(2)) return numberStr + 'nd';
    else if (numberStr.endsWith(3)) return numberStr + 'rd';
    else return numberStr + 'th';
}
function getRandomInt(min, max, exclude = []) {
  const num = parseInt((Math.random() * (max - min + 1)) + min);
  if (exclude.includes(num)) return getRandomInt(min, max, exclude);
  else return num;
}
module.exports = {
  duration,
  getRandomInt,
  capitalize,
  removeElement,
  trimArray,
  trimStringFromArray,
  getRange,
  getOrdinalNumeral,
}

