<template>
	<div>
		<!-- 头部标签栏+搜索栏 -->
		<van-sticky>
			<van-search
				
				placeholder="请输入搜索关键词"
				@click="$router.push({name: 'search-searchPage'})"
			  />
			  
			  <van-tabs  @change="onClick" v-model="active" >
			    <van-tab v-for="index in this.navTabList" :title="index.name"  :name="index.id" >
				
				</van-tab>
			  </van-tabs>
		</van-sticky>
		
		<!-- 文章内容 -->
		<!-- <Nuxt /> -->
		<div class="homeContent">
			<!-- 下拉刷新，显示内容主题 -->
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
					
					<van-cell v-for="item in list" :key="item.id"  class="content">
						<!-- <router-link to="/article"> -->
						<div class="row" v-on:click="article(item.id)">
							<!-- 最多显示三行 -->
							<label style="font-weight: bold;">
								<span style="color: green;" v-if="item.type=='原创' ? true : false">[{{item.type}}]</span>
								<span style="color: red;" v-if="item.type=='转载' ? true : false">[{{item.type}}]</span>
								{{item.title}}
							</label>
							
							<div class="van-multi-ellipsis--l2">
							  {{item.text}}
							</div>
							<span>{{item.name}}</span> &nbsp;&nbsp; 
							<span>{{item.numLike}}点赞量</span>&nbsp;&nbsp;
							<span>{{item.numReply}}评论</span>&nbsp;&nbsp;
							<span>{{item.numStart}}收藏</span> <br>
							<span>{{item.createTime}}</span>
						</div>
						<!-- </router-link> -->
					</van-cell>
					
				</van-list>
				
			</van-pull-refresh>			
		</div>
		
		<van-icon name="add" color="red" size="40px" class="add" @click="show = !show"  />
		
		<div class="overlay" v-if="show" @click="show = false" >
			<div class="block">
				<router-link class="row" :to="{name: 'analysis-writeAnalysis'}">
					<van-image :src="require('@/static/icon/ques-r.png')" />
					<label>问题求解</label>
				</router-link>
				<router-link class="row" :to="{name: 'article-writeArt'}">
					<van-image :src="require('@/static/icon/know-b.png')" color="red" />
					<label>知识分享</label>
				</router-link>
				<router-link class="row"  :to="{name: 'user-signIn'}">
					<van-image :src="require('@/static/icon/signin-g.png')" color="red" />
					<label>签到</label>
				</router-link>
			</div>
		</div>
		<Nuxt></Nuxt>
	</div>
</template>

<script>
import axios from 'axios'; 
import { Toast } from 'vant';
import { Dialog } from 'vant';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION, articleName} from '@/type';

