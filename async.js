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

  // asyncFun 只要有一个error就立即stop所有其他的asyncFun? 能做到吗
  // 呵呵 做不到
  eachI: function(datas, asyncFun, callback) {

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

    return iter()
  },

  waterfall: function(tasks, callback) {
    var iter = function() {
      if(iter.current >= tasks.length) {
        return callback.apply(null, [null].push(iter.arg));
      }

      iter.arg = iter.arg || [] ;
      [].push.apply(iter.arg, [callWrapper]);
      tasks[iter.current].apply(this, iter.arg);
      iter.current ++;
    }
    iter.current = 0;

    var callWrapper = function() {
      var err = Array.prototype.slice.call(arguments, 0, 1);
      if(err){
        return callback(err)
      }
      iter.arg = Array.prototype.slice.call(arguments, 1, arguments.length);
      console.log(iter.arg)
      iter()
    }

    iter()
  }
};
