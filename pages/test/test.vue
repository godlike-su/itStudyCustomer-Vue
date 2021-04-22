<template>
	<div>
		<button @click="test">测试</button>
	</div>
</template>

<script>
export default{
	methods: {
		test() {
			this.$axios({
				url: '/customer/navTab.do',
				method: 'post'
			}).then(res => {
				console.log(res)
			}).catch(e => {
				console.log(e)
			})
		}
	}
}
</script>

<style>
</style>
