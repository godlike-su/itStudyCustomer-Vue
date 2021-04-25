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
		
		<!-- 下拉刷新，显示用户 -->
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh"  success-text="刷新成功" >
			<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  :error.sync="error"
			  error-text="请求失败，点击重新加载"
			  @load="onLoad"
			  :immediate-check="true"
			>
				<van-cell  size="large" v-for="(item,i) in fansList">
					<template #title>
						<van-image width="30" height="30" :src="item.thumb" round cover
						  @click="$router.push({name: 'otherHome-homeSort', query: {id: item.o_id}})"/>
						<span class="custom-title">{{item.name}}</span>
					</template>
					<template #right-icon>
						<van-button type="default" size="small" round @click="chat(item.o_id)">私信</van-button>
						<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="!item.eachOther">关注</van-button>
						<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="item.eachOther">互相关注</van-button>
					</template>
				</van-cell>
			</van-list>
		</van-pull-refresh>
		
		<!-- <div v-for="(item,i) in fansList">
			<van-cell  size="large" >
				<template #title>
					<van-image width="30" height="30" :src="item.thumb" round cover
					  @click="$router.push({name: 'otherHome-homeSort', query: {id: item.o_id}})"/>
					<span class="custom-title">{{item.name}}</span>
				</template>
				<template #right-icon>
					<van-button type="default" size="small" round @click="chat(item.o_id)">私信</van-button>
					<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="!item.eachOther">关注</van-button>
					<van-button plain  type="danger" size="small" round @click="follow(item.o_id, item.eachOther, i)" v-if="item.eachOther">互相关注</van-button>
				</template>
			</van-cell>
		</div> -->
		
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
			pageNumber: 1,
			pageCount: 1,
			loading: false,		//false表示加载完成
			finished: false,	//数据结束标志
			refreshing: false,  //下拉刷新,false表示加载完成
			error: false,
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
		
		//加载用户数据
		async onLoad() {
			//更新数据
			let req = {};
			req.pageNumber = this.pageNumber
			await this.$axios({
				url:'/customer/user/showFans.do',
				data: req,
				method: 'post'
			})
			.then(res => {
				// this.pageCount = res.data.data.pageCount;
				// this.pageNumber += 1;
				this.pageCount = res.data.data.pageCount;
				setTimeout(() => {
					if (this.refreshing) {
						this.fansList = [];
						//变回第一页
						// this.pageNumber = 1;
						this.refreshing = false;
					}
					this.pageNumber += 1
					console.log(res.data.data)
					for(let i=0; i<res.data.data.fansList.length; i++) {
						res.data.data.fansList[i].thumb = photoUrl + res.data.data.fansList[i].thumb
						res.data.data.fansList[i].eachOther = Number(res.data.data.fansList[i].eachOther)
						this.fansList.push(res.data.data.fansList[i])
					}
					this.loading = false;
					if (this.pageNumber > this.pageCount) {
						this.finished = true;
					}
				}, 300);
			})
			.catch((e) => {
				this.error = true;
				this.refreshing = false;
				console.log(e)
				Toast.fail(e.data.reason)
				this.loading = false;
			})
		},
		
		//上拉刷新页面
		onRefresh() {
			// 清空列表数据
			this.finished = false;
			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			this.loading = true;
			this.pageNumber = 1
			this.onLoad();
			// Toast('刷新成功');
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
		},
	},
	
	mounted() {
		// let req = {}
		// this.$axios({
		// 	url: '/customer/user/showFans.do',
		// 	method: 'post',
		// 	data: req
		// }).then(res => {
		// 	for(let i=0; i<res.data.data.length; i++) {
		// 		res.data.data[i].thumb = photoUrl + res.data.data[i].thumb
		// 		res.data.data[i].eachOther = Number(res.data.data[i].eachOther)
		// 	}
		// 	this.fansList = res.data.data
		// }).catch(e => {
			
		// })
	},
}
</script>

<style>
</style>
