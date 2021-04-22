<template>
	<div>
		<!-- 头部导航栏 -->
		<van-sticky>
			<van-nav-bar
			  left-arrow
			  @click-left="onClickLeft">
			  
			  <template #title>
			  	<p>签到</p>
			  </template>
			</van-nav-bar>
		</van-sticky>
		签到
	</div>
</template>

<script>

export default {
	data() {
		return {
			
		}
	},
	
	methods: {
		onClickLeft() {
		  this.$router.go(-1)
		},
	}
}
</script>

<style>
</style>
