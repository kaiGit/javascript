// Utility classes for Array

ArrayUtil = {};

ArrayUtil.Create2DAllo = function (sizeX, sizeY) {

  var base = new Array(sizeX);
  for (var i = 0; i < sizeX; ++i)
    base[i] = new Array(sizeY);

  return base;
}

module.exports = ArrayUtil;
