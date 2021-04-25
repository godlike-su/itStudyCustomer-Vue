
export default ({ app,redirect,params,query,store,router,$axios }) => {
    app.router.afterEach((to, from, next) => {
      
	  let path = to.path.split("/")
	  console.log(path);
	  // if(path[1] == "user" || path[1] == "message" || path[2] == "writeArt"){
	  if(path[1] == "")
	  {
		redirect('/home?typeId=5')
	  }
	  //未登录需要跳转的页面
	  if( path[1] == "message" || path[2] == "writeArt" || path[2] == "writeAnalysis" || 
	  path[2] == "information" || path[2] == "setting"){
		  $axios({
			  url:'/customer/test/isLogin',
			  method: 'post'
		  }).catch(e => {
				if(e.data.error===401) {
					redirect("/login")
				}
			
		  })
		  if(typeof localStorage.getItem('id') == 'undefined') {
			redirect("/login")
		  }
	  }
	  //未登录不需要跳转的页面
	  else if( path[1] == 'user' ){
		  $axios({
			  url:'/customer/test/isLogin',
			  method: 'post'
		  }).catch(e => {
			//清除token等信息
			// store.commit('logout')
			// Toast('未登录')
		  })
	  }
	  else if(path[1] == "login" || path[2] == "register"){
		  if(typeof localStorage!="undefined" && localStorage.getItem("token")!=null)
		  {
			redirect("/user")
		  }
	  }
	  
	  //滚动到底部
	  if(path[2] == "chat")
	  {
		document.body.scrollTop = 10000
		document.documentElement.scrollTop = 15000
	  }
	  
    })
}