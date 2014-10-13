var math = (function () {
  'use strict';
  function abs(x) {
    return x instanceof Array ? x.map(abs) : Math.abs(x);
  }
  function dot(x, y) {
    return x.reduce(function (prev, curr, i) {
      return prev + curr * y[i];
    }, 0);
  }
  function subtract(x, y) {
    return x.map(function (e, i) { return e - y[i]; });
  }
  return {
    abs: abs,
    dot: dot,
    subtract: subtract
  };
}());

// console.log(math.abs(-3)); // 3
// console.log(math.abs([-7, 5, -1])); // [7, 5, 1]
// console.log(math.dot([1, 2, 3], [1, 2, 3])); // 14
// console.log(math.subtract([1, 5], [1, 2])); // [0, 3]
