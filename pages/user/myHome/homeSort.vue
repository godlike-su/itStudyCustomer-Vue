<template>
	<!-- 我的主页显示分类 -->
	<div style="">
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
					
					<van-cell v-for="item in articleList" :key="item.id"  class="content" v-if="active==0">
						<div class="row" v-on:click="article(item.id, item.cat1)">
							<label style="font-weight: bold;">
								<span style="color: gold;" v-if="item.audit==1 ? true : false">审核中</span>
								<span style="color: red;" v-if="item.audit==2 ? true : false">审核未通过</span>
								<span style="color: blue;" v-if="item.draft==1">草稿</span>
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
							<span>{{item.numStart}}收藏数</span> <br>
							<span>{{item.createTime}}</span>
						</div>
					</van-cell>
					
					<!-- 问题 -->
					<div class="comment-wrap" v-if="active==1">
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
						  <div class="tabbar">
							<div  @click="isShowShare(item.id)"><van-icon name="share-o" />转发</div>
							<div v-if="item.numReply==0" @click="clickAnalysis(item)" ><van-icon name="smile-comment-o" />评论</div>
							<div v-if="item.numReply!=0" @click="clickAnalysis(item)" ><van-icon name="smile-comment" />{{item.numReply}}</div>
							<div v-if="item.numLike==0" @click="clickAnalysis(item)"><van-icon name="good-job-o" />点赞</div>
							<div v-if="item.numLike!=0" @click="clickAnalysis(item)"><van-icon name="good-job" />{{item.numLike}}</div>
							<div v-if="item.numStart==0" @click="clickAnalysis(item)"><van-icon name="star-o" />收藏</div>
							<div v-if="item.numStart!=0" @click="clickAnalysis(item)"><van-icon name="star" />{{item.numStart}}</div>
						  </div>
						 
						  <!-- 加个隔条 -->
						  <div style="height: 1px;background-color: #8cffe3;"></div>
					    </div>
					  </div>
					</div>
					
					<!-- <div v-if="active==2">
						<van-cell v-for="item in startList" :key="item.id"  class="content" v-if="active==0">
							<div class="row" v-on:click="article(item.id, item.cat1)">
								<label style="font-weight: bold;">
									<span style="color: gold;" v-if="item.audit==1 ? true : false">审核中</span>
									<span style="color: red;" v-if="item.audit==2 ? true : false">审核未通过</span>
									<span style="color: blue;" v-if="item.draft==1">草稿</span>
									<span style="color: green;" v-if="item.type=='原创' ? true : false">[{{item.type}}]</span>
									<span style="color: red;" v-if="item.type=='转载' ? true : false">[{{item.type}}]</span>
									{{item.title}}
								</label>
								
								<div class="van-multi-ellipsis--l2">
								  {{item.text}}
								</div>
								<span>{{item.creator}}</span> &nbsp;&nbsp; 
								<span>{{item.numLike}}点赞量</span>&nbsp;&nbsp;
								<span>{{item.numReply}}评论</span>&nbsp;&nbsp;
								<span>{{item.numStart}}收藏数</span> <br>
								<span>{{item.createTime}}</span>
							</div>
						</van-cell>
					</div> -->
					
					<div v-if="active==2">
						<p style="font-weight: bold;color: red;">敬请期待该功能上线...</p>
					</div>
				</van-list>
				
			</van-pull-refresh>			
		</div>
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
export default {
	inject: ['myHome'],
	data() {
		return {
			loading: false,		//false表示加载完成
			finished: false,	//数据结束标志
			refreshing: false,  //下拉刷新,false表示加载完成
			error: false,
			pageNumberList: [1,1,1,1],
			pageCountList: [0,0,0,0],
			articleList: [],		//文章数据
			startList: [],
			active: this.myHome.nowActive,
			analysisPrefix: '/customer/photo/analysis/',
			analysisList: [],
			showShare: false,
			options: [
				// { name: '微信', icon: 'wechat' },
				// { name: '微博', icon: 'weibo' },
				{ name: '复制链接', icon: 'link' },
				{ name: '分享海报', icon: 'poster' },
				{ name: '二维码', icon: 'qrcode' },
			],
		}
	},
	
	methods: {
		//加载文章数据
		async onLoad() {
			//更新数据
			let req = {};
			//文章
			if(this.active === 0) {
				let number0 = 0
				req.pageNumber = this.pageNumberList[number0]
				//加载数据，按照分页加载
				await this.$axios({
					url:'/customer/user/myHomeArticle.do',
					data: req,
					method: 'post'
				})
				.then(res => {
					this.pageCountList[number0] = res.data.data.pageCount;
					this.pageNumberList[number0] += 1;
					setTimeout(() => {
						if (this.refreshing) {
							this.articleList = [];
							// this.allList[number0] = this.list
							//变回第一页
							this.pageNumberList[number0] = 1;
							this.refreshing = false;
						}
						// let articleList = this.list
						for (let i = 0; i < res.data.data.article.length; i++) {
							this.articleList.push(res.data.data.article[i]);
						}
						// this.allList[number0] = articleList
						// this.list = articleList
						this.loading = false;
						if (this.pageNumberList[number0] >= this.pageCountList[number0]) {
							this.finished = true;
						}
					}, 500);
				})
				.catch((e) => {
					this.error = true;
					// console.log("首页文章加载错误" + e.data.reason);
					this.loading = false;
				})
			}
			
			//问答
			if(this.active === 1) {
				let number1 = 1
				req.pageNumber = this.pageNumberList[number1]
				//加载数据，按照分页加载
				await this.$axios({
					url:'/customer/user/myAnalysisList.do',
					data: req,
					method: 'post'
				})
				.then(res => {
					this.pageCountList[number1] = res.data.data.pageCount;
					this.pageNumberList[number1] += 1;
					
					setTimeout(() => {
						if (this.refreshing) {
							this.analysisList = [];
							// this.allList[number1] = this.analysisList
							//变回第一页
							this.pageNumberList[number1] = 1;
							this.refreshing = false;
						}
						// let analysisList = this.list
						for (let i=0; i<res.data.data.analysisList.length; i++) {
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
						// this.allList[number1] = this.analysisList
						
						
						this.loading = false;
						if ((this.pageNumberList[number1]) >= (this.pageCountList[number1])) {
							this.finished = true;
						}
					}, 1000);
				})
				.catch((e) => {
					this.error = true;
					// console.log("首页文章加载错误" + e.data.reason);
					this.loading = false;
				})
				
			}
			
			
			//收藏
			if(this.active === 2) {
				let number2 = 2
				req.pageNumber = this.pageNumberList[number2]
				//加载数据，按照分页加载
				await this.$axios({
					url:'/customer/user/myHomeStart.do',
					data: req,
					method: 'post'
				})
				.then(res => {
					console.log(res.data)
					this.pageCountList[number2] = res.data.data.pageCount;
					this.pageNumberList[number2] += 1;
					setTimeout(() => {
						if (this.refreshing) {
							this.startList = [];
							//变回第一页
							this.pageNumberList[number2] = 1;
							this.refreshing = false;
						}
						// let articleList = this.list
						for (let i = 0; i < res.data.data.article.length; i++) {
							this.startList.push(res.data.data.article[i]);
						}
						this.loading = false;
						if (this.pageNumberList[number2] > this.pageCountList[number2]) {
							this.finished = true;
						}
					}, 1000);
				})
				.catch((e) => {
					this.error = true;
					// console.log("首页文章加载错误" + e.data.reason);
					this.loading = false;
				})
			}
			
			//更多
			
			
		},
		onRefresh() {
			// 清空列表数据
			this.finished = false;
			// 重新加载数据
			this.pageNumberList[this.active] = 1
			// 将 loading 设置为 true，表示处于加载状态
			this.loading = true;
			this.onLoad();
		},
	
		//文章跳转的页面----------------------------------------------
		article(id, cat1) {
			console.log(cat1)
			this.$router.push({path: '/article/articleId', query:{articleId:id, typeId: cat1, type: this.type}})
		},
		//-------------------------------------------------
		
		// 有关问答的method-----------------------------
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
		//显示分享面板
		isShowShare(id) {
			this.showShare = true
			this.clickId = id;
		},
		
		//-------------------------------------------------------------------
	
	},
	
	computed: {
		nowActive() {
			return this.myHome.nowActive
		}
	},
	
	watch: {
		nowActive(newValue, oldValue) {
			this.active = newValue
			//关于是否有显示更多
			if(newValue === 0) {
				if (this.pageNumberList[newValue] > this.pageCountList[newValue]) {
					this.finished = true;
				} else {
					this.finished = false;
				}
			}
			else if(newValue === 1) {
				if ((this.pageNumberList[newValue] - 1) > (this.pageCountList[newValue] / 10)) {
					this.finished = true;
				} else {
					this.finished = false
				}
			}
			else {
				this.finished = true;
			}
			
			//初始的时候判断是否有数据
			if(this.pageNumberList[newValue] == 0) 
			{
				this.pageNumberList[newValue] = 1
				if(newValue===0) {
					this.articleList = []
				}else if(newValue===1) {
					this.analysisList = []
				}
				this.onLoad()
			} 
			
		}
	},
}

</script>

<style lang="scss">
@import "@/assets/css/analysis/showContent";
@import "@/assets/css/emoji.css"; // 导入精灵图样式
</style>
