console.logCopy = console.log.bind(console);

console.log = function(data)
{
    var currentDate = '[' + new Date().toUTCString() + '] ';
	console.logCopy(currentDate.yellow);
	
    this.logCopy.apply(this, arguments);//, currentDate);
};