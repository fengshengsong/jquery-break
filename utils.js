'use strict'

const toString = Object.prototype.toString;

var utils = {
	isFunction:function(obj){
		return toString.call(obj) === '[object Function]';
	},
	isArray:function(obj){
		return toString.call(obj) === '[object Array]';
	},
	debounce:function(fn,delay){
	},
	throttle:function(fn,delay){
	},
	each:function(obj,callback){
		var key,
			index = 0,
			length = obj.length,
			obj_is_array = this.isArray(obj);
			console.log(obj_is_array);
		if(obj_is_array){
			for(;index<length;){
				if(callback.call(obj[index],index,obj[index++]) === false){
					break;
				};
			}
		}else{
			for(key in obj){
				if(callback.call(obj[key],key,obj[key]) === false){
					break;
				}
			}
		}
	}
}	

