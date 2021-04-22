<template>
	<div class="analysisContainer">
		
		<div class="analysisTop">
			<label>最新</label>
			<label>推荐</label>
			<label>板块</label>
		</div>
		
		<div class="comment-wrap">
		  <div class="comments-list">
		    <div class="comments-list-item" v-for="(item,index) in analysisList" v-bind:key="index" >
			<!-- 头像 昵称 -->
			  <div style="padding-top: 5px;"></div>
		      <div class="comments-list-item-heading">
				<van-image
				  round
				  :src="'/customer/photo' + item.thumb"
				  fit="cover"
				/>
				
				<span class="comments-list-item-username">{{item.name}}</span>
				
		      </div>
			  
			  <!-- 内容 -->
		      <div class="comments-list-item-content" v-html="item.content" @click="clickAnalysis(item)" 
			  ></div>
			  
			  <!-- 图片 -->
			  <van-grid :border="false" :column-num="item.photoShow" >
			    <van-grid-item v-if="item.photoShow>=1" @click="showPhoto(item, 0)">
			      <van-image
					height="12rem"
					fit="scale-down"
			        :src="analysisPrefix + item.storePath + item.img1"
			      />
			    </van-grid-item>
				<van-grid-item v-if="item.photoShow>=2" @click="showPhoto(item, 1)">
				  <van-image
					height="12rem"
					fit="scale-down"
				    :src="analysisPrefix + item.storePath + item.img2"
				  />
				</van-grid-item>
				<van-grid-item v-if="item.photoShow==3" @click="showPhoto(item, 2)">
				  <van-image
					height="12rem"
					fit="scale-down"
				    :src="analysisPrefix + item.storePath + item.img3"
				  />
				</van-grid-item>
			  </van-grid>
			  
			  <van-divider />
			  <van-row type="flex" justify="space-around">
				<div  @click="isShowShare(item.id)"><van-icon name="share-o" />转发</div>
				<div v-if="item.numReply==0" @click="clickAnalysis(item)" ><van-icon name="smile-comment-o" />评论</div>
				<div v-if="item.numReply!=0" @click="clickAnalysis(item)" ><van-icon name="smile-comment" />{{item.numReply}}</div>
				<div v-if="item.numLike==0" @click="clickAnalysis(item)"><van-icon name="good-job-o" />点赞</div>
				<div v-if="item.numLike!=0" @click="clickAnalysis(item)"><van-icon name="good-job" />{{item.numLike}}</div>
				<div v-if="item.numStart==0" @click="clickAnalysis(item)"><van-icon name="star-o" />收藏</div>
				<div v-if="item.numStart!=0" @click="clickAnalysis(item)"><van-icon name="star" />{{item.numStart}}</div>
     		  </van-row>
			 
			  <!-- 加个隔条 -->
			  <div style="height: 1px;background-color: #8cffe3;"></div>
		    </div>
		  </div>
		</div>
		
		<!-- 页码 -->
		<van-pagination
		  v-model="pageNumber"
		  :total-items="totalitems"
		  :show-page-size="3"
		  force-ellipses
		  @change="showAnalysisList"
		/>
		
		
		<!-- 分享面板 -->
		<van-share-sheet
		  v-model="showShare"
		  title="立即分享给好友"
		  :options="options"
		  @select="onSelect"
		/>
	
	</div>
</template>

