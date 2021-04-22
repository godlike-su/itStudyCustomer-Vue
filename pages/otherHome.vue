<template>
	<div class="otherHome">
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft"
			  title="他人空间">
			</van-nav-bar>
		</van-sticky>
		<div class="row">
			<van-grid :border="false" :column-num="2"  direction="vertical" >
			  <van-grid-item>
				<van-image round :src="user.thumb"  class="headPort" show-error show-loading fit="cover" @click="showThumb">
					<template v-slot:error>加载失败</template>
					<template v-slot:loading>图片加载中</template>
				</van-image>
			  </van-grid-item>
			  
			  <van-grid-item>
				<van-grid :border="false" :column-num="1"  direction="vertical" >
					<van-grid-item >
						<div>
							<h4>学号：{{user.studentID}}</h4>
							<h4>昵称：{{user.name}}</h4> 
							<h4>性别：{{user.sex ? '女' : '男'}}</h4>
							<h4>粉丝：{{interestCount}}</h4>
						</div>
					</van-grid-item>	
				</van-grid>	 
			  </van-grid-item>
			</van-grid>
		</div>
		
		<van-sticky offset-top='40px'>
			<van-tabs v-model="active" @change="onClick">
				<van-tab title="文章" ></van-tab>
				<van-tab title="问答"></van-tab>
				<!-- <van-tab title="收藏"></van-tab> -->
				<van-tab title="更多"></van-tab>
			</van-tabs>
		</van-sticky>
		<Nuxt />
	</div>
</template>

<script>
import { ImagePreview, Toast, Dialog } from 'vant';
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
export default {
	data() {
		return {
			// sex: 1 ? '男' : '女',
			// firstTime: this.$store.state.firstTime,
			// thumb: '',
			// 照片路径前缀
			prefix: '/customer/photo',
			user: '',
			//粉丝数目
			interestCount: 0,
			active: 0,
			nowActive: 0,
		}
	},
	
	provide() {
		return {
			otherHome: this
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
		},
		onClickLeft() {
			// this.$router.replace({path: '/user'})
			this.$router.go(-1)
		},
		onClick(name, title) {
			//更新首页动态链接
			this.nowActive = name
			this.active = name
		},
	},
	
	mounted() {
		let req = {}
		req.id = this.$route.query.id
		this.$axios({
			url: '/customer/otherHome.do',
			method: 'post',
			data: req
		}).then(res => {
			this.user = res.data.data.user
			this.user.thumb = this.prefix + this.user.thumb
			this.interestCount = res.data.data.interestCount
		}).catch(e => {
			Dialog.alert({
			  title: '错误',
			  message: e.data.reason,
			}).then(() => {
			  // on close
			});
		})
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

<style lang="scss" scoped>
	.otherHome{
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

