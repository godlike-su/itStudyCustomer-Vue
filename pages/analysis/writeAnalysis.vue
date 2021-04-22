<template>
	<div>
		<!-- 头部导航栏 -->
		<van-nav-bar
		  title="江湖求助"
		  left-arrow
		  right-text="发布"
		  @click-left="onClickLeft"
		  @click-right="saveAnalysis"
		>
		</van-nav-bar>
		
		<!-- 内容区域 -->
		<div class="comment-wrap">
		  <textarea class="comment-input" 
		  placeholder="请输入内容" id="textpanel" v-model="content" @click="isShowEmojiPanel=false"
		  ref="content">
			  
		  </textarea>
		</div>
		
		<!-- 图片显示-->
		<div class="analysis_showPicture" >
			<van-uploader v-model="imgList" :max-count="0" >
			 
			</van-uploader>
		</div>
		
		
		<!-- 下面的显示tabbar -->
		<div class="analysis">
			<div class="tabbar" :style='bottom' >
				
				<div class="row">
					<label class="topic" @click="selectCat1">未选择话题</label>
					<label class="length">{{this.contentLength}}/1024</label>
				</div>
				
				<div class="opration">
					<div class="emoji-panel-btn" @click="showEmojiPanel">
					  <img src="@/assets/img/face_logo.png" />
					</div>
					
					<!-- 上传图片 -->
					<van-uploader class="emoji-panel-btn" 
					:after-read="uploadPhoto"
					:before-read="beforeRead"
					:disabled="uploadDisabled"
					>
					  <img src="@/assets/img/picture.png" type="submit" />
					</van-uploader>
					
					<emoji-panel @emojiClick="appendEmoji" v-if="isShowEmojiPanel"></emoji-panel>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
import axios from 'axios';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import { Toast,Dialog  } from 'vant';
import EmojiPanel from "@/pages/emoji/EmojiPanel.vue";
export default{
	data () {
	  return {
		content: "",
		contentLength: 0,
		flag: false,
		isShowEmojiPanel: false,
		comments: [],
		active: 0,
		//上传按钮是否禁止
		uploadDisabled: false,
		
		bottom: 'style="position: fixed; bottom: 0rem;"',
		//文件前缀映射
		filePrefix: '/customer/photo',
		imgList: [],
		//板块
		cat1: 0,
	  }
	},
	
	components: {
	  EmojiPanel
	},
	
	methods: {
		//发布问题
		saveAnalysis() {
			this.isShowEmojiPanel = false;
			if(this.contentLength <=0 || this.contentLength > 1024) {
				Toast("请规范字数！")
				return
			}
			let req = this.analysisInfomation();
			req.analysis.draft = 0
			this.$axios({
				url: '/customer/analysis/writeAnalysis.do',
				method: 'post',
				data: req
			}).then(res => {
				// console.log(res.data);
				this.$router.push({name: 'analysis'})
			}).catch(e => {
				Toast.fail('保存失败：' + e)
			})
		},
		// 上传图片
		uploadPhoto(file) {
			let req = {};
			req.content = file.content;
			// req.file = file.file;
			req.name = file.file.name;
			req.size = file.file.size;
			req.type = file.file.type;
			req.lastModified = file.file.lastModified;
			this.$axios({
				url: "/customer/analysis/fileUpload.do",
				method: 'post',
				data: req
			}).then(res => {
				if(res.data.error == 0) {
					// console.log(res.data.data)
					let data = {};
					data.url = this.filePrefix + res.data.data.tmpUrl;
					data.name = res.data.data.name;
					
					this.imgList.push(data)
				} else {
					Toast.fail('上传图片失败: ' + res.data.reason)
				}
			}).catch(e => {
				Toast.fail('上传图片失败: ' + e)
			})
		},
		// 上传前的判断
		beforeRead(file) {
			// console.log(file.type)
			this.isShowEmojiPanel = false;
			
			if(this.imgList.length > 3) {
				Toast('最多上传3张图片')
				return false;
			}
			else if (false) {
				Toast('请上传 jpg 格式图片');
				return false;
			 } 
			 else if(file.size > 1024 * 1024 * 2) {
				 Toast('文件请小于1M');
				 return false;
			 }
			
			return true
		},
		
		//选择话题
		selectCat1() {
			Toast("未实现该功能！")
		},
		
		
		showEmojiPanel() {
		  this.isShowEmojiPanel = !this.isShowEmojiPanel;
		  //取消表情时设置焦点给textarea
		  if(this.isShowEmojiPanel==false) {
			  this.$refs.content.focus()
		  }
		},
		
		appendEmoji(text) {
		  const el = document.getElementById("textpanel");
		  this.content = el.value + ":" + text + ":";
		  this.$refs.content.focus();
		},
		
		onClickLeft() {
			// if(this.contentLength > 0) {
			// 	Dialog.confirm({
			// 	  title: '退出发布问题',
			// 	  message: '是否需要保存为草稿',
			// 	}).then(() => {
			// 		let req = this.analysisInfomation();
			// 		req.analysis.draft = 1
			// 		this.$axios({
			// 			url: '/customer/analysis/writeAnalysis.do',
			// 			method: 'post',
			// 			data: req
			// 		}).then(res => {
			// 			// console.log(res.data);
			// 			this.$router.go(-1)
			// 		}).catch(e => {
			// 			Toast.fail('保存失败：' + e)
			// 		})
					
			// 	  }).catch(() => {
			// 		this.$router.go(-1)
			// 	  });
			// }else {
			// 	this.$router.go(-1)
			// }
			this.$router.go(-1)
		},
		
		//需要上传的信息
		analysisInfomation() {
			let req = {};
			let user = {};
			user.id = localStorage.getItem('id')
			user.name = localStorage.getItem('name')
			let analysis = {};
			analysis.creator = localStorage.getItem('id')
			analysis.title = this.content.substring(0, 20)
			//空格 回车替换成前端显示的样式
			analysis.content = this.content.replace(/\r\n/g,'<br/>').replace(/\n/g,'<br/>').replace(/\s/g,' ');
			analysis.cat1 = this.cat1
			
			if(typeof this.imgList[0]!='undefined'){
				analysis.img1 = this.imgList[0].name;
				if(typeof this.imgList[1]!='undefined'){
					analysis.img2 = this.imgList[1].name;
					if(typeof this.imgList[2]!='undefined'){
						analysis.img3 = this.imgList[2].name;
					}
				}
			}
			req.user = user;
			req.analysis = analysis;
			return req;
		},
		
	},
	
	watch: {
		content(newName, old) {
			this.contentLength = newName.length
		},
		imgList(newName, old) {
			if(this.imgList.length >= 3) {
				this.uploadDisabled = true
			}else {
				this.uploadDisabled = false
			}
			this.isShowEmojiPanel = false;
		},
		isShowEmojiPanel(newName, old) {
			if(this.isShowEmojiPanel) {
			  this.bottom = 'style="position: fixed; bottom: 15rem;"'
			}else {
			  this.bottom = 'style="position: fixed; bottom: 0rem;"'
			}
		}
		
	},
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
	
}
</script>

