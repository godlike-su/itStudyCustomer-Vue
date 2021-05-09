<template>
	<div>
		
	</div>
</template>

<script>
import axios from 'axios'; 
import { Toast } from 'vant';
export default{
	data() {
	    return {
	    };
	  },
	  methods: {
		//首页按2此退出
	  },
	watch: {
		  $route:{
			  handler(newRouter){
				this.loading = true;
			  },
		  },
	},
	 
	  mounted() {
	  },
	
}
</script>

<style lang="scss" scoped>
.content{
	
}	
.row{
	// padding-bottom: 10px;
	// background-color: #F7F8FB;
}

</style>
