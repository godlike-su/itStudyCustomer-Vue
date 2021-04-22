<template>
	<div class="test">
		{{message}}
		<button @click="sendMessage">发送</button>
	</div>
</template>
<script>
	import {itStudyMessageWebStock} from '@/type';
	export default {

		data() {
			return {
				websock: null,
				message: '',
				errorTime: 0, //连接失败次数
			}
		},
		created() {
			this.initWebSocket();
		},
		destroyed() {
			this.websock.close() //离开路由之后断开websocket连接
		},
		methods: {
			sendMessage() {
				let req = {};
				req.sendMessage = "15"
				req.sendUserId = "1"
				req.publics = 0
				this.websocketsend(JSON.stringify(req));
			},
			initWebSocket() { //初始化weosocket
				const wsuri = itStudyMessageWebStock + localStorage.getItem("id");
				this.websock = new WebSocket(wsuri);
				this.websock.onmessage = this.websocketonmessage;
				this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onclose = this.websocketclose;
			},
			websocketonopen() { //连接建立之后执行send方法发送数据
				// let actions = {"test":"12345"};        
				let req = {};
				req.sendMessage = "123456"
				req.sendUserId = "1"
				req.publics = 1
				this.websocketsend(JSON.stringify(req));
				this.errorTime = 0
			},
			websocketonerror() { //连接建立失败重连
				if (this.errorTime > 5) {
					return
				}
				this.initWebSocket();
				this.errorTime = this.errorTime + 1;
			},
			websocketonmessage(e) { //数据接收
				const redata = JSON.parse(e.data);
				this.message = redata.sendMessage;
			},
			websocketsend(Data) { //数据发送
				this.websock.send(Data);
			},
			websocketclose(e) { //关闭
				console.log('断开连接', e);
			},
		},
	}
</script>
<style lang='less' scoped="scoped">
</style>
