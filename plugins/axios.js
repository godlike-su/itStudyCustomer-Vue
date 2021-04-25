import { Toast, Dialog } from 'vant';
export default function({$axios,redirect,router,store,app}){
	//基本配置
	
	// $axios.defaults.timeout=10000;
	$axios.defaults.timeout=5000;
	
    // $axios.defaults.method = 'post';
	//请求拦截
	$axios.onRequest(config=>{
		// console.log('请求拦截')
		console.log('访问路径为： ' + config.url);
		if(config.method.toUpperCase() === 'GET'){
			// console.log('GET请求')
		}else{
			if(!(typeof localStorage=="undefined") && localStorage.getItem("token")!=null ){
				// console.log("token: " + localStorage.getItem("token"))
				config.contentType = 'application/json';
				config.dataType = 'json';
				if(!(typeof config.data == 'undefined')){
					config.headers = {'Content-Type':'application/json'};
					config.data = JSON.stringify(config.data)
				}
				config.headers.authorization = "Bearer " + localStorage.getItem("token")
			}
			else{
				config.contentType = 'application/json';
				config.headers = {'Content-Type':'application/json'};
				config.dataType = 'json';
				config.data = JSON.stringify(config.data)
				// config.methods = 'post' 
				config.method = 'post'
				// console.log(config)
			}
			
		}
		return config;
	})
	
	//响应拦截
	$axios.onResponse(res=>{
		//登录超时
		if(res.data.error==401){
			Toast("未登录")
			store.commit("logout")
			return Promise.reject(res);
			// alert("登录验证过期，请重新登录！")
			// router.push({name: 'index-typeId', params:{typeId: this.$store.state.typeId}, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
		}else if(res.data.error==-1){
			return Promise.reject(res);
		}
		return res;
		
		
	})
	//错误处理
	$axios.onError(error=>{
		
		// console.log('错误拦截: ');
		console.log(error.message)
		if( typeof error.message!='undefined' && error.message.includes("timeout"))
		{
			const data = {}
			data.error = -1
			data.code = -1
			data.status = -1
			data.reason = '网络开小差了!'
			error.data = data
			Toast.fail('网络开小差了!')
		}
		// 处理
		else if( typeof error.message!='undefined' && (error.message.includes("504") ||  
		error.message.includes("Network") || 
		error.message.includes("404")))
		{
			// console.log("属性错误")
			const data = {}
			data.error = 504
			data.code = 504
			data.status = 504
			data.reason = '系统错误!'
			error.data = data
			Toast.fail('系统错误!')
		}
		// else if(typeof error.data != 'undefined' && error.data.error === 401) {
		// 	Toast("未登录")
		// 	console.log('..')
		// 	store.commit("logout")
		// 	return Promise.reject(res);
		// }
		
		return Promise.reject(error);
	})
	
}