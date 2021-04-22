<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft"
			  title="我的粉丝"
			  >
			</van-nav-bar>
		</van-sticky>
		<div v-for="(item,i) in fansList">
			<van-cell  size="large" >
				<template #title>
					<van-image width="30" height="30" :src="item.thumb" round cover />
					<span class="custom-title">{{item.name}}</span>
				</template>
				<template #right-icon>
					<van-button type="default" size="small" round @click="chat(item.o_id)">私信</van-button>
					<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="!item.eachOther">关注</van-button>
					<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="item.eachOther">互相关注</van-button>
				</template>
			</van-cell>
		</div>
		
	</div>
</template>

<script>
import { Toast } from 'vant'
import axios from 'axios'
import {photoUrl} from '@/type'
export default {
	data() {
		return {
			follower: false,
			fansList: [],
		}
	},
	methods: {
		//私信
		chat(o_id) {
		  if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
			
			Toast.fail('未登录，请登录再私信哦！')
			return
		  }
		  this.$router.push({name: 'message-chat', query:{'userId' : o_id}})
		},
		
		follow(o_id, eachOther, i) {
			//点击关注按钮
			if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
				
				Toast.fail('未登录，请登录再关注哦！')
				return
			}
			let req = {};
			req.m_id = localStorage.getItem('id');
			req.o_id = o_id;
			req.follow = eachOther;
			this.$axios({
				url: '/customer/user/setInterest.do',
				method: 'post',
				data: req
			}).then(res => {
				Toast.success('操作成功')
				this.fansList[i].eachOther = !this.fansList[i].eachOther
			}).catch(e => {
				console.log(e)
				Toast.fail('错误！')
			})
		},
		
		onClickLeft() {
			this.$router.go(-1)
		}
	},
	
	mounted() {
		let req = {}
		this.$axios({
			url: '/customer/user/showFans.do',
			method: 'post',
			data: req
		}).then(res => {
			for(let i=0; i<res.data.data.length; i++) {
				res.data.data[i].thumb = photoUrl + res.data.data[i].thumb
				res.data.data[i].eachOther = Number(res.data.data[i].eachOther)
			}
			this.fansList = res.data.data
		}).catch(e => {
			
		})
	},
}
</script>

<style>
</style>
