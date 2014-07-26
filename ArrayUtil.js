// Utility classes for Array

ArrayUtil = {};

ArrayUtil.Create2DAllo = function (sizeX, sizeY) {

  var base = new Array(sizeX);
  for (var i = 0; i < sizeX; ++i)
    base[i] = new Array(sizeY);

  return base;
}

ArrayUtil.Create3DAllo = function (sizeX, sizeY, sizeZ) {

  var base = new Array(sizeX);
  for (var i = 0; i < sizeX; ++i) {
    base[i] = new Array(sizeY);
    for (var j = 0; j < sizeY; ++j) {
      base[i][j] = new Array(sizeZ);
    }
  }

  return base;
}

module.exports = ArrayUtil;
