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
	  beforeUpdate() {
		  //创建时检测是否直接是空路径，是的话进行刷新
	  	if(typeof this.$route.query.typeId == 'undefined'){
		  this.$router.push({path: '/home', query:{typeId: 5, type: "热榜"}})
	  	}
	  },
	  mounted() {
	  },
	  beforeCreate() {
	  	
	  }
	
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
