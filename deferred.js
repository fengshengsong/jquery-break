'use strict'

const Callbacks = require('./Callbacks');

const Deferred = function(func){
	var tuples = [
		['resolve','done',Callbacks({memory:true,once:true}),'resolve'],
		['reject','fail',Callbacks({memory:true,once:true}),'rejected'],
		['notify','progress',Callbacks({memory:true})]
	],
	state = 'pending',
	promise = {
		state:function(){
			return state;
		},
		always:function(){
			deferred.done(arguments).fail(arguments);
			return this;
		},
		then:function(onFulfilled,onRejected,onProgress){
			var fns = arguments;
			// 同样返回一个Deferred对象
			return Deferred(function(newDefer){
				tuples.forEach(function(tuple,index){
					// tuple[0]为改变状态的操作
					var action = tuple[0],
					// fn为传入的对应状态的回调函数
					fn = typeof fns[index] === 'function' && fns[index];
					// tuple[1]为函数名
					// deferred[ done | fail | progress ]
					// 添加回调函数
					deferred[tuple[1]](function(){
						var returned = fn && fn.apply(this,arguments);
						if(returned && typeof returned.promise === 'function'){
							returned.promise()
									.done(newDefer.resolve)
									.fail(newDefer.reject)
									.progress(newDefer.notify);
						}else{
							newDefer[action+'With'](this === promise ? newDefer.promise : this,fn?[returned] : arguments);
						}
					});
				});
				fns = null;
			}).promise();
		},
		// 使其具有promise对象的方法
		promise:function(obj){
			return obj != null ? Object.assign(obj,promise) : promise;
		}
	},
	deferred = {};

	// 向前兼容pipe方法
	// promise.pipe = promise.then;

	tuples.forEach(function(tuple,index){
		// 相应状态所添加的回调函数队列
		var list = tuple[2];
		// 相应的状态
		var	stateString = tuple[3];
		// promise[ done | fail | progress ] = list.add
		promise[tuple[1]] = list.add;
		// 如果存在最终状态则默认会添加三个回调函数
		if(stateString){
			list.add(
				// 首先是改变对象状态
				function(){state = stateString;},
				// 然后是设置一个failList或者doneList为disable
				tuples[i^1][2].disable,
				// 设置processList为lock
				tuples[2][2].lock
			);
		}
		// 向deferred对象中添加方法
		// deferred[ resolve | reject | notify ]
		deferred[tuple[0]] = function(){
			// deferred[ resolveWith | rejectWith | notifyWith ]
			deferred[tuple[0]+'With'](this === deferred ? promise : this,arguments);
			return this;
		}
		// 触发回调函数
		deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
	});

	// 使deferred拥有promise的方法
	promise.promise(deferred);

	if(func){
		func.call(deferred,deferred);
	}

	return deferred;

}