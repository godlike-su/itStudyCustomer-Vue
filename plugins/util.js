

export default ({route}) => {
	console.log(route)
	if (process.client) {
			document.addEventListener('plusready', function(){
				var first = null;
					plus.key.addEventListener('backbutton', function() {
						//如果是首页提示再按一次退出，不是首页怎返回上一个路由
						if(this.$route.path=='/home' || 
						this.$route.path=='/message' || 
						this.$route.path=='/analysis' ||
						this.$route.path=='/user') {
							//首次按键，提示‘再按一次退出应用’
							if (!first) {
								first = new Date().getTime();
								Toast('再按一次退出应用')
								setTimeout(function() {
									first = null;
								}, 1000);
							} else {
								if (new Date().getTime() - first < 1000) {
									plus.runtime.quit();
								}
							}
						} else {
							this.$router.go(-1)
						}
						
					}, false);
			})
		}
}


// let utils = {
// 	if (process.client) {
// 		document.addEventListener('plusready', function(){
// 			var first = null;
// 				plus.key.addEventListener('backbutton', function() {
// 					//如果是首页提示再按一次退出，不是首页怎返回上一个路由
// 					if(this.$route.path=='/home' || 
// 					this.$route.path=='/message' || 
// 					this.$route.path=='/analysis' ||
// 					this.$route.path=='/user') {
// 						//首次按键，提示‘再按一次退出应用’
// 						if (!first) {
// 							first = new Date().getTime();
// 							Toast('再按一次退出应用')
// 							setTimeout(function() {
// 								first = null;
// 							}, 1000);
// 						} else {
// 							if (new Date().getTime() - first < 1000) {
// 								plus.runtime.quit();
// 							}
// 						}
// 					} else {
// 						this.$router.go(-1)
// 					}
					
// 				}, false);
// 		})
// 	}
// }