<template>
	<div>
		<van-nav-bar
		  title="登录"
		  left-text="返回"
		  left-arrow
		  @click-left="onClickLeft"
		/>
		
		<div class="top">
			<h1>IT分享登录</h1>
			<van-icon name="manager" :size="100" color="#57cad4" />
		</div>
		
		<van-form @submit="onSubmit">
		  <van-field
		    v-model="username"
		    name="name"
		    label="学号"
		    placeholder="学号"
		    :rules="[{ required: true, message: '请填写学号' }]"
		  />
		  <van-field
		    v-model="password"
		    type="password"
		    name="password"
		    label="密码"
		    placeholder="密码"
		    :rules="[{ required: true, message: '请填写密码' }]"
		  />
		  
		 <van-field
		    v-model="verify"
		    type="verify"
		    name="验证码"
		    label="验证码"
		    placeholder="验证码"
		    :rules="[{ required: true, message: '请填写验证码' }]"
		  >
		  </van-field>
		  
		  <van-image
			v-model="verifyShow"
		    width="200"
		    height="100"
		    :src=verifyTokenUrl
			@click="verifyFlush()"
		  />
		  
		  <!-- 两端对齐 -->
		  <van-row type="flex" justify="space-between">
		    <van-checkbox v-model="isSave" shape="square">记住密码</van-checkbox>
		    <van-col span="6" @click="forgetPs()">忘记密码</van-col>
		  </van-row>
		  
		  <div style="margin: 16px;">
		    <van-button round block type="info" native-type="submit">
		      登录
		    </van-button>
		  </div>
		  <div style="margin: 16px;">
		    <van-button round block type="primary " native-type="button" to="/register">
		      点击前往注册
		    </van-button>
		  </div>
		</van-form>
		<div class="icon-wrapper">
			推荐使用：<i class="iconfont"><a href="" ><img :src="require('@/static/icon/qq.png')"></a></i>
		</div>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION,verifyImage} from '@/type';
import axios from 'axios'; 
import { Dialog, Toast } from 'vant';
import moment from 'moment'
export default {
	data() {
	    return {
	      username: '',
	      password: '',
		  verify: '',
		  data: '',
		  verifyToken: '',
		  verifyTokenUrl: '',
		  verifyShow: true,
		  isSave: true,
	    };
	 },
	methods: {
	    onSubmit(values) {
			let req = {};
			req.name = values.name;
			req.password = values.password;
			req.isSave = this.isSave;
			req.verifyToken = this.verifyToken;
			req.verify = this.verify
			this.$axios({
				url: "/customer/login.do",
				method: 'post',
				data: req
			})
			.then(res => {
				localStorage.setItem("token", res.data.data.sessionId)
				localStorage.setItem("studentID", res.data.data.studentID)
				localStorage.setItem("name", res.data.data.name);
				localStorage.setItem("id", res.data.data.id);
				localStorage.setItem("sex", res.data.data.sex);
				localStorage.setItem("thumb", "/customer/photo" + res.data.data.thumb);
				
				
				if(this.$store.state.resultUrl.length == 0){
					this.$router.push({name: 'index-typeId', params:{typeId: this.$store.state.typeId}, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
				}else{
					this.$router.push(this.$store.state.resultUrl)
				}
			})
			.catch(e => {
				this.verify = ''
				this.verifyFlush()
				Dialog.alert({
				  message: e.data.reason,
				})
			})
			
		},
		onClickLeft() {
		  this.$router.go(-2)
		},
		//验证码刷新
		verifyFlush() {
			this.verify = ""
			let verifyToken = Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + new Date().getTime()
			this.verifyToken = verifyToken
			this.verifyTokenUrl = verifyImage + verifyToken
		},
		//忘记密码
		forgetPs() {
			
		},
	}, 
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.state.isTabbarShow = true;
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
	
	mounted() {
		let verifyToken = Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + new Date().getTime()
		this.verifyToken = verifyToken
		this.verifyTokenUrl = verifyImage + verifyToken
	},
	
	watch: {
		
	},
}
</script>

<style lang="scss" scoped>
	.top{
		// display: flex;
		text-align: center;
		padding: 10px 30px;
	}
	.icon-wrapper{
		text-align: center;
	}
</style>
