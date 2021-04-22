<template>
	<div>
		<van-popup v-model="show">
			<div class="popup" style="text-align: center;padding: 0.625rem;">
				<label class="label" style="padding: 0.625rem;font-weight: bold;">是否确认退出登录</label>
				<van-button type="primary" class="cancel" size="small" @click="cancel" style="margin: 1.25rem 0.625rem 0.3125rem 0rem;">取消</van-button>
				<van-button type="danger" class="confirm" size="small" @click="logout" style="margin: 1.25rem 0rem 0.3125rem 0.625rem;">确认</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script>
	
export default{
	data(){
		return {
			active: 0,
			show: true
		}
	},
	methods: {
		logout() {
			
		},
		cancel() {
			this.show = false
		}
	}
}
</script>

<style  lang="scss" scoped="scoped">
	.popup{
		text-align: center;
		padding: 10px;
	}
	.popup .label{
		padding: 10px;
		font-weight: bold;
	}
	.popup .cancel{
		// float: left;
		margin: 20px 10px 5px 0px;
		// margin-right: 0.625rem;
	}
	.popup .confirm{
		// float: right;
		// margin: 10px;
		margin: 20px 0px 5px 10px;
	}
</style>
