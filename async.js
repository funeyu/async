/*
亚洲铜 ----海子

亚洲铜 亚洲铜
祖父死在这里，父亲死在这里，我也会死在这里
你是唯一的一块埋人的地方

亚洲铜，亚洲铜
爱怀疑和爱飞翔的是鸟，淹没一切的是海水
你的主人却是青草，住在自己细小的腰上，守住野花的手掌和秘密

亚洲铜，亚洲铜
看见了吗？那两只白鸽子，它是屈原遗落在沙滩上的白鞋子
让我们——我们和河流一起 穿上它吧

亚洲铜，亚洲铜
击鼓之后，我们把在黑暗中跳舞的心脏叫做月亮
这月亮主要由你构成

*/
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

  reduce: function(datas, acc, asyncTask, callback) {

    var iter = function(pre) {
      if(iter.current < datas.length) {
        // 保证asyncTask 有三个参数 asyncTask(pre, curr, callback)
        asyncTask.call(this, pre, datas[iter.current++], callWrapper)
      }
    }
    iter.current = 0

    var callWrapper = function(err, result) {
      if(err)
        return callback(err)
      if(iter.current >= datas.length)
        return callback(null, result)

      iter(result)
    }

    iter(acc)
  },

  series: function(tasks, callback) {
    var error, results = []
    var iter = function() {
      var method = iter.next()
      if(method) {
        method.call(this, function(err, result) {
          if(err){
            callback(err)
          } else {
            results.push(result)
            iter()
          }
        })
      }
      else {
        callback(null, results)
      }
    }
    iter.current = 0
    iter.next = function() {
      return (++iter.current) > tasks.length
        ? null
        :tasks[iter.current - 1]
    }

    iter()
  },

  waterfall: function(tasks, callback) {
    var iter = function() {
      if(iter.current >= tasks.length) {
        var done = [null];
        Array.prototype.push.apply(done, arguments);
        return callback.apply(this, done);
      }

      arguments = Array.prototype.slice.apply(arguments)
      arguments.push(callWrapper)
      tasks[iter.current++].apply(this, arguments);
    }
    iter.current = 0;

    var callWrapper = function() {
      var err = Array.prototype.shift.call(arguments);
      if(err){
        return callback(err)
      }
      iter(...Array.prototype.slice.call(arguments))
    }

    iter()
  },

  compose: function() {
    if(arguments.length < 2) {
      throw new Error('the arguments should be more than 2');
    }

    var funs = Array.prototype.slice.call(arguments).reverse();
    return function(data, callback) {
      var iter = function(err, result) {
        if(err) {
          return callback(err)
        }
        if(iter.current >= funs.length) {
          return callback(null, result)
        }
        funs[iter.current ++].call(this, result, iter)
      }
      iter.current = 0;

      iter(null, data)
    }
  }
};
