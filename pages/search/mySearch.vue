<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<!-- 头部返回+搜索栏 -->
			<van-sticky>
				<!-- 两端对齐 -->
				<van-row type="flex" justify="space-between"  style="background-color: white;">
					<p style="width: 5%;padding-left: 0.125rem;" @click="onClickLeft"><van-icon name="arrow-left" color="blue"/></p>
					<van-search style="width: 80%"
						v-model="searchValue"
						placeholder="请输入搜索关键词,最多输入20字"
						@search="onSearch"
						maxlength='20'
				    >
				    </van-search>
					<p style="width: 10%;color: #1DA1F2;" @click="onSearch">搜索</p>
				</van-row>
			</van-sticky>
		</van-sticky>
		
		<van-sticky offset-top='40px'>
			<van-tabs v-model="active" @change="onClick">
				<van-tab title="文章" ></van-tab>
				<van-tab title="问答"></van-tab>
				<van-tab title="用户"></van-tab>
				<van-tab title="更多"></van-tab>
			</van-tabs>
		</van-sticky>
		
		<Nuxt v-if="searchSortShow" />
	</div>
</template>

<script>
import axios from 'axios'; 
import { Toast, Dialog } from 'vant';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION,indexName} from '@/type';
import articleUtil from '@/type/articleUtil';
export default{
	data() {
		return {
			searchValue: this.$route.query.searchValue,
			searchHistoryList: [],
			active: 0,
			nowActive: 0,
			searchSortShow: true,
		}
	},
	
	provide() {
		return {
			mySearch: this
		}
	},
	
	methods: {
		onClickLeft() {
			this.$router.push ({name: indexName, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
		},
		//搜索栏的确认
		onSearch() {
			this.searchValue = this.searchValue.trim()
			if(this.searchValue.length > 0) {
				this.appendKeywords(this.searchValue)  
				this.$route.query.searchValue = this.searchValue
				this.searchSortShow = false
				this.$nextTick(function(){
					this.searchSortShow = true;
				})
			}
		},
		onClick(name) {
			//更新首页动态链接
			this.nowActive = name
			this.active = name
		},
		
		// 过滤一个结果的空记录添加，过滤空搜索
		  appendKeywords(value) {
			articleUtil.articleAppendKeywords('searchHistoryList', value, 10)
		  },
	},
	
	mounted() {
		if(typeof localStorage.getItem('searchHistoryList') != 'undefined')
		{
			let list = JSON.parse(localStorage.getItem('searchHistoryList')) || []
			this.searchHistoryList = list
			// this.showHistory()
		}
	},
	
	watch: {
		searchValue(newValue, oldValue) {
			if(newValue.length==0) {
				this.$router.push({name: 'search-searchPage'})
			}
		},
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
	},
}
</script>

<style>
</style>
