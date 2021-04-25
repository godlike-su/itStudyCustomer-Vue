<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft">
			  
			  <template #title v-if="navShow">
			  	<p>{{user.name}}</p>
			  </template>
				<!-- 导航栏右边显示 -->
				<template #right >
					<van-button plain  type="danger" size="small" v-if="navShow" style="margin-right: 1.625rem;" @click="follow">关注</van-button>
					<!-- <van-icon name="closed-eye" @click="showPopup"/> -->
					<van-image :src="require('@/static/icon/fontSize.png')" @click="showPopup"></van-image>
				 </template>
			</van-nav-bar>
		</van-sticky>
		
		<div>
				<!-- 标题和时间 -->
				<h2>{{article.title}}</h2>
				<span class="time">{{article.type}}</span><a class="time" :href="this.article.address">{{article.address}}</a>
				<p class="time">{{article.timeUpdate}}</p>
				
				<van-sticky @scroll="scroll" :offset-top="-10000">
				<!-- 第二栏 -->
				<ul class="nav">
					
					<!-- 头像 -->
					<li>
						<!-- <van-image round :src="(article.autosrc)" show-error show-loading width="3.625rem" height="3.625rem"> -->
						<van-image round :src="(authorUser.thumb)" show-error show-loading width="3.625rem" height="3.625rem"
						 @click="$router.push({name: 'otherHome-homeSort', query: {id: article.creator}})">
							<template v-slot:error>加载失败</template>
							<template v-slot:loading>图片加载中</template>
						</van-image>
					</li>
					
					
					<li>
						<p>{{user.name}}</p>
						<p>vip{{authorUser.vip}}</p>
					</li>
					
					<li >
						<van-button type="default" size="small" @click="chat">私信</van-button>
						<van-button plain  type="danger" size="small" @click="follow" v-if="!follower">关注</van-button>
						<van-button plain  type="danger" size="small" @click="follow" v-if="follower">已关注</van-button><br>
					</li>
				</ul>
			</van-sticky>	
			
			<!-- 隔条 -->
			<div class="space" style="height: 80px;">
			</div>
			
		</div>
		
		
		<!-- 文章主体 -->
		<section class="content" style="padding-bottom: 2.875rem;">
			<div class="quill-editor"
				:content=content
				:style="contentSize"
				@change="onEditorChange($event)"
				@blur="onEditorBlur($event)"
				@focus="onEditorFocus($event)"
				@ready="onEditorReady($event)"
				 v-quill:myQuillEditor="editorOption"
				 >
			</div>
		</section>
		
		<!-- 每个元素的两侧间隔相等 -->
		<van-row type="flex" justify="space-around">
		  <div v-if="article.numReply==0"><van-icon name="smile-comment-o" />评论</div>
		  <div v-if="article.numReply!=0"><van-icon name="smile-comment" />{{article.numReply}}</div>
		  <div @click="updateStart()" v-if="this.start==0 ? true : false"><van-icon name="star-o" />收藏</div>
		  <div @click="updateStart()" v-if="this.start==1 ? true : false"><van-icon name="star" />已收藏</div>
		</van-row>
		
		<van-row type="flex" justify="space-around">
		  <van-button span="8" plain  type="primary" size="small" @click="updateArticle(articleId)" v-if="updateMark" >修改</van-button>
		  <van-button span="8" plain  type="danger" size="small" @click="deleteArticle(articleId)" v-if="updateMark" >删除</van-button>
		</van-row>
	
		<div  style="height: 0.3125rem;background-color: #edeff0;margin-bottom: 2.875rem;">
			
		</div>
			
			
		<nuxt />
		<div style="padding-bottom: 10.25rem;"></div>
			
		<div style="width:100%;border-radius: 2.125rem;
		border: 1px solid #008A00;position: fixed;bottom: 0rem;padding: 0;margin: 0;background-color: #ffffff;"
		@click="clickNumReply(article.id, article.creator)">
			<div class="comment-wrap" style="padding: 0rem 0.5rem 0rem 0.5rem;margin: 0;">
			  <div class="comments-list" 
			  style="padding: 0.5975rem 0.3rem;word-break: break-all;margin: 0;width: 98%;text-align: left;">
					<div v-if="this.$store.state.CommondContent==''" style="color: #F56723;">
						<span v-if=" userId == null || userId == ''">/未登录</span>
						<span v-if=" userId != null && userId != ''">/写评论</span>
					</div>
					<div class="comments-list-item-content" 
					v-html="commondContent(this.$store.state.CommondContent)" 
					style="word-break: break-all;max-height: 3.9375rem;overflow-y: scroll;">
						
					</div>
			  </div>
			</div>
		</div>
		<!-- 评论弹出层 -->
		<van-popup v-model="commondShow" position="bottom" :style="{ height: '10%' }" >	
			<articleCommond v-if="commondShow"></articleCommond>
		</van-popup>
		
		<!-- 底部弹出 -->
		<van-popup
		  v-model="show"
		  closeable
		  position="bottom"
		  :style="{ height: '30%' }"
		>
			<br><br><br><br>
			<div class="tabbar_popup">
				<div class="tabbar_popup_elment">
					<i>
						<span style="font-size: 0.875rem;">小</span>
					</i>
					<i>
						<van-button type="primary" style="width: 0.875rem; height: 0.875rem;" @click="fontSetting(1)"/>
					</i>
					<i>
						<van-button type="primary" style="width: 1.125rem; height: 1.125rem;" @click="fontSetting(2)"/>
					</i>
					<i>
						<van-button type="primary" style="width: 1.4375rem; height: 1.4375rem;" @click="fontSetting(3)"/>
					</i>
					<i>
						<van-button type="primary" style="width: 2.1875rem; height: 2.1875rem;" @click="fontSetting(4)"/>
					</i>
					<i>
						<van-button type="primary" style="width: 2.5rem; height: 2.5rem;" @click="fontSetting(5)"/>
					</i>
					<i>
						<span style="font-size: 2.5rem;">大</span>
					</i>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import articleUtil from '@/type/articleUtil'
