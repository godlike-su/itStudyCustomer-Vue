<template>
	<div>
		
		<!-- <div style="position: fixed;top: 0rem;left: 0rem;bottom: 0rem;background-color: #000000;height: 100%;width: 100%;opacity: 0.5;">
		</div> -->
		
		<!-- 内容区域 -->
		<div class="comment-wrap" >
			
		  <textarea class="comment-input" placeholder="请输入内容" id="textpanel" v-model="content" @click="isShowEmojiPanel=false"
		  ref="content"  :style='textareaStyle'>
			  
		  </textarea>
		</div>
		
		
		<!-- 下面的显示tabbar -->
		<div class="analysis">
			<div class="tabbar" :style='bottom' >
				<div class="opration">
					<div class="emoji-panel-btn" @click="showEmojiPanel">
					  <img src="@/assets/img/face_logo.png" />
					</div>
					<label class="length">{{this.contentLength}}/300</label>
					<!-- <button class="length" @click='showCommond' :style='textareaStyle'>取消</button> -->
					<button class="length" @click="saveAnalysis">发送</button>
					<emoji-panel @emojiClick="appendEmoji" v-if="isShowEmojiPanel"></emoji-panel>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { Toast,Dialog  } from 'vant';
import EmojiPanel from "@/pages/emoji/EmojiPanel.vue";
export default{
	data () {
	  return {
		content: this.$store.state.CommondContent,
		contentLength: this.$store.state.CommondContent.length,
		isShowEmojiPanel: false,
		
		bottom: 'style="position: fixed; bottom: 0rem;"',
		// textareaStyle: 'style="height: 30px;position: fixed;bottom: 2.05rem"',
		textareaStyle: 'style="position: fixed; bottom: 2.05rem;"',
		
		//板块
		cat1: 0,
	  }
	},
	
	components: {
	  EmojiPanel
	},
	
	methods: {
		//发布聊天信息
		saveAnalysis() {
			// console.log('发送')
			this.isShowEmojiPanel = false;
			if(this.contentLength <=0 || this.contentLength > 300) {
				Toast("请规范字数！")
				return
			}
			this.$store.commit('setChat', this.contentLength);
		},
		
		
		showEmojiPanel() {
		  this.isShowEmojiPanel = !this.isShowEmojiPanel;
		  //取消表情时设置焦点给textarea
		  if(this.isShowEmojiPanel==false) {
			this.$refs.content.focus()
		  }
		  // document.body.scroll = 1500
		  // document.documentElement.scrollTop = 1500
		},
		
		appendEmoji(text) {
		  const el = document.getElementById("textpanel");
		  this.content = el.value + ":" + text + ":";
		  // this.$refs.content.focus() 
		},
		
		//需要上传的信息
		analysisInfomation() {
			let req = {};
			let user = {};
			user.id = localStorage.getItem('id')
			user.name = localStorage.getItem('name')
		},
		
	},
	
	watch: {
		content(newName, old) {
			this.contentLength = newName.length
			// console.log(newName)
			if(newName.length > 300) {
				Toast("请规范字数！")
			};
			this.$store.commit('setCommondContent', newName)
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
			  this.bottom = 'style="position: fixed; bottom: 15rem;"';
			  this.textareaStyle = 'style="position: fixed; bottom: 17.05rem;"';
			}else {
			  this.bottom = 'style="position: fixed; bottom: 0rem;"';
			  this.textareaStyle = 'style="position: fixed; bottom: 2.05rem;"';
			}
			// document.body.scroll = 1500
			document.documentElement.scrollTop = 1500
		},
	},
	
	mounted() {
		this.$refs.content.focus();
		// document.body.scroll = 1500
		document.documentElement.scrollTop = 1500
	}
	
}
</script>

<style lang="scss">

.comment-wrap {
  // width: 100%;
  // margin-bottom: 180px;
  .comment-input {
	width: 100%;
	position: fixed;
	// top: 2.9rem;
	left: 0;
	// bottom: 2.05rem;
	padding-bottom: 2rem;
	
    height: 1.875rem;
    // width: 100%;
    border: none;
	word-break: break-all;
	
    // padding: 10px;
    resize: none;
    &:focus {
      outline: none;
    }
  }
  
}
@import "@/assets/css/emoji.css"; // 导入精灵图样式

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

	.opration {
	  // width: 21.25rem;
	 background-color: white;
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
		height: 17.25rem;
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
