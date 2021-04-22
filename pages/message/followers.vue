<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft"
			  title="我的关注"
			  >
			</van-nav-bar>
			<van-search
				v-model="topvalue"
				show-action
				placeholder="搜索用户"
				@search="onSearch"
				@cancel="onCancel"
			  />
		</van-sticky>
		<div v-for="(item,i) in followerList">
			<van-cell  size="large" >
				<template #title>
				    <van-image width="30" height="30" :src="item.thumb" round cover />
					<span class="custom-title">{{item.name}}</span>
				</template>
				<template #right-icon>
					<van-button type="default" size="small" round @click="chat(item.o_id)">私信</van-button>
					<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.name, i)" >取消</van-button>
				</template>
			</van-cell>
		</div>
		
	</div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import axios from 'axios'
import {photoUrl} from '@/type'
export default {
	data() {
		return {
			topvalue: '',
			followerList: [],
			
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
		
		follow(id, name, i) {
			Dialog.confirm({
			  message: '是否取消关注: ' + name,
			}).then(() => {
				let req = {};
				req.m_id = localStorage.getItem('id');
				req.o_id = id;
				req.follow = 1;
				  this.$axios({
					url: '/customer/user/setInterest.do',
					method: 'post',
					data: req
				  }).then(res => {
					Toast.success('操作成功')
					this.followerList.splice(i, 1)
				  }).catch(e => {
					console.log(e)
					Toast.fail('错误！')
				  })
			})
			.catch(() => {
			    // on cancel
			  });
			
		},
		
		//搜索栏的确认
		onSearch(val) {
		  console.log(val)
		},
		//搜索栏的取消
		onCancel() {
		  this.topvalue=''
		},
		
		onClickLeft() {
			this.$router.go(-1)
		}
	},
	
	mounted() {
		let req = {}
		this.$axios({
			url: '/customer/user/showFollower.do',
			method: 'post',
			data: req
		}).then(res => {
			for(let i=0; i<res.data.data.length; i++) {
				res.data.data[i].thumb = photoUrl + res.data.data[i].thumb
				res.data.data[i].eachOther = Number(res.data.data[i].eachOther)
			}
			this.followerList = res.data.data
		}).catch(e => {
			
		})
	},
}
</script>

<style>
</style>
