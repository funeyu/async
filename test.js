var async = require('./async');

// paralle的使用
var parallel = async.parallel([
  function(callback) {
    setTimeout(function() {
      callback(null, 'nodejs');
    }, 1000);
  },
  function(callback) {
    setTimeout(function() {
      callback(null, 'nodejs2');
    }, 2000)
  }
], function(err, results) {
  console.log(results);
});

// ==============================================
// iterator的使用
var iterator = async.iterator([
  function(node) {console.log('one' + node)},
  function(node) {console.log('two' + node)},
  function(node) {console.log('three' + node)}
]);

var one = iterator(1);
var two = one(false);
var three = two(null);

// =============================================
// retry的使用
async.retry({times: 3, interval: 2000},
  function(){
    console.log('java'); return 'java'
  },
  function(error, result){
    if(error){
      console.log(error)
    } else {
      console.log(result)}
    });

// =============================================
// map的使用
var AsyncSquare = {
  squareExponent: 2,
  square: function(number, callback) {
    var result = Math.pow(number, this.squareExponent);
    setTimeout(function() {
      callback(null, result);
    }, 2000);
  }
}
async.map([1, 2, 3], AsyncSquare.square.bind(AsyncSquare), function(err, result) {
  console.log(result)
})
