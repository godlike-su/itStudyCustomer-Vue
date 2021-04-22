<template>
	<div class="tabbar">
		<van-tabbar v-model="active" :route="true" :placeholder="true" :safe-area-inset-bottom="true" replace>
		  <van-tabbar-item :to="{name: 'index-home', query:{typeId: this.$store.state.typeId, type: this.$store.state.type}}"  icon="wap-home-o">
			  知识分享
		  </van-tabbar-item>
		  <van-tabbar-item to="/analysis" icon="cluster-o" >你问我答</van-tabbar-item>
		  <!-- <van-tabbar-item to="/analysis" icon="cluster-o" dot>你问我答</van-tabbar-item> -->
		  <van-tabbar-item to="/message" icon="smile-comment-o" :badge=unchatCount>消息</van-tabbar-item>
		  <van-tabbar-item to="/user" icon="contact">我的</van-tabbar-item>
		</van-tabbar>
		
	</div>
</template>

<script>
// import '@vant/touch-emulator';
export default{
	data(){
		return {
			// homeLink: this.$store.state.homeLink,
			active: 0,
			unchatCount: this.$store.state.unchatCount,
		}
	},
	methods: {
		onClick() {
			this.$router.push({path: '/home', query:{typeId: this.$store.state.typeId, type: this.$store.state.type}})
		},
	},
	computed: {
		//监听是否上传信息
		isunchatCount() {
			return this.$store.state.unchatCount
		},
	},
	mounted() {
		
	},
	watch: {
		isunchatCount(newVal, oldVal) {
			// this.$store.commit('setChat', 0)
			this.unchatCount = newVal
			
		}
	}
}
</script>

<style lang="scss" scoped>
	.tabbar{
		border-top: 1px solid #effef8;
	}
	
	
</style>
