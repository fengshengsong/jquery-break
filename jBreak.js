
(function(global,factory){
	if(typeof module === 'object' && typeof module.exports === 'object'){
		// CommonJS环境
		module.exports = global.document ?
			// 存在document的环境
			factory(global,true) :
			function(w){
				if(!w.document){
					throw new Error('we need a window with a document.');
				}
				return factory(w);
			};
	}else{
		factory(global);
	}
})(typeof window !== 'undefined' ? window : this,function(window,noGlobal){
	// let's coding!
	var jBreak = function(selector, context){
		return new jBreak.fn.init(selector, context);
	};

	// 构造
	jBreak.fn = jBreak.prototype = {
		construtor: jBreak,
		length: 0,
		// 实现链式调用
		pushStack: function(elems){
			// 构建一个新的jBreak对象
			var ret = jBreak.merge(this.construtor(),elems);
			ret.prevObject = this;
			ret.context = this.context;
			return ret;
		},
		end: function(){
			return this.prevObject || this.construtor(null);
		}
		eq: function(i){
			var len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j <len ? [this[j]] : []);
		}
	};

	// jBreak.extend(object)为jBreak添加静态方法
	// jBreak.fn.extend(object)为每个jBreak实例添加实例方法
	// 通过this来确定目标对象
	jBreak.extend = jBreak.fn.extend = function(){
		var src,copyIsArray,copy,name,options,clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			// 是否深拷贝
			deep = false;
		if(typeof target === 'boolean'){
			deep = true;
			target = arguments[1] || {};
			i = 2;
		}
		if(typeof target !== 'object' && jBreak.isFunction(target)){
			target = {};
		}
		// 如果除了deep外，只传入了一个参数则表示是静态方法
		if(typeof length === i){
			target = this;
			--i;
		}
		for(; i < length; i++){
			if((options = arguments[i]) != null){
				for(name in options){
					src = target[name];
					copy = options[name];
					// 防止自引用造成死循环,例如jBreak.extend(true,target,{'target':target})
					if(target == copy){
						continue;
					}
					if(deep && copy && (jBreak.isPlainObject(copy) || copyIsArray == jBreak.isArray(copy))){
						if(copyIsArray){
							copyIsArray = false;
							clone = src && jBreak.isArray(src) ? src : [];
						}else{
							clone = src && jBreak.isPlainObject(src) ? src : {};
						}
						target[name] = jBreak.extend(deep,clone,copy);
					}else if(copy !== undefined){
						target[name] = copy;
					}
				}
			}
		}
		return target;
	};

	jBreak.extend({
		noConflict: function(deep){
			if(window.$ === jBreak){
				window.$ = _$;
			}
			if(deep && window.jBreak === jBreak){
				window.jBreak = _jBreak;
			}
			return jBreak;
		},
		isArray: Array.isArray,
		isFunction: function(obj){
			return jBreak.type(obj) === 'function';
		},
		isPlainObject: function(obj){
			var proto,Ctor;
			if(!obj || toString.call(obj) !== "[object Object]"){
				return false;
			}
			proto = Object.getPrototypeOf(obj);
			if(!proto){
				return true;
			}
			Ctor = hasOwn.call(proto,"construtor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		}
	});


});