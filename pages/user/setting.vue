<template>
	<div class="container">
		<van-nav-bar
		  title="标题"
		  left-text="返回"
		  left-arrow
		  @click-left="onClickLeft"
		/>
		<div class="row">
			<van-cell title="修改密码" size="large" is-link @click="dialogShow=true" />
			<van-cell title="暂无信息" value="内容" size="large" label="描述信息" />
		</div>
		<div class="row">
			<van-button type="danger" @click="showDialog" block>退出登录</van-button>
		</div>
		
		
		<van-dialog v-model="dialogShow" show-cancel-button @confirm="setPassword()">
		  <div>
			<van-field
			      v-model="oldPassword"
			      name="oldPassword"
			      label="原密码"
			      placeholder="请输入原密码"
				  type="password"
			/>
			<van-field
			      v-model="password"
			      name="password"
			      label="新密码"
			      placeholder="请输入新密码"
				  type="password"
			/>
			<van-field
			      v-model="password2"
			      name="password2"
			      label="确认密码"
			      placeholder="请确认密码"
				  type="password"
			/>
		  </div>
		</van-dialog>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import { Dialog, Toast } from 'vant';
export default {
	data() {
		return {
			oldPassword: '',
			password: '',
			password2: '',
			dialogShow: false,
		}
	},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
	showDialog() {
		Dialog.confirm({
		  title: '退出登录',
		  message: '是否确认退出登录',
		})
		  .then(() => {
			// on confirm
		    this.logout();
		  })
		  .catch(() => {
		    // on cancel
		  });
	},
	
	logout() {
		let req = {}
		req.name = "1"
		this.$axios({
			url: "/customer/logout.do",
			method: 'post',
			data: req
		}).then(res => {
			//退出登录
			// localStorage.removeItem("token");
			// localStorage.removeItem("name");
			// localStorage.removeItem("id");
			// localStorage.removeItem("sex");
			this.$store.commit("logout")
			Dialog.alert({
			  title: '退出',
			  message: '注销成功',
			}).then(() => {
				// console.log(res.data.data)
				this.$router.push({name: 'index-typeId', params:{typeId: this.$store.state.typeId}, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
			})
		}).catch(e => {
			Dialog.alert({
			  title: '',
			  message: '出了点小问题，但是还是能退出',
			}).then(() => {
			  // on close
			  this.$store.commit("logout")
			  // console.log(e)
			  this.$router.push({name: 'index-typeId', params:{typeId: this.$store.state.typeId}, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
			});
		})
	},
	cancel() {
		this.show = false
	},
	//修改密码
	setPassword() {
		if(this.oldPassword=='') {
			Toast.fail('请正确输入密码')
			return
		}
		if(this.password.length<6) {
			Toast.fail('请输入6位数以上密码')
			return
		}
		if(this.password!=this.password2) {
			Toast.fail('密码对比不正确')
			return
		}
		let req = {}
		req.oldPassword = this.oldPassword
		req.password = this.password
		req.password2 = this.password2
		this.$axios({
			url: '/customer/user/setPassword.do',
			method: 'post',
			data: req
		}).then(res=>{
			this.$store.commit("logout")
			this.$router.push({name: 'index-typeId', params:{typeId: this.$store.state.typeId}, query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
		}).catch(e => {
			Toast.fail(e.data.reason)
		})
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
  
};	
</script>

<style lang="scss" scoped>
	.container{
		background-color: #fff9f7;
	}
	.row{
		padding-top: 5px;
		padding-bottom: 5px;
	}
</style>
