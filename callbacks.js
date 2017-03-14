'use strict'

var Callbacks = function(options){
	options = typeof options === 'object' ? options : {
		once:false,
		memory:false,
		stopOnFalse:false,
		unique:false
	};
	// 储存最后一次fire触发回调时所传入的参数
	var memory,
		locked,
		fired,
		firing,
		firingIndex = -1,
		// 回调函数列表
		list = [],
		// 可重复回调函数列表的参数队列
		queue = [],
		_fire = function(){
			locked = options.once;
			fired = firing = true;
			for ( ; queue.length ; firingIndex = -1 ) {
				// 取出存储的最后一个参数
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {
					// 回调函数返回false且设置了stopOnFalse则立即停止执行回调函数列表
					if (list[firingIndex].apply(memory[0],memory[1]) === false && options.stopOnFalse){
						// 直接跳出执行，memory设置为false使得而后添加的回调函数不会被自动执行
						firingIndex = list.length;
						memory = false;
					}
				}
			}
			// 执行完成后应该将memory中的值丢弃
			if(!options.memory){
				memory = false;
			}
			firing = false;
			// 回调函数只能执行一次
			if(locked){
				if(memory){
					list = [];
				}else{
					list = "";
				}
			}
		},
		self = {
			add:function(){
				if (list){
					if (memory && !firing){
						firingIndex = list.length - 1;
						queue.push(memory);
					}
					(function add(args){
						args.forEach(function(arg){
							if(typeof arg === 'function'){
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}else if(arg && arg.length && typeof arg !== "string"){
									add(arg);
								}
							}
						});
					})(arguments);
					// 如果设置了memory并且没有回调函数在执行则add回调函数后应该立即执行
					if (memory && !firing) {
						_fire();
					}
				}
				return this;
			},
			remove:function(){
				if(list){
					var args = Array.from(arguments);
					args.forEach(function(arg){
						var index;
						while((index = list.findIndex(function(value){return arg === value})) > -1){
							list.splice(index,1);
							if (index <= firingIndex){
								firingIndex--;
							}
						}	
					});
				}
				return this;
			},
			has:function(arg){
				return list.findIndex(function(value){return arg === value}) > -1 ? true : false;
			},
			empty:function(){
				if(list){
					list = [];					
				}
				return this;
			},
			disable:function(){
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled:function(){
				return !list;
			},
			lock:function(){
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked:function(){
				return !!locked;
			},
			fireWith:function(context,args){
				if (!locked){
					args = args || [];
					args = [context,args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						_fire();
					}
				}
				return this;
			},
			fire:function(){
				self.fireWith(this,arguments);
				return this;
			},
			fired:function(){
				return !!fired;
			}
		};
	return self;
}