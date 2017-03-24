var assert = require('assert')

module.exports =  async = {
  retry: function(options, calledMethod, callback) {
    var i = 1;
    var retryIn = setInterval(function(){
      var result;
      try {
        result = calledMethod();
        i ++;
        if (i >= options.times) {
          clearInterval(retryIn)
        }
      } catch(error) {
        return callback(error);
      }
      callback(result)
    }, options.interval || 5000);
  },

  iterator: function(iterators) {
    var iters = function() {
      var current = iters.next();
      if(!current) return ;
      current.apply(null, arguments);
      return iters
    }

    iters.current = 0;
    iters.next = function() {
      return iters.current < iterators.length ? iterators[iters.current++] : null
    };

    return iters
  },

  parallel: function(methods, callback) {
    var results = [], errors=[], done = 0;
    var callbacks = function(i) {
      return function(error, result) {
        done ++;
        error
          ? (errors[i] = error)
          : (results[i] = result);

        if(done == methods.length) {
          callback(errors.length > 0 ? errors : null, results)
        }
      }
    }

    for(var i = 0; i < methods.length; i++) {
      methods[i].call(null, callbacks(i));
    }
  },

  map: function(datas, asyncFun, callback) {
    assert(asyncFun.length >= 2, 'asyncFun 的参数个数要大于1')

    var results = [], errors = [], done = 0;
    var callbacks = function(i) {
      return function(error, result) {
        done ++
        error
          ? errors[i] = error
          : results[i] = result

        if(done === datas.length) {
          callback(errors, results)
        }
      }
    }

    for(var i = 0, length = datas.length; i < length; i++) {
      asyncFun.call(this, datas[i], callbacks(i))
    }
  },

  each: function(datas, asyncFun, callback) {

    var onError = function(err) {
      if(err) {
        callback(err)
      }
    }
    for(var i = 0; i < datas.length; i++) {
      asyncFun.call(this, datas[i], onError)
    }
  },

  // asyncFun 只要有一个error就立即stop所有其他的asyncFun? 能做到吗
  eachI: function(datas, asyncFun, callback) {

  }
};
