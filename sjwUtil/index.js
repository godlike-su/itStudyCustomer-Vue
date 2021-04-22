// import axios from 'axios'; 
import { Toast } from 'vant';

//更改时间：2020/11/22
/*
基于vant的UI框架，更只需将error函数中的 Toast 位置更改成 alert() 或者自己喜欢的样子即可
封装了一些方法

post:post请求
get:get请求
error:用于post请求或者get请求，没有设置错误函数处理的默认处理方式
*/

// post请求
// serviceUri 服务名, req 请求参象 , axios为传过来的axios, okHandler 应答数据处理函数
// errorHandler 处理处理器, 可以为null
export function post(serviceUri,req,axios,okHandler,errHandler){
	axios({
		url: serviceUri,
		method: "post",
		data: JSON.stringify(req),
		dataType: 'json',
		contentType: "application/json",
		headers: {'Content-Type': 'application/json'}
	})
	.then(res => {
		// console.log("调用：" + res)
		//如果返回结果，默认调用自己设置的方法，否则返回数据
		if(res.data.error==0){
			if(typeof okHandler=='undefined' || okHandler=='null'){
				//由于是异步操作，这里得使用await才能传回值，否则由于网络传输，值是传不回去的
				Toast("操作成功")
				return res
			}
			else{
				// console.log(res.data)
				okHandler(res.data)
			}
		}
		//如果返回错误，默认调用设定的错误方法，否则调用默认设置错误方法
		if(res.data.error==-1){
			if(typeof errHandler=='undefined' || errHandler=='null'){
				//由于是异步操作，这里得使用await才能传回值，否则由于网络传输，值是传不回去的
				error(res.data.reason)
				// return res.data
			}
			else{
				errHandler(res)
			}
		}
	})
	.catch(e => {
			if(typeof errHandler=='undefined' || errHandler=='null'){
				error(e)
			}
			else{
				let error = {};
				error.data = {};
				error.data.error = -1;
				error.data.reason = "系统抛出异常：" + e;
				error.msg = -1;
				errHandler(error)
			}
			console.log("错误")
	});
}

// get请求
// serviceUri 服务名, req 请求参象 , axios为传过来的axios, okHandler 应答数据处理函数
// errorHandler 处理处理器, 可以为null
export function get(serviceUri,req,axios,okHandler,errHandler){
	axios({
		url: serviceUri,
		method: "get",
		params: req
		// data: JSON.stringify(req),
		// dataType: 'json',
		// contentType: "application/json"
	})
	.then(res => {
		// console.log(res.data.error)
		//如果返回错误，默认调用设定的错误方法，否则调用默认设置错误方法
		if(typeof okHandler=='undefined' || okHandler=='null'){
			//由于是异步操作，这里得使用await才能传回值，否则由于网络传输，值是传不回去的
			return res
		}
		else{
			okHandler(res)
		}
	})
	.catch(e => {
			if(typeof errHandler=='undefined' || errHandler=='null'){
				error(e)
			}
			else{
				let err = {};
				err.data = {};
				err.data.error = -1;
				err.data.reason = "系统抛出异常：" + e;
				err.msg = -1;
				errHandler(e)
			}
			console.log("错误")
	});
}
export function error(e){
	Toast.fail("网络错误：" + e)
	return e
}