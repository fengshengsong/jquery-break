'use strict'

const Ajax = {

	createXhrObject:function(){  
		if(typeof window.XMLHttpRequest != 'undefined'){  
			return new XMLHttpRequest();  
		}else if(typeof window.ActiveXObject != 'undefined'){  
			return new ActiveXObject('Microsoft.XMLHTTP');  
		}else{  
			throw new Error("该换浏览器了");  
		}  
	},
	transformData:function(data){
        if (data == null){
            return data;
        }
        let arr = [];
        for(let [key,value] of Object.entries(data)){
            let str = key+'='+value;
            arr.push(str);
        }
        return arr.join("&");
    },
	ajax:function(options){
		let url = options.url || '';
		let type = options.type || 'get';
		let async = options.async || true;
		let data = options.data || null;
		let success = options.success || null;
		let error = options.error || null;
		let contentType = options.contentType || 'application/x-www-form-urlencoded';
		let xhr = this.createXhrObject();

		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4){
				if (xhr.status>=200&&xhr.status<300 || xhr.status==304){
					if(success){
						success(xhr.responseText);
					}
				}else{
					if(error){
						error(xhr.status);
					}
				}
			}
		}  
		if (type == "post"){
			xhr.open(type,url,async);
			xhr.setRequestHeader("Content-Type",contentType);
			xhr.send(data);
		}else{
			url = url+'?'+this.transformData(data);
			xhr.open(type,url,async);
			xhr.send(null);
		}
	}
}

