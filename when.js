'use strict'

function adoptValue(value,resolve,reject){
	var method;
	try {
		if(value && typeof (method = value.promise) === 'function'){
			method.call(value).done(resolve).fail(reject);
		}else if(value && typeof (method = value.then) === 'function'){
			method.call(value,resolve,reject);
		}else{
			resolve.call(undefined,value);
		}
	} catch(value){
		reject.call(undefined,value);
	}
}

var when = function(singleValue){
	var 
		remaining = arguments.length;
		i = remaining;
		resolveContexts = Array(i);
		resolveValues = Array.from(arguments);
		master = Deferred(),
		updatedFunc = function(i){
			return function(value){
				resolveContexts[i] = this;
				resolveValues[i] = arguments.length > 1 ? Array.from(arguments) : value;
				if(!(--remaining)){
					master.resolveWith(resolveContexts,resolveValues);
				}
			}
		} 
	if(remaining <= 1){
		adoptValue(singleValue,master.done(updatedFunc(i)).resolve,master.reject);
		if(master.state() === 'pending' || typeof (resolveValues[i] && resolveValues[i].then) === 'function'){
			return master.then;
		}
	}
	while(i--){
		adoptValue(resolveValues[i],updateFunc(i),master.reject);
	}
	return master.promise();
}