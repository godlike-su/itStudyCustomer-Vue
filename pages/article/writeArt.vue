<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  title="写文章"
			  left-arrow
			  @click-left="onClickLeft">
			</van-nav-bar>
			<van-field
			  v-model="title"
			  center
			  clearable
			  label="标题"
			  placeholder="请输入标题"
			>
			  <template #button>
			    <van-button size="small" type="info" @click="showPopup">发布</van-button>
			  </template>
			</van-field>
		</van-sticky>
		
		<section class="container" >
			<div class="quill-editor"
				:content=content
				 @change="onEditorChange($event)"
				 @blur="onEditorBlur($event)"
				 @focus="onEditorFocus($event)"
				 @ready="onEditorReady($event)"
				 v-quill:myQuillEditor="editorOption"
				 >
			</div>
		</section>
		
		<van-cell is-link @click="showChoosePopup"  id="showChoosePopup" style="display:none">展示弹出层</van-cell>
		<!-- 选择上传图片还是超链接 -->
		<van-popup v-model="isShowchoose">
			<van-button type="primary" style="margin-bottom: 5px;" block @click="clickVanuploader(0)">上传图片</van-button>
			<van-button type="info"  block @click="clickVanuploader(1)">上传超链接</van-button>
		</van-popup>
		
		<!-- 上传图片 -->
		<van-uploader id="photoUpload" ref="checkbox" v-show="false" 
		:after-read="afterRead" 
		:max-size="500 * 1024"
		 @oversize="onOversize"
		>
		</van-uploader>
		<!-- 上传超链接 -->
		<van-dialog v-model="isShowLink" title="超链接" show-cancel-button :showConfirmButton="false">
			<van-form @submit="addSuperlink">
				<van-field
				  v-model="linkName"
				  name="linkName"
				  label="名称"
				  placeholder="链接名称"
				  :rules="[{ required: true, message: '请填写链接名称' }]"
				/>
				
				<van-field
				  v-model="link"
				  name="link"
				  label="地址"
				  placeholder="链接地址"
				  :rules="[{ pattern, message: '请正确填写链接地址' }]"
				/>
				
				<div style="margin: 16px;">
				  <van-button round block type="info" native-type="submit">
				    确认
				  </van-button>
				</div>
			</van-form>
		</van-dialog>
		
		
		<!-- 发布弹出框框 -->
		<van-popup
		  v-model="show"
		  closeable
		  close-icon-position="top-right"
		  position="bottom"
		  :style="{ height: '100%' }"
		>
			<van-form @submit="onSubmit">
			<h2 style="text-align: center;">发布文章</h2>
			<van-divider />
				<div style="padding: 1.225rem;">
					<div class="row">
						<label>发布板块：</label>
						<van-dropdown-menu style="width: 100px;display: inline-block;">
						  <van-dropdown-item v-model="cat1" :options="option3" />
						</van-dropdown-menu>
					</div>
				
					
					<div class="row">
						<label>文章类型：</label>
						<van-dropdown-menu style="width: 100px;display: inline-block;">
						  <van-dropdown-item v-model="type" :options="option1" />
						</van-dropdown-menu>
					</div>
					
					<div class="row" v-if="isShowAdd">
						<label>转载地址：</label>
						<van-field
							v-model="address"
							name="pattern"
							placeholder="请输入转载地址"
							:rules="[{ pattern, message: '请输入正确内容' }]"
							style="display: inline-block;width: 70%;"
						  />
					</div>
					
					<div class="row">
						<label>发布形式：</label>
						<van-dropdown-menu style="width: 100px;display: inline-block;"  >
						  <van-dropdown-item v-model="form" :options="option2" />
						</van-dropdown-menu>
					</div>
					<p style="color: #888888;font-size: 0.9rem;">温馨提示：请勿发布涉及政治、广告、营销、翻墙、不符合IT行业、违法国家相关法律法规等内容</p>
					<van-button round block type="danger" plain native-type="submit">
					      确认发布
					</van-button>
				</div>
			</van-form>
		</van-popup>
		<!-- 撤销：Ctrl/Command + Z
		加粗：Ctrl/Command + B
		斜体：Ctrl/Command + I -->
		</div>