export default{
	data() {
	    return {
		  count: 0,
		  navTabList: [],
		  isShow: true,
		  active: 0,
		  show: false,
		  value: '',
		  typeId: this.$route.query.typeId,
		  type: this.$route.query.type,
		  list: [],		//文章数据
		  loading: false,		//false表示加载完成
			finished: false,	//数据结束标志
			refreshing: false,  //下拉刷新,false表示加载完成
			error: false,
		 allList: [],
		 pageNumberList: [],
		 pageCountList: [],
	    };
	  },
	  methods: {
		//搜索栏下方的文章分类
		onClick(name, title) {
			//更新首页动态链接
			let data = [];
			data.homeLink = name;
			data.typeId = name;
			data.type = title;
			this.$store.commit('setHomeLink', data);
			this.$router.push({path: '/home', query:{typeId: name, type: title}})
			this.typeId = name;
			this.type = title
			this.list = [];
			// this.pageNumber = 1;
		
			if(this.pageNumberList[this.active] === 0) {
				this.pageNumberList[this.active] = 1
				this.onRefresh()
			}
			else {
				this.list = this.allList[this.active]
				if (this.pageNumberList[this.active] >this.pageCountList[this.active]) {
					this.finished = true;
				} else {
					this.finished = false
				}
			}
			
			
			// 清空列表数据
			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			// this.onRefresh()
		},
		
		//加载文章数据
		async onLoad() {
			//异步更新数据
			let req = {};
			req.typeId = this.typeId
			if(typeof req.typeId=='undefined' ) {
				req.typeId = 5
			}
			if(this.pageNumberList[this.active] === 0) {
				this.pageNumberList[this.active] = 1
			}
			req.pageNumber = this.pageNumberList[this.active]
			//热榜加载
			if(this.typeId == 5) {
				//加载数据，按照分页加载
				await this.$axios({
					url:'/customer/homeArticleHold.do',
					data: req,
					method: 'post'
				})
				.then(res => {
					// this.pageCount = res.data.data.pageCount;
					// this.pageNumber += 1;
					this.pageCountList[this.active] = res.data.data.pageCount;
					setTimeout(() => {
						if (this.refreshing) {
							this.list = [];
							//变回第一页
							// this.pageNumber = 1;
							// this.pageNumberList[this.active] = 1
							this.refreshing = false;
						}
						this.pageNumberList[this.active] += 1
						for (let i = 0; i < res.data.data.article.length; i++) {
							this.list.push(res.data.data.article[i]);
						}
						this.allList[this.active] = this.list
						this.loading = false;
						if (this.pageNumberList[this.active] > this.pageCountList[this.active]) {
							this.finished = true;
						}
					}, 300);
				})
				.catch((e) => {
					this.error = true;
					Toast.fail(e.data.reason)
					// console.log("首页文章加载错误" + e.data.reason);
					this.loading = false;
					this.refreshing = false;
				})
			}
			else {
				//加载数据，按照分页加载
				await this.$axios({
					url:'/customer/homeArticle.do',
					data: req,
					method: 'post'
				})
				.then(res => {
					// this.pageCount = res.data.data.pageCount;
					// this.pageNumber += 1;
					this.pageCountList[this.active] = res.data.data.pageCount;
					setTimeout(() => {
						if (this.refreshing) {
							this.list = [];
							//变回第一页
							// this.pageNumber = 1;
							
							this.refreshing = false;
						}
						this.pageNumberList[this.active] += 1
						for (let i = 0; i < res.data.data.article.length; i++) {
							this.list.push(res.data.data.article[i]);
						}
						this.allList[this.active] = this.list
						this.loading = false;
						if (this.pageNumberList[this.active] > this.pageCountList[this.active]) {
							this.finished = true;
						}
					}, 300);
				})
				.catch((e) => {
					this.error = true;
					this.refreshing = false;
					Toast.fail(e.data.reason)
					// console.log("首页文章加载错误" + e.data.reason);
					this.loading = false;
				})
			}
		},
		//上拉刷新页面
		onRefresh() {
			// 清空列表数据
			this.finished = false;
			// 重新加载数据
			// 将 loading 设置为 true，表示处于加载状态
			this.loading = true;
			this.pageNumberList[this.active] = 1
			this.onLoad();
			// Toast('刷新成功');
		},
		//文章跳转的页面
		article(id) {
			// console.log(id)
			this.$router.push({name: articleName, query:{articleId:id, typeId: this.typeId, type: this.type}})
		},
		
	
	  },
	  $route:{
		  handler(newRouter){
			this.loading = true;
		  },
	  },
	
	mounted() {
		this.$axios({
			url:"/customer/navTab.do",
			method: 'post',
		}).then(res => {
			this.navTabList = res.data.data
		}).catch(e => {
			Toast.fail(e.data.reason)
		})
		
		for(let i=0; i<30; i++) {
			this.pageNumberList[i] = 0
		}
		
	},
	watch: {
		$route:{
		  handler(newRouter){
			  
		  }
		},
		// active(newValue, old) {
		// 	this.loading = true;
		// },
		
	},
	created() {
		this.active = Number(this.$route.query.typeId)
		if (process.client) {
			
		 }
	},
	beforeUpdate() {
	},
	beforeMount() {
		//第一个参数就是mutations名字,显示底部
		this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
}
</script>

<style lang="scss" scoped>
	.van-tabs__nav  {
		border-bottom: 1px solid #000000;
	}
	.add{
		// position: fixed;
		// right: 1.85rem;
		// bottom: 4.875rem;
		// z-index: 9999;
		
		position: fixed;
		right: 0.4rem;
		top: 0.58rem;
		z-index: 9999;
	}

  .block {
	position: fixed;
	// right: 1.85rem;
	// bottom: 7.70rem;
	right: 0.4rem;
	top: 3.43rem;
	width: 7.5rem;
	height: 8.5rem;
	background-color: #000000;
	display: flex;
	justify-content: center;
	// align-items: center;
	flex-direction: column;
	
	border-radius: 0.625rem;
	
  }
  .row{
	  padding: 0.625rem;
  }
  .row:checked{
	  background-color: #FF9900;
  }
  .row label{
	  width: 200px;
	  // float: left;
	  color: #f5f5f5;
	  padding-left: 0.625rem;
  }
  .overlay{
	  width: 100%;
	  height: 100%;
	  // background-color: #0066CC;
	  z-index: 9998;
	  position: fixed;
	  top: 0;
  }
	
// 内容区域
.homeContent{
}
.homeContent .row label{
	color: black;
}
</style>
