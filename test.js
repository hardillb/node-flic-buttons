var Flic = require('./index.js');

var flic = new Flic();

flic.on('click',function(d) {
  console.log('%j',d);
});