</template>

<script>
import axios from 'axios';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import { Toast,Dialog,DropdownMenu, DropdownItem  } from 'vant';
export default{
	data () {
	  return {
	    content: '',
		title: '',
		text: '',
		type: '原创',
		form: 0,
		address: '',
		pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
		navTabList: "",
		option3: [],
		option1: [
			{ text: '原创', value: '原创' },
			{ text: '转载', value: '转载' },
		],
		  option2: [
			{ text: '公开', value: 0 },
			{ text: '私密', value: 1 },
		],
		//显示最后提交的下面的弹出框
		show: false,
		//选择超链接还是上传图片 
		isShowchoose: false,
		//是否显示转载那条选项
		isShowAdd: false,
		navTabList: '',
		cat1: this.$store.state.typeId,
		linkName: '',
		link: '',
		isShowLink: false,
		
		
	    editorOption: {
	      // some quill options
		  theme: 'snow',
		  // theme: 'bubble',    //显示用
	      modules: {
	        toolbar: {
			  container: [
				['bold', 'italic', 'underline', 'strike'],  //加粗，斜体，下划线，删除线
				['blockquote', 'code-block'],				//引用，代码块
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],//列表
				['image'],									//图片
				// [{'header' : 1}, {'header' : 2}], 			//标题1， 标题2
				
				  // [{ 'indent': '-1'}, { 'indent': '+1' }],// 缩进
				  // [{ 'direction': 'rtl' }],// 文本方向
				  // [{ 'size': ['small', false, 'large', 'huge'] }],// 字体大小
				  [{ 'color': [] }, { 'background': [] }],// 字体颜色，字体背景颜色
				  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],//几级标题
				  // [{ 'font': [] }],//字体
				  [{ 'align': [] }],//对齐方式
				  ['clean'],//清除字体样式
				  // ['a']
			  ],
			  handlers: {
				'image': function () {
				  // 意思是使用插入图片的功能时候，触发文件上传控件的点击事件
				  // console.log('上传图片')
				  if (process.client) {
					   // document.getElementById("photoUpload").click()
					   document.getElementById("showChoosePopup").click()
				   }
				}
			  }
			}
	      }
	    },
	
	  }
	},
	   
	methods: {
	 afterRead(file) {
		  // 此时可以自行将文件上传至服务器
		  // console.log(file.file);
		  let req = {};
		  req.content = file.content;
		  // req.file = file.file;
		  req.name = file.file.name;
		  req.size = file.file.size;
		  req.type = file.file.type;
		  req.lastModified = file.file.lastModified;
		  this.$axios({
			  url: "/customer/user/article/fileUpload.do",
			  method: 'post',
			  data: req,
		  }).then(res => {
			 this.content += `<img src="/customer${res.data.data}" alt="内容图片" />`
			 // this.content += `<van-image src="/customer${res.data.data}" alt="内容图片" />`
		  }).catch(e => {
			  Toast.fail(res.data.reason);
			  Toast.fail('上传失败');
		  })
		},
		onOversize(file) {
		  Toast('文件大小不能超过 500kb');
		},
		//最后的确定发布。
		onSubmit(values) {
			let req = {}
			let article = {}
			article.creator = localStorage.getItem("id")
			article.ref1 = localStorage.getItem("id")
			article.text = this.text
			article.content = this.content
			article.type = this.type
			article.form = this.form
			article.address = this.address
			article.title = this.title
			article.cat1 = this.cat1;
			article.draft = 0;
			req.article = article;
			this.$axios({
				url: '/customer/article/saveArticle.do',
				method: 'post',
				data: req
			}).then(res => {
				if(res.data.error==0){
					Dialog.alert({
					  message: '上传文章成功',
					}).then(() => {
					  this.$router.push({path: '/home', query:{typeId: this.cat1, type: ''}})
					});
				}else {
					Dialog.alert({
					  message: '上传失败',
					})
				}
				
			})
			
			
		},
		//点击发布按钮，弹出确认发布等信息
		showPopup() {
			if(this.title.trim().length < 5 ){
				Dialog.alert({
				  message: '标题至少需要5个字',
				})
				return
			}
			if(this.text.trim().length < 20){
				Dialog.alert({
				  message: '文章至少需要20个字',
				})
				return
			}
		  this.show = true;
		},
		//展示选择图片或超链接弹出层
		showChoosePopup() {
			this.isShowchoose = true;
		},
		//模拟点击上传图片 或超链接
		clickVanuploader(value) {
			// console.log('上传图片')
			this.isShowchoose = false
			if(value == 0) {
				if (process.client) {
				   document.getElementById("photoUpload").click()
				}
			}
			else if(value == 1) {
				this.isShowLink = true
			}
		},
		//上传超链接
		addSuperlink(values) {
			this.content += `<a href='${values.link}' target="_blank">${values.linkName}</a>`
			this.isShowLink = false;
			this.link = "";
			this.linkName = '';
			// this.content += `<img src="/customer${res.data.data}" alt="内容图片" />`
			
			
		},
		
		
	  onEditorBlur(editor) { // 富文本失去焦点时的事件
	    // console.log('editor blur!', editor)
	  },
	  onEditorFocus(editor) { // 富文本获得焦点时的事件
	    // console.log('editor focus!', editor)
	  },
	  onEditorReady(editor) { // 富文本准备时的事件
	    // console.log('editor ready!', editor)
	  },
	  onEditorChange({ editor, html, text }) { // 富文本内容改变时的事件
		this.text = text.substring(0,49)
	    this.content = html
		// quill.insertEmbed(length, 'image', "/customer/" + res.data.data);
	  },
	  //返回上一页
		onClickLeft() {
		  if(this.text.trim().length > 0) {
		  	Dialog.confirm({
		  	  title: '退出发布问题',
		  	  message: '是否需要保存为草稿',
		  	}).then(() => {
		  		let req = {}
		  		let article = {}
		  		article.creator = localStorage.getItem("id")
		  		article.ref1 = localStorage.getItem("id")
		  		article.text = this.text
		  		article.content = this.content
		  		article.type = this.type
		  		article.form = this.form
		  		article.address = this.address
		  		article.title = this.title
		  		article.cat1 = this.cat1;
				article.draft = 1;
		  		req.article = article;
				console.log(req)
		  		this.$axios({
		  			url: '/customer/article/saveArticle.do',
		  			method: 'post',
		  			data: req
		  		}).then(res => {
		  			// console.log(res.data);
		  			this.$router.go(-1)
		  		}).catch(e => {
					console.log(e)
		  			Toast.fail('保存失败：' + e)
		  		})
		  		
		  	  }).catch(() => {
		  		this.$router.go(-1)
		  	  });
		  }else {
		  	this.$router.go(-1)
		  }
		},
		//---------
	},
	
	watch: {
		type(newName, oldName) {
			if(newName=="转载") {
				this.isShowAdd = true
			} else {
				this.isShowAdd = false
			}
		},
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
	
	mounted() {
		if(this.cat1 == 5) {
			this.cat1 = 10
		}
		this.$axios({
			url:"/customer/navTab.do",
			method: 'post',
		}).then(res => {
			let option3 = [];
			for(let i=1; i<res.data.data.length; i++){
				option3[i-1] = {text: res.data.data[i].name, value: res.data.data[i].id}
			}
			this.navTabList = res.data.data
			this.option3 = option3
		}).catch(e => {
			this.navTabList = ""
			this.option3 = ""
		})
	},
	
	async asyncData({ $axios }){
	}
}
</script>

<style lang="scss" scoped>

.quill-editor{
	// height: 1000px;
	width: 100%;
	position: fixed;
	top: 10rem;
	left: 0;
	padding-bottom: 10rem;
}
.row{
	padding-bottom: 0.625rem;
}

</style>
