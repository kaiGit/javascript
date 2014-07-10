console.log("start");

var prev = null;

var i = -2147483648;
prev = i;
for (i = i + 1; i < 2147483648; ++i)
{
  if (i % 10000000 === 0)
    console.log("i = " + i.toString());

  var x = Math.abs(Number(i - prev)) ;
  if (x > 1.0000001 || x < 0.999999)
  {
    console.error("Integer precison loss " + prev.toString() + " " + i.toString());
  }
  else
  {
       prev = i;
  }
}

console.log("all done");
