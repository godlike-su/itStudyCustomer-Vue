<template>
  <div class="container">
	<van-notice-bar scrollable  mode="closeable" v-show="false">
	  技术是开发它的人的共同灵魂。
	</van-notice-bar>
	
	<div class="content">
		<!-- <Nuxt v-if="isRouterAlive" /> -->
		<router-view v-if="isRouterAlive"></router-view>
	</div>
	
    <Tabbar v-if="this.$store.state.isTabbarShow" />
	
  </div>
</template>

<style lang="scss" scoped>
	* {
	  margin: 0;
	  padding: 0;
	  
	}
	.van-notice-bar{
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
	}
	@media screen and ( max-width: 1400px ) {
		.container{
			width: 100%;
			height: 100%;
			.content{
				
			}
		}
	}
	@media screen and ( max-width: 1080px ) {
		.container{
			width: 100%;
			height: 100%;
			.content{
				// width: 62.5rem;
			}
		}
	}
	

</style>

<script>
import {mapState} from 'vuex'
import { Popover } from 'vant';
import { Toast } from 'vant';
export default{
	data() {
		return {
			show: false,
			isRouterAlive: true
		}
	},
	methods: {
		reload() {
			this.isRouterAlive = false;
			this.$nextTick(function(){
				this.isRouterAlive = true;
			})
		},
	},
	
	provide() {
		return {
			reload: this
		}
	},
	computed: {
		...mapState(["isTabbarShow"])
	},
	beforeCreate() {
		
	}
}
	
</script>

