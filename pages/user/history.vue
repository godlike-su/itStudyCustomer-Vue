<template>
	<div >
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  title="历史踪迹"
			  @click-left="onClickLeft">
			  
				<!-- 导航栏右边显示 -->
				<template #right>
					<van-icon name="brush-o" title="清除踪迹" @click="clearhistoryList()"/>
				 </template>
			</van-nav-bar>
		</van-sticky>
		
		<div v-if="!showFlag">
			<h2>
				未查到浏览记录
			</h2>
		</div>
		
		<div v-if="showFlag">
			<div class="homeContent">
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
						<span>{{item.name}}</span> &nbsp;&nbsp; <span>{{item.numLike}}点赞量</span>&nbsp;&nbsp;<span>{{item.numReply}}评论</span> <br>
						<span>{{item.createTime}}</span>
					</div>
					<!-- </router-link> -->
				</van-cell>
			</div>
		</div>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import {Toast, Dialog} from 'vant'
import axios from 'axios'
export default{
	data() {
	      return {
	        // 搜索历史
	        searchHistoryList: [],
	        // 标记显示搜索历史
	        showFlag: false,
	        // loadShow: false,
			list: [],		//文章数据
	      }
	},
	methods: {
		showHistory() {
			if (this.searchHistoryList.length > 0) {
			  
			  let req = {}
			  req.articleIdList = this.searchHistoryList
			  this.$axios({
			  	url:'/customer/historyArticle.do',
			  	data: req,
			  	method: 'post'
			  }).then(res => {
				  if(res.data.error == 0) {
					if(res.data.data.length > 0) {
						this.showFlag = true
						this.list = res.data.data
					}
					
				  }
			  }).catch(e => {
				  Toast.fail(e.data.reason)
			  })
			}
		},
		// 清空历史记录
		clearhistoryList() {
			Dialog.confirm({
			  message: '是否全部清除浏览足迹',
			})
			  .then(() => {
			    localStorage.removeItem('historyList')
			    this.searchHistoryList = []
			    this.showFlag = false
			    Toast.success('清除浏览记录成功!')
			  })
			  .catch(() => {
			    // on cancel
			  });
		},
		//文章跳转的页面
		article(id) {
			// console.log(id)
			this.$router.push({path: '/article/articleId', query:{articleId:id, typeId: this.typeId, type: this.type, history: 1}})
		},
		onClickLeft() {
		  this.$router.push({path: '/user'})
		},
	},
	
	
	mounted() {
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
		if(typeof localStorage.getItem('historyList') != 'undefined')
		{
			let list = JSON.parse(localStorage.getItem('historyList')) || []
			this.searchHistoryList = list
			this.showHistory()
			//加载文章数据
			// console.log(this.searchHistoryList.length)
		}
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
}
</script>

<style>
</style>