import axios from 'axios'
import { Toast,Dialog  } from 'vant';
import articleCommond from '@/components/articleCommond'
export default {
	inject: ['reload'],
	data() {
		return {
			show: false,
			articleId: this.$route.query.articleId,
			article: {},
			user: {},
			title: '',
			navShow: false,
			navTitle: '',
			contentSize: "",
			content: '',
			authorUser: '',
			editorOption: {
			  // some quill options
			  // theme: 'snow',
			  theme: 'bubble',    //显示用
			},
			follower: 0,  //是否关注
			// 搜索历史
			searchHistoryList: [],
			updateMark: false, //是否出现删除或者修改按钮
			contentSize : "font-size: 1.125rem",
			start : 0,  //是否收藏该文章
			commondShow: false,
			userId: null,
		}
	},
  methods: {
    onClickLeft() {
      // this.$router.push ({name: 'home', query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
	  if(this.$route.query.history == 1) {
		this.$router.push({path: '/user/history'})
	  }else{
		// this.$router.push({path: '/home', query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})  
		this.$router.go(-1)
	  }
	  
    },
	scroll(values) {
		if(values.scrollTop > 153) {
			this.navShow = true
		}else{
			this.navShow = false
		}
	},
	fontSetting(value) {
		//字体大小设置
		if(value==1){
			this.contentSize = "font-size: 0.875rem"
			localStorage.setItem("contentSize", "font-size: 0.875rem")
		}
		else if(value==2){
			this.contentSize = "font-size: 1.125rem"
			localStorage.setItem("contentSize", "font-size: 1.125rem")
		}
		else if(value==3){
			this.contentSize = "font-size: 1.4375rem"
			localStorage.setItem("contentSize", "font-size: 1.4375rem")
		}
		else if(value==4){
			this.contentSize = "font-size: 2.1875rem"
			localStorage.setItem("contentSize", "font-size: 2.1875rem")
		}
		else if(value==5){
			this.contentSize = "font-size: 40px"
			localStorage.setItem("contentSize", "font-size: 40px")
		}
	},
	//点击评论
	clickNumReply(CommondContentId, creator) {
		if(typeof localStorage.getItem('id') == 'undefined' || localStorage.getItem('id') == null) {
			Toast.fail('请您登录后再评论')
			// console.log(this.userId)
			return
		}
		this.commondShow=true;
		this.$store.commit("setCommondContentId", CommondContentId);
		this.$store.commit("setCommondReplyId", creator);
		
	},
	emoji(word) {
	  // 生成html
	  const type = word.substring(1, word.length - 1);
	  return `<span class="emoji-item-common emoji-${type} emoji-size-small" ></span>`;
	},
	commondContent(word) {
		word = word.replace(/:.*?:/g, this.emoji);
		// console.log(word)
		//空格 回车替换成前端显示的样式
		word = word.replace(/\r\n/g,'<br/>').replace(/\n/g,'<br/>').replace(/\s/g,' ');
		return word;
	},
	follow() {
		//点击关注按钮
		if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
			Toast.fail('未登录，请登录再关注哦！')
			return
		}
		else if(localStorage.getItem('id') == this.article.ref1) {
			Toast.fail('不能关注自己！')
			return  
		}
		let req = {};
		req.m_id = localStorage.getItem('id');
		req.o_id = this.article.ref1;
		req.follow = this.follower;
		this.$axios({
			url: '/customer/user/setInterest.do',
			method: 'post',
			data: req
		}).then(res => {
			if(res.data.error == -1) {
				Toast.fail(res.data.reason)
			}else if(res.data.error == 0) {
				this.follower = !this.follower
				Toast.success('操作成功')
			}else{
				Toast.fail(res.data.reason)
			}
			
		}).catch(e => {
			Toast.fail('错误！')
		})
	},
	 showPopup() {
	      this.show = true;
	},
	
	onEditorBlur(editor) { // 富文本失去焦点时的事件
	},
	onEditorFocus(editor) { // 富文本获得焦点时的事件
		 editor.enable(false);
	},
	onEditorReady(editor) { // 富文本准备时的事件
	},
	onEditorChange({ editor, html, text }) { // 富文本内容改变时的事件
	},
	
	// 过滤一个结果的空记录添加，过滤空搜索
	  appendKeywords(value) {
		/**
		 * 1.已经有的关键词不再添加
		 * 2.添加到数组的首位，若超出10个则删除最后一个
		 * 3.添加到缓存
		 */
		articleUtil.articleAppendKeywords('articleHistoryList', value, 10)
	  },
	  //私信
	  chat() {
		  if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
		  	
		  	Toast.fail('未登录，请登录再私信哦！')
		  	return
		  }
		  else if(localStorage.getItem('id') == this.article.ref1) {
		  	Toast.fail('不能与自己私信！')
		  	return  
		  }
		  this.$router.push({name: 'message-chat', query:{'userId' : this.article.ref1}})
	  },
	  
	  //修改
	  updateArticle(articleId) {
		let req = {}
		req.articleId = articleId
		// req.userId = localStorage.getItem('id')
		req.ref1 = this.article.ref1
		this.$axios({
			url: '/customer/user/articleUpdateAuthority.do',
			method: 'post',
			data: req
		}).then(res => {
			this.$router.push({path: '/user/myArticleUpdate', query:{articleId:articleId, typeId: this.$route.query.typeId, type: this.type}})
		}).catch(e => {
			console.log(e)
			Toast.fail('错误！')
		})
	  },
	  
	  //删除
	  deleteArticle(articleId) {
		Dialog.confirm({
		  title: '删除',
		  message: '是否删除该帖',
		})
		  .then(() => {
		    // on confirm
			let req = {}
			req.articleId = articleId
			// req.userId = localStorage.getItem('id')
			req.ref1 = this.article.ref1
			this.$axios({
				url: '/customer/user/articleUpdateDelete.do',
				method: 'post',
				data: req
			}).then(res => {
				this.$router.go(-1)
			}).catch(e => {
				Toast.fail('错误！')
			}) 
		  })
		  .catch(() => {
		    // on cancel
		  });  
		 
	  },
	  

	//收藏
	updateStart() {
		//点击收藏按钮
		if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
			Toast.fail('未登录，请登录再关注哦！')
			return
		}
		let req = {}
		req.userId = localStorage.getItem('id')
		req.aId = this.articleId
		req.startType = 0
		req.start = this.start
		this.$axios({
			url: '/customer/user/updateStart.do',
			method: 'post',
			data: req
		}).then(res => {
			if(res.data.data == 1) {
				this.start = !this.start
				if(this.start == 1) {
					Toast("收藏成功")
				} else {
					Toast("取消收藏成功")
				}
			}
			
		}).catch(e => {
			console.log(e)
		})
	},
	
  },
  
  mounted() {
	this.$store.commit(HIDE_TABBAR_MUTATION, false);
	if(typeof localStorage=="undefined" || localStorage.getItem("contentSize")==null)
	{
		this.contentSize = "font-size: 1.125rem"
	}else{
		this.contentSize = localStorage.getItem("contentSize")
	}
		
	let req = {}
	req.typeId = this.$route.query.typeId
	req.articleId = this.$route.query.articleId
	//0代表是文章
	req.startType = 0
	this.$axios({
	  url: '/customer/showOneArticle.do',
	  method: 'post',
	  data: req
	}).then(res => {
		  if(typeof res.data.data.article == "undefined") {
			  this.article = []
			  this.user = []
			  return
		  }
		  this.user = res.data.data.user
		  this.article = res.data.data.article
		  this.content = this.article.content
		  //时间转换
		  this.article.timeUpdate = new Date( this.article.timeUpdate ).toLocaleString();
		  
		  //作者信息
		  this.authorUser = res.data.data.user;
		  this.authorUser.thumb = "/customer/photo" + res.data.data.user.thumb;
		  this.userId = localStorage.getItem('id')
		  //是否关注
		  if(typeof res.data.data.follower != 'undefined' && typeof res.data.data.follower.createTime != 'undefined') {
			  this.follower = 1;
		  }else{
			  this.follower = 0;
		  }
		  // console.log(res.data.data.start)
		  
		  //是否收藏
		  if(typeof res.data.data.start != 'undefined' && typeof res.data.data.start.createTime != 'undefined') {
			  this.start = 1;
		  }else{
			  this.start = 0;
		  }
		  
		  if(typeof localStorage.getItem('id') != 'undefined' && localStorage.getItem('id') == this.article.ref1) {
			  this.updateMark = true
		  }
		  //添加历史查看记录
		  let list = JSON.parse(localStorage.getItem('articleHistoryList')) || []
		  this.searchHistoryList = list
		  this.appendKeywords(res.data.data.article.id)
		  
	})
	// this.container = this.$refs.container;
  },
  components: {
	articleCommond  
  },
  
  beforeMount() {
  	//第一个参数就是mutations名字,隐藏底部
  },
  beforeDestroy() {
  	// bus.$emit("maizuo", true)
  	// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	this.$store.commit('setCommondContent', '');
  },
  watch: {
  	commondContent(newName, oldName) {
  		// console.log(newName)
  		this.commondemoji = ewName.replace(/:.*?:/g, this.emoji);
  		newName = newName.replace(/:.*?:/g, this.emoji);
  	},
  	
  },
  
  async asyncData({ $axios,route }){
	  
  }
  
};	
</script>

<style lang="scss">
	
.tabbar_popup{
	display: flex;
	justify-content: center;
	align-items: center;
}
.tabbar_popup .tabbar_popup_elment{
	width: 31.25rem;
	display: flex;
	justify-content: center;
	align-items: center;
}
.tabbar_popup .tabbar_popup_elment i {
	margin-left: 0.625rem;
}

.time{
	color: #7F828B;
	font-size: 0.625rem;
}
.space{
	border-bottom: 1px solid #ecece5;
	margin-bottom: 1.25rem;
}
.nav ul{
	position: relative;
	// border-bottom: 1px solid #008A00;
}
.nav li:nth-child(1){
	// width: 6.25rem;
	position: absolute;
	left: 0.625rem;
	// float: left;
	padding: 0.625rem;
}
.nav li:nth-child(2){
	// width: 6.25rem;
	position: absolute;
	left: 8.625rem;
	// float: left;
}
.nav li:nth-child(3){
	position: absolute;
	// top: 1.875rem;
	right: 0.625rem;
	
	// float: left;
	// padding: 0.625rem;
	padding-top: 1.825rem;
}
.t1{
	display: flex;
}
@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css";  // 导入精灵图样式
</style>
