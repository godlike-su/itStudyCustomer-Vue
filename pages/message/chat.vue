<template>
	<div style="position: relative;">
		<van-sticky>
			<van-nav-bar
			  :title="receiveUser.name"
			  left-text="返回"
			  left-arrow
			  @click-left="onClickLeft"
			/>
		</van-sticky>
		<van-pull-refresh v-model="isLoading" @refresh="onLoad" style="padding-bottom: 1.9rem;">
			<!-- 下拉提示，通过 scale 实现一个缩放效果 -->
			  <template #pulling="props">
			    下拉可加载信息
			  </template>
			 <!-- 释放提示 -->
			  <template #loosing>
				释放后加载信息
			  </template>
			  
			<div class="message-personalletter"  style="overflow-y: scroll;" 
			v-for="(item,i) in chatList">
				<div class="myrow" v-if="item.sendUserId.toString()==sendUserId">
					<div class="time">
						{{item.sendTime}}
					</div>
					<!-- 头像 -->
					<div class="thumb">
						<van-image round alt="头像" :src="sendUser.thumb" class="headPort"
						fit="cover" 
						style="width: 3.25rem;height: 3.25rem;"/>
					</div>
					<!-- 信息 -->
					<div class="Information">
						<div class="comment-wrap comments-list-item-content" 
						style="padding: 0.5rem 0.4rem;margin: 0;word-break: break-all;"
						v-html="unemoji(item.sendMessage)"
						>
						</div>
					</div>
				</div>
				
				<div class="otherrow" v-if="item.sendUserId.toString()!=sendUserId">
					<div class="time">
						{{item.sendTime}}
					</div>
					<!-- 头像 -->
					<div class="thumb">
						<van-image round alt="头像" :src="receiveUser.thumb" class="headPort"
						fit="cover" 
						style="width: 3.25rem;height: 3.25rem;"/>
					</div>
					<!-- 信息 -->
					<div class="Information">
						<div class="comment-wrap comments-list-item-content" 
						style="padding: 0.5rem 0.4rem;margin: 0;
						word-break: break-all;"
						v-html="unemoji(item.sendMessage)"
						>
						</div>
					</div>
				</div>
			
			</div>
		</van-pull-refresh>
		
		
		<div style="width:100%;border-radius: 2.125rem;min-height: 2.2375rem;
		border: 1px solid #008A00;position: fixed;bottom: 0rem;padding: 0;margin: 0;background-color: #FFFFFF;"
		@click="personallPopup=true">
			<div class="comment-wrap" style="padding: 0rem 0.5rem 0rem 0.5rem;margin: 0;">
			  <div class="comments-list" 
			  style="padding: 0.5975rem 0.3rem;word-break: break-all;margin: 0;width: 98%;text-align: left;">
					<div class="comments-list-item-content" 
					v-html="unemoji(this.$store.state.CommondContent)" 
					style="word-break: break-all;max-height: 3.9375rem;overflow-y: scroll;">
						
					</div>
			  </div>
			</div>
		</div>
		
		<van-popup v-model="personallPopup" position="bottom" :style="{ height: '12%' }" >
			<Personalletter v-if="personallPopup"></Personalletter>
		</van-popup>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import { Toast } from 'vant';
