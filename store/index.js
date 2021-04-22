import Vue from 'vue'
import Vuex from 'vuex'
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '../type'
// import localStorage from '@/store/localStorage'

Vue.use(Vuex)

const store = () => new Vuex.Store({
	state: {
		//自定义的共享状态
		isTabbarShow: true,
		list: [],
		//首页链接动态
		homeLink: '5',
		typeId: '5',
		type: '热榜',
		//用户登录信息
		//-----------------------------
		// id:sessionStorage.getItem('id'),
		id: "",
		userId:null,
		firstTime: null,
		//记录跳到登录页面当时的页面，登录后，就跳回这个页面
		resultUrl: "",
		//一级分类
		navTabList: '',
		//你问我答的页码
		analysisPageNumber: 1,
		//评论控件是否显示
		isShowCommond: false,
		//设置评论内容
		CommondContent: '',
		//回复问题id: 
		CommondContentId: '',
		// 主贴人id
		CommondReplyId: '',
		//聊天私信是否发送
		chat: 0,
		//未读信息数量
		unchatCount: '',
		
	},
	getters:{
		//取前3个数据
		// comingListGetter(state){
		// 	return state.comingList.filter((item,index)=>index < 3);
		// }
	},
	mutations: {//唯一修改状态的地方
		//设置tabbar隐藏与显示
		[HIDE_TABBAR_MUTATION] (state,data){
			state.isTabbarShow = data;
		},
		[SHOW_TABBAR_MUTATION] (state, data){
			state.isTabbarShow = data;
		},
		//设置首页的动态路径
		setHomeLink(state, data){
			state.homeLink = data.homeLink;
			state.typeId = data.typeId;
			state.type = data.type;
		},
		//获取用户信息
		setUser(state, data) {
			// 把用户信息存起来
			// console.log(data.id)
			// state.userId = data.user;
			// state.userName = data.userName;
			state.firstTime = new Date();
		},
		//登出
		logout(state) {
			// 登出的时候要清除token
			localStorage.removeItem("token")
			localStorage.removeItem("name")
			localStorage.removeItem("id")
			localStorage.removeItem("sex")
			localStorage.removeItem("thumb")
			state.firstTime = null;
			state.userId = null;
			state.userName = null;
		},
		//设置未登录跳转的页面路径
		setResultUrl(state, url){
			state.resultUrl = url;
			// console.log(url)
		},
		setNavTabList(state, navTabList){
			state.navTabList = navTabList;
		},
		setAnalysisPageNumber(state, analysisPageNumber) {
			state.analysisPageNumber = analysisPageNumber;
		},
		setIsShowCommond(state, isShowCommond) {
			state.isShowCommond = isShowCommond;
		},
		//设置评论内容
		setCommondContent (state, data) {
			state.CommondContent = data;
		},
		//设置评论内容id
		setCommondContentId (state, data) {
			state.CommondContentId = data;
		},
		//回复主贴人的id
		setCommondReplyId (state, data) {
			state.CommondReplyId = data
		},
		//聊天私信设置
		setChat(state, data) {
			state.chat = data
		},
		setunchatCount(state, data) {
			state.unchatCount = data
		},
		
	},
	actions: {
		//异步处理
		getComingListAction(store){
		},
	}
	
	
})

export default store