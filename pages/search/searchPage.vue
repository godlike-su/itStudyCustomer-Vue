<template>
	<div>
		<!-- 头部返回+搜索栏 -->
		<van-sticky>
			<!-- 两端对齐 -->
			<van-row type="flex" justify="space-between">
				<p style="width: 5%;padding-left: 0.125rem;" @click="onClickLeft"><van-icon name="arrow-left" color="blue"/></p>
				<van-search style="width: 80%"
					v-model="searchValue"
					placeholder="请输入搜索关键词,最多输入20字"
					@search="onSearch"
					maxlength='20'
					ref="search"
					id="searchInput"
			    >
			    </van-search>
				<p style="width: 10%;color: #1DA1F2;" @click="onSearch">搜索</p>
			</van-row>
		</van-sticky>
		
		<!-- 两端对齐,历史搜索 -->
		<van-row type="flex" justify="space-between">
		  <h4>历史搜索</h4>
		  <p @click="clearSearchHistory">清空全部历史 <van-icon name="brush-o" /></p>
		</van-row>
		
		<!-- 历史搜索记录显示 -->
		<div v-for="(item, i) in searchHistoryList" style="display: inline-block;padding: 0rem 0.5rem;">
			<p style="background-color: #C8C9CC;padding: 0.5125rem;border-radius: 0.5125rem;" @click="onHistorySearch(item)">
				{{item}}
			</p>
		</div>
		
		
	</div>
</template>

<script>
import axios from 'axios'; 
import { Toast, Dialog } from 'vant';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION,indexName} from '@/type';
import articleUtil from '@/type/articleUtil'
export default{
	data() {
		return {
			searchValue: '',
			searchHistoryList: [],
		}
	},
	
	methods: {
		//搜索栏的确认
		onSearch() {
			this.searchValue = this.searchValue.trim()
			if(this.searchValue.length > 0) {
				this.appendKeywords(this.searchValue)  
				// this.searchValue = ''
				this.$router.push({name: 'search-mySearch-searchSort', query: {searchValue: this.searchValue}})
			}
		},
		//点击历史搜索的记录
		onHistorySearch(val) {
			val = val.trim()
			if(val.length > 0) {
				this.appendKeywords(val)  
				// this.searchValue = ''
				this.$router.push({name: 'search-mySearch-searchSort', query: {searchValue: val}})
			}
		},
		//搜索栏的取消
		onClickLeft() {
		  // this.$router.go(-1)
		  this.$router.push ({name: indexName, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
		},
		clearSearchHistory() {
			Dialog.confirm({
			  message: '是否清除所有历史搜索',
			}).then(() => {
				localStorage.removeItem("searchHistoryList")
				this.searchHistoryList = []
			}).catch(() => {});
		},
		
		// 过滤一个结果的空记录添加，过滤空搜索
		  appendKeywords(value) {
			/**
			 * 1.已经有的关键词不再添加
			 * 2.添加到数组的首位，若超出10个则删除最后一个
			 * 3.添加到缓存
			 */
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
		//获取焦点
		if (process.client) {
			document.getElementById("searchInput").focus()
		}
		
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
		
	},
	
	
}
</script>

<style>
</style>
