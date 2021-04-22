<template>
	<div >
		
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft"
			  >
			</van-nav-bar>
		</van-sticky>
		
		
		
		<div class="comment-wrap" style="margin-bottom: 0;">
		  <div class="comments-list">
		    <div class="comments-list-item" v-for="(item,index) in analysis" style="margin-bottom: 0;">
			<!-- 头像 昵称 -->
		      <div class="comments-list-item-heading">
				<van-image
				  round
				  :src="'/customer/photo' + item.thumb"
				  fit="cover"
				   @click="otherHome(item.createId)"
				/>
				
				<span class="comments-list-item-username">{{item.name}}</span>
				<van-button type="default" size="small" @click="chat(item.createId)">私信</van-button>
				<van-button plain  type="danger" size="small" @click="follow(item.createId)" v-if="!follower">关注</van-button>
				<van-button plain  type="danger" size="small" @click="follow(item.createId)" v-if="follower">已关注</van-button>
		      </div>
			  
			  <!-- 内容 -->
		      <div class="comments-list-item-content" v-html="item.content" ></div>
			  
			  <van-grid :border="false" :column-num="imgCount" >
					<van-grid-item v-if="imgCount>=1" @click="showPhoto(0)">
					  <van-image
						height="12rem"
						fit="scale-down"
					    :src="analysisPrefix + item.storePath + item.img1"
					  />
					</van-grid-item>
					<van-grid-item v-if="imgCount>=2" @click="showPhoto(1)">
					  <van-image
						height="12rem"
						fit="scale-down"
					    :src="analysisPrefix + item.storePath + item.img2"
					  />
					</van-grid-item>
					<van-grid-item v-if="imgCount==3" @click="showPhoto(2)">
					  <van-image
						height="12rem"
						fit="scale-down"
					    :src="analysisPrefix + item.storePath + item.img3"
					  />
					</van-grid-item>
			  </van-grid>
			  
			  <van-divider />
			  <van-row type="flex" justify="space-around">
				<div @click="isShowShare(item.id)"><van-icon name="share-o" />转发</div>
				<div v-if="item.numReply == 0" @click="clickNumReply(item.id)"><van-icon name="smile-comment-o" />评论</div>
				<div v-if="item.numReply != 0" @click="clickNumReply(item.id)" ><van-icon name="smile-comment" />{{item.numReply}}</div>
				<div v-if="item.numLike==0" @click="clickLike(item.id)"><van-icon name="good-job-o" />点赞</div>
				<div v-if="item.numLike>0" @click="clickLike(item.id)"><van-icon name="good-job" />{{item.numLike}}</div>
				<div @click="updateStart()" v-if="start==0 ? true : false"><van-icon name="star-o" />收藏</div>
				<div @click="updateStart()" v-if="start==1 ? true : false"><van-icon name="star" />已收藏</div>
			  </van-row>
			  <van-row type="flex" justify="space-around">
			    <van-button span="8" plain  type="danger" size="small" @click="deleteAnalysisId(item.id)" v-if="updateMark" >删除</van-button>
			  </van-row>
			  
			  <!-- 加个隔条 -->
			  <div style="height: 5px;background-color: #777777;"></div>
		    </div>
		  </div>
		</div>
		
		<!-- 评论 -->
		<nuxt />
		
		<div style="width:100%;border-radius: 2.125rem;
		border: 1px solid #008A00;position: fixed;bottom: 0rem;padding: 0;margin: 0;background-color: #ffffff;"
		@click="clickNumReply(analysis[0].id)">
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
		
		
		
		<!-- 分享面板 -->
		<van-share-sheet
		  v-model="showShare"
		  title="立即分享给好友"
		  :options="options"
		  @select="onSelect"
		/>
		
		<!-- 评论弹出层 -->
		<van-popup v-model="commondShow" position="bottom" :style="{ height: '10%' }" >	
			<Commond v-if="commondShow"></Commond>
		</van-popup>
			
	</div>
</template>