import axios from 'axios'
import moment from 'moment'
import {itStudyMessageWebStock, photoUrl} from '@/type';
export default {
	// scrollToTop: false,
	data() {
		return{
			personallPopup: false,
			first: true, //首次发送是确认身份
			chatList: [], //聊天的信息
			receiveUserId: this.$route.query.userId,  //接收人id
			sendUserId: 1,	//发送人id，自己的id
			sendUser: [],   //自己的信息
			receiveUser: [], //对方的信息
			isLoading: false, //上拉加载信息
			pageNumber: 1,
			pageCount: 1,
		}
	},
	methods: {
		onClickLeft() {
			this.$router.go(-1)
			// this.$router.push({name: 'message'})
		},
		emoji(word) {
		  // 生成html
		  const type = word.substring(1, word.length - 1);
		  return `<span class="emoji-item-common emoji-${type} emoji-size-small" ></span>`;
		},
		unemoji(word) {
			word = word.replace(/:.*?:/g, this.emoji);
			//空格 回车替换成前端显示的样式
			word = word.replace(/\r\n/g,'<br/>').replace(/\n/g,'<br/>').replace(/\s/g,' ');
			// console.log(word)
			return word;
		},
		//加载信息
		onLoad() {
			let req = {}
			req.receiveUserId = this.receiveUserId
			req.pageNumber = this.pageNumber
			this.$axios({
				url: '/customer/user/chatShowRecord.do',
				method: 'post',
				data: req
			}).then(res => {
				this.pageCount = res.data.data.count
				if(this.pageNumber > this.pageCount/10) {
					Toast('没有记录了')
					this.isLoading = false
					return
				}
				this.pageNumber += 1
				//自己发的信息加在左边，人家发的加在右边
				let data = res.data.data.chatList
				setTimeout(() => {
					for(let i=0; i<data.length; i++) {
						if(data[i].sendUserId.toString()==this.sendUserId.toString())
						{
							data[i].sendTime = moment(data[i].sendTime).locale('zh-cn').format('YYYY-MM-DD HH:mm')
							this.chatList.unshift(data[i])
						}else if(data[i].receiveUserId.toString()==this.sendUserId.toString()){
							data[i].sendTime = moment(data.sendTime).locale('zh-cn').format('YYYY-MM-DD HH:mm')
							this.chatList.unshift(data[i])
						}
					}
					this.isLoading = false
				}, 500);
				if (process.client) {
					// this.$nextTick(() => {
					// 	let msg = document.getElementsByClassName('message-personalletter')
					// 	console.log(msg)
					// 	msg.scrollTop = msg.scrollHeight // 滚动高度
					// })
					window.scrollTo(0,0)
				}
			}).catch(e => {
				
			})
			// dataProcess(data)
		},
		
		initWebSocket(){ //初始化weosocket
		  const wsuri = itStudyMessageWebStock + localStorage.getItem("id");    
			this.websock = new WebSocket(wsuri);        
			this.websock.onmessage = this.websocketonmessage;        
			this.websock.onopen = this.websocketonopen;        
			this.websock.onerror = this.websocketonerror;        
			this.websock.onclose = this.websocketclose; 
		},
		websocketonopen(){ //连接建立之后执行send方法发送数据
		  // let actions = {"test":"12345"};        
		  let req = {};  
			if(this.$store.state.CommondContent.length == 0) 
			{
				//连接，身份验证
				req.sendMessage = '::connect::'
				req.receiveUserId = localStorage.getItem('id')
				req.sendUserId = localStorage.getItem('id')
			}else{
				req.sendMessage = this.$store.state.CommondContent
				req.receiveUserId = this.receiveUserId
				req.sendUserId = this.sendUserId
				req.sendTime =  new Date()
			}
			// req.publics = 0
			this.websocketsend(req)
		},
		websocketonerror(){//连接建立失败重连
			if(this.errorTime > 5) {
				return
			}
		  this.initWebSocket();
				this.errorTime = this.errorTime + 1;
		},
		websocketonmessage(e){ //数据接收
			this.dataProcess(e.data)
		},
		websocketsend(data){//数据发送
		  if(data.sendMessage!='::connect::') {
			let dataValue = data
			dataValue.sendTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm');
		  	this.chatList.push(data)
			this.personallPopup = false		
			//聊天首页将该信息调到最上面
			if(typeof localStorage!= 'undefined' && typeof localStorage.getItem('id') != 'undefined') {
				let chatValue = {}
				chatValue.sendUserId = this.receiveUserId
				chatValue.receiveUserId = this.sendUserId
				chatValue.sendMessage = data.sendMessage
				chatValue.thumb = this.receiveUser.thumb
				chatValue.name = this.receiveUser.name
				chatValue.sendTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm');
				this.appendKeywords(chatValue)
			}
		  }
		  data.publics = 0
		  this.$store.commit('setChat', 0)
		  this.$store.commit('setCommondContent', '');
		  this.websock.send(JSON.stringify(data));
		  this.errorTime = 0
		},
		websocketclose(e){  //关闭
		  console.log('断开连接',e);
		},
		//数据处理
		dataProcess(data) {
			data = JSON.parse(data);
			if(data.sendMessage=='::connect::') {
				return
			}
			
			//自己发的信息加在左边，人家发的加在右边
			if(data.sendUserId.toString()==this.sendUserId.toString())
			{
				// chatList.push(data)
				// console.log('自己的信息')
			}else if(data.receiveUserId.toString()==this.sendUserId.toString()){
				data.sendTime = moment(data.sendTime).locale('zh-cn').format('YYYY-MM-DD HH:mm')
				this.chatList.push(data)
				let chatValue = {}
				chatValue.sendUserId = this.receiveUserId
				chatValue.receiveUserId = this.sendUserId
				chatValue.sendMessage = data.sendMessage
				chatValue.thumb = this.receiveUser.thumb
				chatValue.name = this.receiveUser.name
				chatValue.sendTime = data.sendTime;
				this.appendKeywords(chatValue)
			}
		},
		appendKeywords(value) {
			/**
			 * 1.已经有的关键词不再添加
			 * 2.添加到数组的首位
			 * 3.添加到缓存
			 */
			let appendFlag = true
			let chat = 'chat' + localStorage.getItem('id')
			let chatList = JSON.parse(localStorage.getItem(chat)) || []
			if (chatList !== null && chatList !== undefined ) {
			 //如果历史记录有了，则把该记录调到最前面
			  for(let i=0; i<chatList.length; i++){
				  let currentValue = chatList[i].sendUserId
				  if (currentValue == value.sendUserId) {
					appendFlag = false
					chatList.splice(i, 1);
					chatList.unshift(value)
					localStorage.setItem(chat, JSON.stringify(chatList))	
					return
				  }
			  }
			  
			  // 添加
			  if (appendFlag === true) {
			  	chatList.unshift(value)
			  	localStorage.setItem(chat, JSON.stringify(chatList))
			  } 
			  
			}
		},
		//解除未读状态
		clearChatCOUNT() {
			let req = {}
			req.receiveUserId = this.receiveUserId
			
			//解除未读状态
			this.$axios({
				url: '/customer/user/chatStatusOne0.do',
				method: 'post',
				data: req
			}).then(res => {
				//清除未读状态
				let appendFlag = true
				let chat = 'chat' + localStorage.getItem('id')
				let chatList = JSON.parse(localStorage.getItem(chat)) || []
				if (chatList !== null && chatList !== undefined ) {
				 //如果历史记录有了，则把该记录调到最前面
				  for(let i=0; i<chatList.length; i++){
					  let currentValue = chatList[i].sendUserId
					  if (currentValue == this.receiveUserId) {
						appendFlag = false
						// chatList.splice(i, 1);
						chatList[i].COUNT = ''
						localStorage.setItem(chat, JSON.stringify(chatList))	
						return
					  }
				  }
				  // 添加
				  if (appendFlag === true) {
					let chatValue = {}
					chatValue.sendUserId = this.receiveUserId
					chatValue.receiveUserId = this.sendUserId
					chatValue.sendMessage = ''
					chatValue.thumb = this.receiveUser.thumb
					chatValue.name = this.receiveUser.name
					chatValue.sendTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm');
					chatValue.COUNT = ''
					
				  	chatList.unshift(chatValue)
				  	localStorage.setItem(chat, JSON.stringify(chatList))
				  } 
				}
			}).catch(e => {
				Toast.fail(e)
			})
		},
	},
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit('setChat', 0)
		
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
		this.$store.commit('setCommondContent', '');	
	},
	mounted() {
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	//http://127.0.0.1:3000/message
		//首先查找对方信息，和自己的信息
		this.sendUserId = localStorage.getItem('id')
		if(this.sendUserId == this.receiveUserId) {
			Toast.fail('不能给自己发信息')
			this.$router.push('/message')
			
			return
		}
		let req = {}
		req.receiveUserId = this.receiveUserId
		//获取对方信息
		this.$axios({
			url: '/customer/user/chat/info.do',
			method: 'post',
			data: req
		}).then(res => {
			res.data.data[0].thumb = photoUrl + res.data.data[0].thumb
			this.sendUser = res.data.data[0]
			res.data.data[1].thumb = photoUrl + res.data.data[1].thumb
			this.receiveUser = res.data.data[1]
			this.clearChatCOUNT()
		}).catch(e => {
			// Toast.fail(e)
			console.log(e)
		})
		//获取聊天记录
		this.onLoad()
		this.initWebSocket();
		this.$store.commit(HIDE_TABBAR_MUTATION, false);
		
	},
	destroyed() {
		// return
		this.$store.commit('setChat', 0)
		this.websock.close() //离开路由之后断开websocket连接
	},
	computed: {
		//监听是否上传信息
		isChat() {
			return this.$store.state.chat
		},
	},
	watch: {
		isChat(newVal, oldVal) {
			// this.$store.commit('setChat', 0)
			if(newVal == 0) {
				return
			}
			this.$nextTick(() => {
				let msg = document.getElementsByClassName('message-personalletter')
				msg.scrollTop = msg.scrollHeight // 滚动高度
			})
			// console.log('发送了信息')
			this.websocketonopen()
		},
	}
	
}
</script>

<style lang="scss">

@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css";  // 导入精灵图样式
.message-personalletter{
	position: relative;
	padding: 0.625rem 0.3125rem;
 }
.message-personalletter .myrow{
	float: right;
	width: 100%;
	// 
	.time{
		text-align: center;
		color: rgb(150,164,196); 
		font-size: 0.9375rem;
	}
	.thumb{
		float: right;
	}
	.Information{
		max-width: 60%;
		float: right;
		border: 1px solid #0066CC;
		border-radius: 5px;
		margin: 0.3125rem 0rem 0.375rem;
	}
}
.message-personalletter .otherrow{
	float: left;
	width: 100%;
	.time{
		text-align: center;
		color: rgb(150,164,196); 
		font-size: 0.9375rem;
	}
	.thumb{
		float: left;
	}
	.Information{
		max-width: 60%;
		float: left;
		border: 1px solid #0066CC;
		border-radius: 5px;
		margin: 0.3125rem 0rem 0.375rem;
	}
}

</style>