<style lang="scss">
.comment-wrap {
  // width: 100%;
  // margin-bottom: 180px;
  .comment-input {
	width: 100%;
	position: fixed;
	top: 2.9rem;
	left: 0;
	padding-bottom: 5rem;
	
    height: 15.625rem;
    // width: 100%;
    border: none;
	
    // padding: 10px;
    resize: none;
    &:focus {
      outline: none;
    }
  }
  
}
@import "@/assets/css/emoji.css"; // 导入精灵图样式
.analysis_showPicture {
	position: fixed;
	top: 25rem;
}
.analysis {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.tabbar {
		position: fixed;
		bottom: 0rem;
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// height: 150px;
	}
	.row {
		width: 21.25rem;
		// border: none;
		display: flex;
		// flex-direction: row;
		justify-content: space-between;
		// align-items: center;
		// position: relative;
		
		.topic{
			background-color: 	#CDCDB4;
			padding: 5px;
			border-radius: 6.25rem;
			color: 	#000000;
			font-size: 0.9125rem;
		}
		.length{
			color: #7AC5CD;
			font-size: 0.85rem;
		}
		
	}
	.opration {
	  // width: 21.25rem;
	 
	  width: 21.25rem;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: space-between;
	  // justify-content: center;
	  position: relative;
	  .emoji-panel-btn {
	    &:hover {
	      cursor: pointer;
	      opacity: 0.8;
	    }
	    img {
	      height: 24px;
	      width: 24px;
	    }
	  }  
	}
	.emoji-panel-wrap {
		width: 100%;
		border: none;
	}
	.emoji-item-common {
	  background: url("~assets/img/emoji_sprite.png");
	  display: inline-block;
	  &:hover {
	    cursor: pointer;
	  }
	}
	.emoji-size-small {
	  // 表情大小
	  zoom: 0.3;
	}
	.emoji-size-large {
	  zoom: 0.5; // emojipanel表情大小
	  margin: 4px;
	}
	
}
</style>