<script>
import axios from 'axios';
import { Toast,Dialog  } from 'vant';
import { ImagePreview } from 'vant';
import { itStudyAnalysisUrl } from '@/type';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
export default {
	inject: ['reload'],
	data() {
		return {
			analysis: [],
			imgCount: 0,
			analysisPrefix: '/customer/photo/analysis/',
			options: [
							// { name: '微信', icon: 'wechat' },
							// { name: '微博', icon: 'weibo' },
							{ name: '复制链接', icon: 'link' },
							{ name: '分享海报', icon: 'poster' },
							{ name: '二维码', icon: 'qrcode' },
			],
			showShare: false,
			isShowComment: false,
			cat1: this.$route.query.cat1,
			pageNumber: this.$route.query.pageNumber,
			//评论弹出层
			commondShow: false,
			follower: 0,
			userId: null,
			start: 0,
			//是否显示删除按键
			updateMark: false,
		}
	},
	
	methods: {
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
		showPhoto(id) {
			if(this.imgCount == 1) {
				ImagePreview({
					images: [
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img1,
					],
					closeable: true,
					startPosition: id
				});
			}else if(this.imgCount == 2) {
				ImagePreview({
					images: [
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img1,
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img2,
					],
					closeable: true,
					startPosition: id
				});
			}else {
				ImagePreview({
					images: [
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img1,
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img2,
						this.analysisPrefix + this.analysis[0].storePath + this.analysis[0].img3,
					],
					closeable: true,
					startPosition: id
				});
			}
			
		},
		onClickLeft() {
		  // this.$router.push ({name: 'analysis'})
		  this.$router.go(-1)
		},
		
		onSelect(option) {
			if('复制链接'==option.name) {
				let _input = document.createElement("input");   // 直接构建input
			　　_input.value = itStudyAnalysisUrl + '?analysisId=' + this.clickId + '&cat1=' + this.cat1 + '&pageNumber=' + this.pageNumber ;  // 设置内容
			　　document.body.appendChild(_input);    // 添加临时实例
			　　_input.select();   // 选择实例内容
			　　document.execCommand("Copy");   // 执行复制
			　　Toast('复制成功');
			　　document.body.removeChild(_input); // 删除临时实例
			}
		    this.showShare = false;
		},
		//显示分享面板
		isShowShare(id) {
			this.showShare = true
			this.clickId = id;
		},
		//显示评论面板
		showCommondPopup() {
			this.commondShow = true;
		},
		//关注
		follow(o_id) {
			//点击关注按钮
			if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
				
				Toast.fail('未登录，请登录再关注哦！')
				return
			}
			else if(localStorage.getItem('id') == o_id) {
				Toast.fail('不能关注自己！')
				return  
			}
			let req = {};
			req.m_id = localStorage.getItem('id');
			req.o_id = o_id;
			req.follow = this.follower;
			this.$axios({
				url: '/customer/user/setInterest.do',
				method: 'post',
				data: req
			}).then(res => {
				// console.log(res.data)
				if(res.data.error == -1) {
					Toast.fail(res.data.reason)
				}else if(res.data.error == 0) {
					this.follower = !this.follower
					Toast.success('操作成功')
				}else{
					Toast.fail(res.data.reason)
				}
				
			}).catch(e => {
				// console.log(e)
				Toast.fail(e)
			})
		},
		//私信
		chat(o_id) {
		  if( localStorage.getItem('id')==null  ||  typeof localStorage.getItem('id') == 'undefined'   ) {
			
			Toast.fail('未登录，请登录再私信哦！')
			return
		  }
		  else if(localStorage.getItem('id') == o_id) {
			Toast.fail('不能与自己私信！')
			return  
		  }
		  this.$router.push({name: 'message-chat', query:{'userId' : o_id}})
		},
		//点击评论
		clickNumReply(CommondContentId) {
			if(typeof localStorage.getItem('id') == 'undefined' || localStorage.getItem('id') == null) {
				Toast.fail('请您登录后再评论')
				// console.log(this.userId)
				return
			}
			this.commondShow=true;
			this.$store.commit("setCommondContentId", CommondContentId);
			this.$store.commit("setCommondReplyId", this.analysis[0].createId);
			
		},
		//点赞
		clickLike(analysisId) {
			let req = {}
			req.analysisId = analysisId
			this.$axios({
				url: '/customer/user/analysisLike.do',
				method: 'post',
				data: req
			}).then(res => {
				if(res.data.error == 0) {
					Toast('点赞成功')
					// this.reload.reload()
					this.analysis[0].numLike += 1
				}else{
					Toast.fail(res.data.reason)
				}
			}).catch(e => {
				Toast.fail(e.message)
			})
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
			req.aId = this.analysis[0].id
			req.startType = 1
			req.start = this.start
			console.log(req)
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
				Toast.fail(e.data.reason)
			})
		},
		
		//删除
		deleteAnalysisId(analysisId) {
			Dialog.confirm({
			  message: '是否删除问题',
			})
			  .then(() => {
			    // on confirm
				let req = {}
				req.analysisId = analysisId
				// req.userId = localStorage.getItem('id')
				req.creator = this.analysis[0].createId
				this.$axios({
					url: '/customer/user/analysisUpdateDelete.do',
					method: 'post',
					data: req
				}).then(res => {
					this.$router.go(-1)
				}).catch(e => {
					Toast.fail(e.data.reason)
				}) 
			  })
			  .catch(() => {
			    // on cancel
			  });  
		},
		
		//其他人主页
		otherHome(id) {
			this.$router.push({name: 'otherHome-homeSort', query: {id: id}})
		}
		
	},
	
	mounted() {
		let req = {};
		let analysis = {};
		analysis.id = this.$route.query.analysisId;
		req.analysis = analysis;
		req.startType = 1
		this.$axios({
			url: '/customer/analysisOne.do',
			method: 'post',
			data: req
		}).then(res => {
			// console.log(res.data.data)
			this.analysis = []
			// document.body.scrollTop = document.documentElement.scrollTop = 0
			if(typeof res.data.data.analysis!='undefined') {
				res.data.data.analysis.content = res.data.data.analysis.content.replace(/:.*?:/g, this.emoji);
				this.analysis.push(res.data.data.analysis)
				if(this.analysis.img1!="" && this.analysis[0].img1.length>0) {
					this.imgCount = 1;
					if(this.analysis.img2!="" && this.analysis[0].img2.length>0) {
						this.imgCount = 2;
						if(this.analysis.img3!="" && this.analysis[0].img3.length>0) {
							this.imgCount = 3;
						}
					}
				}
			}
			this.userId = localStorage.getItem('id')
			
			//是否收藏
			if(typeof res.data.data.start != 'undefined' && typeof res.data.data.start.createTime != 'undefined') {
			  this.start = 1;
			}else{
			  this.start = 0;
			}
			console.log(this.analysis[0].createId)
			if(typeof localStorage.getItem('id') != 'undefined' && localStorage.getItem('id') == this.analysis[0].createId) {
				this.updateMark = true
			}
			
			//关注显示
			if(typeof res.data.data.follower != 'undefined' && typeof res.data.data.follower.createTime != 'undefined') {
				this.follower = 1;
				
			}else{
				this.follower = 0;
			}
			
		})
	},
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
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

}
</script>

<style lang="scss">

@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css";  // 导入精灵图样式
</style>
