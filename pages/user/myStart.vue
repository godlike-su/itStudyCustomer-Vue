<template>
	<div class="myArticle">
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  title="我的收藏"
			  @click-left="onClickLeft">
			</van-nav-bar>
		</van-sticky>
		
		<van-sticky offset-top='40px'>
			<van-tabs v-model="active" @change="onClick">
				<van-tab title="文章" ></van-tab>
				<van-tab title="问答"></van-tab>
			</van-tabs>
		</van-sticky>
		<Nuxt />
		
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
			thumb: '',
			// 照片路径前缀
			prefix: '/customer/photo',
			login: false,
			active: 0,
			nowActive: 0,
		}
	},
	
	provide() {
		return {
			myStart: this
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
			this.$router.replace({path: '/user'})
		},
		onClick(name, title) {
			//更新首页动态链接
			this.nowActive = name
			this.active = name
		},
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
	.myArticle{
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
