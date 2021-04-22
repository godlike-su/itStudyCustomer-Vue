<!-- 已废弃，用作参考的操作  -->
<!-- 富文本 -->
vue-quilt-config.js

<!-- emoji表情 -->
emoji.vue

<!-- 取消Tabbar栏 -->
<!-- 引入 -->
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
<!-- 在es6里使用  -->
beforeMount() {
	//第一个参数就是mutations名字,隐藏底部
	this.$store.commit(HIDE_TABBAR_MUTATION, false);	
},
beforeDestroy() {
	// bus.$emit("maizuo", true)
	this.$store.commit(SHOW_TABBAR_MUTATION, true);	
},

<!-- 时间格式变化 -->
<!-- 下载 -->
npm install moment -save
<!-- 引用 -->
import moment from 'moment'
<!-- 使用参考，或者百度 -->
this.birthday = moment(value).format('YYYY年MM月DD日');


