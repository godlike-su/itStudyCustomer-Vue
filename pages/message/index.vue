<template>
	<div class="message-container">
		<!-- 头部导航栏 -->
		<van-nav-bar
		  title="信息"
		>
			<template #right >
				<van-icon name="brush-o" size="18" @click="clearChatList()"/>
			</template>
		
		</van-nav-bar>
			 
		</van-nav-bar>
		<div class="row">
			<van-cell  size="large"    is-link>
				<template #title>
				    <van-icon name="bulb-o" color="#1989fa" size="18"/>
					<span class="custom-title">评论和回复</span>
				</template>
			</van-cell>
			<!-- <van-cell  size="large"    is-link>
				<template #title>
					<van-icon name="good-job-o" color="#ff0000" size="18"/>
					<span class="custom-title">点赞</span>
				</template>
			</van-cell> -->
			<van-cell  size="large"    is-link to="/message/followers">
				<template #title>
					<van-icon name="friends-o" color="#ff0000" size="18"/>
					<span class="custom-title">关注</span>
				</template>
			</van-cell>
			<van-cell  size="large"  is-link to="/message/fans">
				<template #title>
					<van-icon name="contact" color="#00557f" size="18"/>
					<span class="custom-title">粉丝</span>
				</template>
			</van-cell>
			<van-cell  size="large"    is-link>
				<template #title>
					<van-icon name="bullhorn-o" color="#ffaaff" size="18"/>
					<span class="custom-title">助手</span>
				</template>
			</van-cell>
		</div>
		
		<!-- 私信列表 -->
		<div class="row" v-for="(item, i) in chatList">
			<van-swipe-cell>
				<van-cell :value="item.sendTime" size="large" @click="clickInformationCell(item.sendUserId)"  >
					<template #title>
						<div style="position: relative;">
							<!-- 展示头像 -->
							<van-image round alt="头像" :src="item.thumb" class="headPort"  
							fit="cover" 
							style="width: 3.85rem;height: 3.85rem;"/>
							
							<!-- 展示对方昵称 -->
							<span class="custom-title" style="position: absolute;top: 0.3125rem;" >{{item.name}}</span>
							
							<!-- 展示信息 -->
							<div class="comment-wrap" style="padding: 0px; margin: 0px 0rem 0rem 4.0625rem;">
								<div class="comments-list-item-content"
								style="position: absolute;bottom: 0.3125rem;color: rgb(150,164,196);
								font-size: 0.9125rem;overflow: hidden;height: 1.4125rem;width: 100%;"
								v-html="unemoji(item.sendMessage)"
								>
								</div>
							</div>
						</div>
					</template>
					
					<template #right-icon>
						<van-icon :badge='item.COUNT' />
					</template>
				</van-cell>
				<template #right>
				  <van-button square text="删除" type="danger" class="delete-button" @click="deleteChat(item)" />
				</template>
			</van-swipe-cell>
		</div>
		
		<!-- <button @click="$router.push({path: '/test/test'})">aaaa</button> -->
	</div>
</template>

<script>
import axios from 'axios';
import { Toast, Dialog  } from 'vant';
import moment from 'moment'
import {photoUrl} from '@/type'
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';

export default{
	data(){
		return {
			chatList: [],
		}
	},
	methods: {
		emoji(word) {
		  // 生成html
		  const type = word.substring(1, word.length - 1);
		  return `<span class="emoji-item-common emoji-${type} emoji-size-small" ></span>`;
		},
		unemoji(word) {
			word = word.replace(/:.*?:/g, this.emoji);
			// console.log(word)
			return word;
		},
		//点击信息单元格
		clickInformationCell(id) {
			// Toast('点击id: ' + id)
			this.$router.push({name: 'message-chat', query:{userId: id}})
		},
		//清空聊天信息
		clearChatList() {
			Dialog.confirm({
			  message: '是否清除全部信息，清除信息丢失',
			})
			  .then(() => {
				//云端先清除
			    localStorage.removeItem('chat' + localStorage.getItem('id'))
			    this.searchHistoryList = []
				this.chatList = []
			    this.showFlag = false
			    Toast.success('清除浏览记录成功!')
			  })
			  .catch(() => {
			    // on cancel
			  });
		},
		//删除单个聊天记录
		deleteChat(id) {
			console.log(this.chatList[0])
			for(let i=0; i<this.chatList.length; i++) {
				if(id == this.chatList[i]) {
					//删除
					this.chatList.splice(i, 1);
					localStorage.setItem('chat' + localStorage.getItem('id'), JSON.stringify(this.chatList))
					//清除数据库信息
				}
			}
		},
		//添加聊天信息
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
					this.chatList = chatList
					return
				  }
			  }
			  
			  // 添加
			  if (appendFlag === true) {
			  	chatList.unshift(value)
			  	localStorage.setItem(chat, JSON.stringify(chatList))
			  } 
			  
			}
			this.chatList = chatList
		}
		
	},
	
	mounted() {
		//获取私信列表
		if(typeof localStorage!= 'undefined' && typeof localStorage.getItem('id') != 'undefined') {
			// localStorage.getItem('chat' + localStorage.getItem('id'))
			this.chatList = JSON.parse(localStorage.getItem('chat' + localStorage.getItem('id')))
		}
		//查看未读信息
		let req = {}
		this.$axios({
			url: '/customer/user/chatIndex.do',
			method: 'post',
			data: req
		}).then(res => {
			if(typeof res.data.data != 'undefined') {
				let unchatCount = 0
				for(let i=0; i<res.data.data.length; i++) {
					unchatCount = unchatCount + res.data.data[i].COUNT
					res.data.data[i].sendTime = moment(res.data.data[i].sendTime).format('YYYY-MM-DD HH:mm');
					res.data.data[i].thumb = photoUrl + res.data.data[i].thumb
					this.appendKeywords(res.data.data[i])
				}
				if(unchatCount == 0) {
					this.$store.commit('setunchatCount', '')
				} else {
					this.$store.commit('setunchatCount', unchatCount)
				}
				
				
			}
		}).catch(e => {
			// Toast.fail(e.data)
			console.log(e.data.error)
			// if(typeof e.data != 'undefined' && e.data.data.error === 401) {
			// 	this.$router.replace('/login')
			// }
		})
		
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,显示底部
		this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
}
</script>

<style  lang="scss" >
	@import "@/assets/css/analysis/showContent";
	@import "@/assets/css/emoji.css"; // 导入精灵图样式
	.message-container{
		background-color: #fff9f7;
		.row{
			padding-top: 5px;
			padding-bottom: 5px;
		}
	}
	
	 .delete-button {
	    height: 100%;
	 }
</style>
