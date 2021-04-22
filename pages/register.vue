<template>
	<div>
		<van-nav-bar
		  title="登录"
		  left-text="返回"
		  left-arrow
		  @click-left="onClickLeft"
		/>
		<div class="top">
			<h1>IT分享注册</h1>
			<van-icon name="/icon/register.png" :size="100" color="#57cad4" />
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
		    placeholder="密码不得少于6位"
		    :rules="[{ required: true, message: '请填写密码' }]"
		  />
		  <van-field
		    v-model="password2"
		    type="password2"
		    name="password2"
		    label="密码2"
		    placeholder="确认密码"
		    :rules="[{ required: true, message: '请再次填写密码' }]"
		  />
		  <van-field
		    v-model="verify"
		    type="password"
		    name="验证码"
		    label="验证码"
		    placeholder="验证码"
		    :rules="[{ required: true, message: '请填写验证码' }]"
		  >
		  </van-field>
		  <van-image
		    width="200"
		    height="100"
		    :src=verifyTokenUrl
			@click="verifyFlush()"
		  />
		  
		  <div style="margin: 16px;">
		    <van-button round block type="info" native-type="submit">
		      注册
		    </van-button>
		  </div>
		  <div style="margin: 16px;">
		    <van-button round block type="primary" native-type="button" to="/login">
		      点击前往登录
		    </van-button>
		  </div>
		  
		</van-form>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION,verifyImage} from '@/type'
import axios from 'axios'; 
import moment from 'moment'
import { Dialog, Toast } from 'vant'
export default {
	data() {
	    return {
	      username: '',
	      password: '',
		  password2: '',
		  verify: '',
		  verifyToken: '',
		  verifyTokenUrl: '',
	    };
	 },
	methods: {
	    onSubmit(values) {
	      // console.log('submit', values);
			// console.log("用户名：" + values.name);
			// console.log("密码：" + values.password);
			if(values.name.trim().length < 4) {
				Toast.fail("密码对比失败，请输入正确密码！")
				return
			}
			if(values.password!=values.password2) {
				Toast.fail("密码对比失败，请输入正确密码！")
				return
			}
			let req = {};
			let user = {};
			user.name = values.name;
			user.password = values.password;
			req.user = user;
			req.name = values.name;
			req.password = values.password;
			// req.isSave = 0;
			this.$axios({
				url: "/customer/register.do",
				method: 'post',
				data: req
			})
			.then(res => {
				console.log(res)
				this.$router.push({name: 'login'})
			})
			.catch(e => {
				console.log(e)
				Toast.fail(e.data.reason)
			})
	    },
		onClickLeft() {
		  this.$router.go(-1)
		},
		//验证码刷新
		verifyFlush() {
			// this.verifyShow = false;
			let verifyToken = Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + '' + Math.ceil(Math.random()*100) + moment().locale('zh-cn').format('YYYYMMDDHHmmss')
			this.verifyToken = verifyToken
			this.verifyTokenUrl = verifyImage + verifyToken
			// this.verifyShow = true;
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
	}
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
