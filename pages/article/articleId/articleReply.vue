<template>
	<div>
		<div class="comment-wrap" style="padding-top: 0;">
		  <div class="comments-list" style="padding-top: 0.3125rem;margin-top: 0;">
			<div class="comments-list-item" v-for="(item,index) in replyList" >
			<!-- 头像 昵称 -->
			  <div class="comments-list-item-heading">
				<van-image
				  round
				  :src="'/customer/photo' + item.thumb"
				  fit="cover"
				  @click="$router.push({name: 'otherHome-homeSort', query: {id: item.creator}})"
				/>
				<span class="comments-list-item-username">{{item.name}}</span>
				<!-- 内容 -->
				<div class="comments-list-item-content" v-html="item.content" 
				style="background-color: #FFFFFF;border: 0.0625rem solid #1DA1F2;border-radius: 0.625rem; padding: 0.0625rem 0.3125rem;"></div>
			  </div>
			</div>
		  </div>
		</div>
		
		<!-- 页码 -->
		<van-pagination
		  v-model="pageNumber"
		  :total-items=pageCount
		  :show-page-size="3"
		  force-ellipses
		/>
	</div>
</template>

<script>
import axios from 'axios';
import { Toast,Dialog,Pagination } from 'vant';
export default {
	data() {
		return {
			replyList: [],
			pageNumber: 1,
			pageCount: 1,
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
			//空格 回车替换成前端显示的样式
			word = word.replace(/\r\n/g,'<br/>').replace(/\n/g,'<br/>').replace(/\s/g,' ');
			return word;
		},
	},
	mounted() {
		let req = {};
		req.articleId = this.$route.query.articleId;
		req.pageNumber = this.pageNumber;
		this.$axios({
			url: '/customer/articleShowReply.do',
			method: 'post',
			data: req
		}).then(res => {
			if(res.data.error==0) {
				for(let i=0; i<res.data.data.article.length; i++){
					res.data.data.article[i].content = this.unemoji(res.data.data.article[i].content)
				}
				this.replyList = res.data.data.article
				this.pageCount = res.data.data.pageCount
			}else {
				Toast.fail(res.data.reason)
			}
		})
	}
}
</script>

<style lang="scss">
@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css";  // 导入精灵图样式
</style>
