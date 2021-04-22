<template>
	<div class="container">
		<div class="row" v-if="login">
			<van-grid :border="false" :column-num="2"  direction="vertical" >
			  <van-grid-item>
				<van-image round :src="thumb"  class="headPort" show-error show-loading fit="cover" @click="showThumb">
					<template v-slot:error>加载失败</template>
					<template v-slot:loading>图片加载中</template>
				</van-image>
			  </van-grid-item>
			  
			  <van-grid-item>
				<van-grid :border="false" :column-num="1"  direction="vertical" >
					<van-grid-item >
						<div>
							<h3>{{name}}</h3> 
							<h3>{{sex}}</h3>
						</div>
					</van-grid-item>	
				</van-grid>	 
			  </van-grid-item>
			</van-grid>
		</div>
		
		<div class="row" v-if="login">
			<van-grid :column-num="4" :border="false">
			  <van-grid-item icon="like-o" text="我的收藏" :to="{name: 'user-myStart-startSort'}" />
			  <van-grid-item icon="eye-o" :to="{name: 'user-history'}" text="浏览记录" />
			  <van-grid-item icon="description" text="我的分享" :to="{name: 'user-myHome-homeSort'}" />
			  <van-grid-item icon="/icon/signIn.png" text="签到" :to="{name: 'user-signIn'}" />
			</van-grid>
		</div>
		
		
		<div class="row" v-if="login">
			<van-cell-group>
			  <!-- <van-cell icon="label-o" title="我的收藏" is-link /> -->
			  <van-cell icon="user-circle-o" title="我的信息" is-link to="/user/information" />
			  <van-cell icon="/icon/feedback.png" title="反馈" is-link />
			  <van-cell icon="setting-o" to="/user/setting" title="安全设置" is-link />
			  <van-cell icon="setting-o" to="/user/setting" title="设置" is-link />
			</van-cell-group>
		</div>
		
		
		<!-- 未登录显示 -->
		<div class="row" v-if="!login">
			<van-grid :border="false" :column-num="2"  direction="vertical" >
			  <van-grid-item>
				<van-image round src="Thumb.png"  class="headPort" show-error show-loading fit="cover" @click="showThumb">
					
				</van-image>
			  </van-grid-item>
			  
			  <van-grid-item>
				<van-grid :border="false" :column-num="1"  direction="vertical" >
					<van-grid-item >
						<div>
							<h3>未登录</h3> 
						</div>
					</van-grid-item>	
				</van-grid>	 
			  </van-grid-item>
			</van-grid>
		</div>
		<div class="row" v-if="!login">
			<van-grid :column-num="2" :border="false">
			  <van-grid-item icon="eye-o" text="浏览记录" :to="{name: 'user-history'}" />
			  <van-grid-item icon="arrow" text="前往登录" :to="{name: 'login'}" />
			</van-grid>
		</div>
		
	</div>
</template>

<script>
import { ImagePreview, Toast } from 'vant';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
export default {
	data() {
		return {
			name: '',
			id: '',
			sex: 1 ? '男' : '女',
			firstTime: this.$store.state.firstTime,
			thumb: '',
			// 照片路径前缀
			prefix: '/customer/photo',
			login: false,
		}
	},
	
	methods: {
		showThumb() {
			ImagePreview({
			  images: [
			    this.thumb
			  ],
			  closeable: true,
			});
		}
	},
	
	mounted() {
		this.$axios({
			url: '/customer/test/isLogin',
			method: 'post'
		}).then(res => {
			if(res.data.error == 0) {
				this.login = true
				this.name = localStorage.getItem("name");
				this.id = localStorage.getItem("id");
				this.sex = localStorage.getItem("sex") ? '男' : '女';
				this.thumb = localStorage.getItem("thumb");
			}
		}).catch(e => {
			// console.log(e.data.reason)
		})
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,显示底部
		this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
	
}
</script>

<style lang="scss" scoped>
	.container{
		background-color: #fff9f7;
	}
	.headPort{
		width: 6.25rem;
		height: 6.25rem;
	}
	.row{
		padding-bottom: 5px;
	}
</style>