<script>
import axios from 'axios';
import { Toast,Dialog,ImagePreview   } from 'vant';
import { itStudyAnalysisUrl } from '@/type';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
export default {
	data() {
		return {
			pageNumber: 2,
			pageCount: 0,
			totalitems: 0,
			analysisList: [],
			cat1: 0,
			showShare: false,
			  options: [
				// { name: '微信', icon: 'wechat' },
				// { name: '微博', icon: 'weibo' },
				{ name: '复制链接', icon: 'link' },
				{ name: '分享海报', icon: 'poster' },
				{ name: '二维码', icon: 'qrcode' },
			  ],
			  //选择分享面板时点击的 id
			  clickId: 0,
			  analysisPrefix: '/customer/photo/analysis/',
			  imgCount: 0,
			  showWriteAnalysis: true,
		
		}
	},
	
	methods: {
		//点击某个问题
		clickAnalysis(analysis, event) {
			this.$router.push({name: 'analysis-analysisId-analysisReply',  query:{analysisId: analysis.id, cat1: analysis.cat1, pageNumber: this.pageNumber}} )
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
		
		emoji(word) {
		  // 生成html
		  const type = word.substring(1, word.length - 1);
		  return `<span class="emoji-item-common emoji-${type} emoji-size-small" ></span>`;
		},
		unemoji(word) {
			word = word.replace(/:.*?:/g, this.emoji);
			return word;
		},
		//写问题
		toWriteAnalysis() {
			this.$router.push({name: 'analysis-writeAnalysis'})
		},
		
		showPhoto(item, id) {
			this.showWriteAnalysis = false
			if(item.photoShow == 1) {
				ImagePreview({
					images: [
						this.analysisPrefix + item.storePath + item.img1,
					],
					startPosition: id,
					closeable: true,
					onClose() {
					    this.showWriteAnalysis = true
					},
				});
			}else if(item.photoShow == 2) {
				ImagePreview({
					images: [
						this.analysisPrefix + item.storePath + item.img1,
						this.analysisPrefix + item.storePath + item.img2,
					],
					startPosition: id,
					closeable: true,
					onClose(index) {
					    this.showWriteAnalysis = true
					},
				});
			}else {
				ImagePreview({
					images: [
						this.analysisPrefix + item.storePath + item.img1,
						this.analysisPrefix + item.storePath + item.img2,
						this.analysisPrefix + item.storePath + item.img3,
					],
					startPosition: id,
					closeable: true,
					onClose() {
					    this.showWriteAnalysis = true
					},
				});
			}
		},
		
		//显示数据
		showAnalysisList() {
			let req = {};
			this.$store.commit('setAnalysisPageNumber', this.pageNumber)
			req.pageNumber = this.pageNumber;
			req.cat1 = this.cat1
			this.$axios({
				url: '/customer/analysisList.do',
				method: 'post',
				data: req
			}).then(res => {
				// console.log(res.data.data)
				this.analysisList = []
				document.body.scrollTop = document.documentElement.scrollTop = 0
				for(let i=0; i<res.data.data.analysisList.length; i++){
					// res.data.data.analysisList[i].content = res.data.data.analysisList[i].content.replace(/:.*?:/g, this.emoji);
					res.data.data.analysisList[i].content = this.unemoji(res.data.data.analysisList[i].content);
					//每个图片的数量
					if(res.data.data.analysisList[i].img1!="" && res.data.data.analysisList[i].img1.length>0) {
						res.data.data.analysisList[i].photoShow = 1;
						if(res.data.data.analysisList[i].img2!="" && res.data.data.analysisList[i].img2.length>0) {
							res.data.data.analysisList[i].photoShow = 2;
							if(res.data.data.analysisList[i].img3!="" && res.data.data.analysisList[i].img3.length>0) {
								res.data.data.analysisList[i].photoShow = 3;
							}
						}
					}
					
					this.analysisList.push(res.data.data.analysisList[i])
				}
				this.pageCount = res.data.data.pageCount;
				//总记录数
				this.totalitems = res.data.data.totalitems;
			})
		},
		
		//显示分享面板
		isShowShare(id) {
			this.showShare = true
			this.clickId = id;
		},
		
	
	},
	
	
	mounted() {
		// let req = {};
		if(typeof this.$route.query.pageNumber!='undefined') {
			this.pageNumber = Number(this.$route.query.pageNumber)
		}
		else if(typeof this.$store.state.analysisPageNumber!='undefined') {
			this.pageNumber = this.$store.state.analysisPageNumber
		}
		this.showAnalysisList();
		
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,显示底部
		this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
}
</script>

<style lang="scss">
.analysisTop{
	list-style: none;
	padding-top: 0.625rem;
}
.analysisTop label{
	font-weight: bolder;
	color: 	#5f5f5f;
	padding: 10px;
}
.analysisTop label:hover{
	color: 	#000000;
}

.analysisContainer{
	.add{
		position: fixed;
		// top: 1.875rem;
		right: 1.85rem;
		bottom: 13.875rem;
		// background-color: black;
		z-index: 9999;
	}
}

@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css"; // 导入精灵图样式
</style>
