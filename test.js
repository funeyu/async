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

// =============================================
// each的使用
var async = require('./async.js');
async.each(['12;jd;ajsf;oijasof', 'jasfja', 'asjdfiaj'], function(file, callback) {

  if( file.length > 12 ) {
    console.log('This file name is too long');
    callback('File name too long');
  } else {
    console.log('File processed');
    callback();
  }
}, function(err){
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
});

// =============================================
// series的使用
async.series([
  function(callback) {
    callback(null, 'one')
  },
  function(callback) {
    callback('孩子')
  }
], function(err, results) {
  if(err) {
    return console.log(err);
  }
  console.log(results)
})

async.series([
  function(callback) {
    callback(null, 'one')
  },
  function(callback) {
    callback(null, '海子')
  }
], function(err, results) {
  if(err) {
    return console.log(err);
  }
  console.log(results)
})

// =============================================
// waterfall的使用

function myFirstFunction(callback) {
  callback(null, 'one', 'two');
}
function mySecondFunction(arg1, arg2, callback) {
  console.log(arg1, arg2, 'cooo');
  setTimeout(function() {
    callback(null, 'three');
  }, 1000)

}
function myLastFunction(arg1, callback) {
  console.log(arg1);
  callback('nullhellll', 'done');
}
async.waterfall([
  myFirstFunction,
  mySecondFunction,
  myLastFunction
], function (err, result) {
  if(err) {
    return console.log(err);
  }
  console.log(result);
})


// ===========================================
// reduce的使用
async.reduce(['one', 'two', 'three', 'four'], 'acc', function(pre, cur, callback) {
  setTimeout(function(){
    cur += 1
    pre += cur
    callback(null, pre)
  }, 1000);
}, function(err, result) {
  console.log(result);
})

// ============================================
// compose的使用
function add1(n, callback) {
  setTimeout(function() {
    callback(null, n + 1);
  }, 100)
}
function mul3(n, callback) {
  setTimeout(function() {
    callback(null, n * 3);
  }, 200)
}
var add1mul3 = async.compose(mul3, add1)

add1mul3(4, function(err, result) {
  console.log(result)
})

// ============================================
// whilst的使用
var count = 0;

async.whilst(
    function () { return count < 5; },
    function (callback) {
        count++;
        setTimeout(callback, 1000);
    },
    function (err) {
        // 5 seconds have passed
    }
);
