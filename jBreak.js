
(function(global,factory){
	if(typeof module === 'object' && typeof module.exports === 'object'){
		module.exports = global.document ? 
			factory(global,true) :
			function(windowww){
				if(!windowww.document){
					throw new Error('we need a window with a document.');
				}
				return factory(windowww);
			};
	}else{
		factory(global);
	}
})(typeof window !== 'undefined' ? window : this,function(window,noGlobal){
	// let's coding!
});