<template>
	<div class="container">
		<van-nav-bar
		  title="我的信息"
		  left-text="返回"
		  left-arrow
		  @click-left="onClickLeft"
		/>
		<div class="row">
			<van-cell title="头像" is-link arrow-direction @click="tumpUpload" >
				<template #right-icon>
					<!-- 68px -->
					<van-image round alt="头像" :src="thumb" class="headPort"  fit="cover"/>
				</template>
			</van-cell>
			<!-- 头像上传控件 -->
			<van-uploader id="photoUpload" v-show="false"
			:after-read="afterRead" 
			:max-size="3000 * 1024"
			 @oversize="onOversize"
			>
			</van-uploader>
			
			
			<van-cell title="昵称" is-link arrow-direction :value=" name"  @click="setShowDialog('name', '昵称', true)" />
			<van-cell title="性别" is-link arrow-direction :value=" sex ? '女' : '男'"  @click="setShowSexPop(true)"/>
			<van-cell title="粉丝数" arrow-direction :value="interestCount" />
			<van-cell title="生日" is-link arrow-direction :value=" birthday" @click="setShowBirthdayPop(true)" />
			<van-cell title="个人介绍" is-link arrow-direction :value=" introduction" @click="setShowDialog('introduction', '个人介绍', true)"/>
		</div>
		
		<div class="row">
			<van-cell title="学校" is-link arrow-direction :value=" school"  @click="setShowDialog('school', '学校', true)"/>
			<!-- <van-cell title="学号" is-link arrow-direction :value=" studentID"  @click="setShowDialog('studentID', '学号', true)"/> -->
			<van-cell title="学号" arrow-direction :value=" studentID"/>
			<van-cell title="职业" is-link arrow-direction :value=" profession" @click="setShowDialog('profession', '职业', true)"/>
		</div>
		
		<div class="row">
			<van-cell title="手机号" is-link arrow-direction :value=" phone" />
			<van-cell title="邮箱" is-link arrow-direction :value=" emaill" />
			<van-cell title="等级"  :value="user.level" />
			<van-cell title="创建时间"  :value="user.timeCreate" />
		</div>
		
		<!-- 性别设置 -->
		<van-popup v-model="showSex" v-if="showSex" position="bottom" :style="{ height: '30%' }" style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
			<p @click="setUser('sex', 0)">男</p>
			<p @click="setUser('sex', 1)">女</p>
			<!-- <p @click="setUser('sex', 2)">保密</p> -->
			<p style="color: #7F828B;" @click="setShowSexPop(false)">取消</p>
		</van-popup>
		
		<!-- 生日设置 -->
		<van-popup v-model="showBirthday" :style="{ width: '80%' }" >
			<van-datetime-picker
			  v-model="currentDate"
			  type="date"
			  title="生日设置"
			  :min-date="minDate"
			  :max-date="maxDate"
			  @confirm="setUser('birthday', currentDate)"
			  @cancel="setShowBirthdayPop(false)"
			/>
		</van-popup>
		
		<!-- 昵称设置 -->
		<!-- <van-popup v-model="showBirthday" :style="{ width: '80%' }" >
			
		</van-popup> -->
		<van-dialog v-model="dialogShow" :title="title" show-cancel-button @confirm="setUser(dialogType, dialogValue)">
		  <div>
			<van-field
			      v-model="dialogValue"
			      :name="title"
			      :label="title"
			      :placeholder="title"
			/>
		  </div>
		</van-dialog>
	</div>
</template>

<script>
import {HIDE_TABBAR_MUTATION,SHOW_TABBAR_MUTATION} from '@/type';
import { Toast, Dialog } from 'vant';
import axios from 'axios'
import moment from 'moment'
export default {
	data() {
		return {
			user: [],
			name: '',
			sex: '',
			birthday: '',
			introduction: '',
			school: '',
			studentID: '',
			profession: '',
			phone: '',
			emaill: '',
			thumb: '',
			// 照片路径前缀
			prefix: '/customer/photo',
			
			showSex: false,
			showBirthday: false,
			dialogShow: false,
			title: '',
			dialogType: '',
			dialogValue: '',
			minDate: new Date(1950, 0, 1),
			maxDate: new Date(),
			currentDate: new Date(),
			interestCount: 0, //粉丝数
		}
	},
	methods: {
		onClickLeft() {
		  this.$router.go(-1)
		},
		setShowSexPop(value){
			this.showSex = value
		},
		setShowBirthdayPop(value){
			this.showBirthday = value;
		},
		setShowDialog(dialogType, title, value){
			this.dialogType = dialogType;
			this.title = title;
			this.dialogShow = value;
			this.dialogValue = this.user.dialogType;
		},
		//头像文件太大提示
		onOversize(file) {
		  // console.log(file);
		  Toast('文件大小不能超过 2m');
		},
		//点击头像上传按钮
		tumpUpload() {
			if (process.client) {
			   document.getElementById("photoUpload").click()
			}
		},
		//头像文件上传
		afterRead(file) {
		  // 此时可以自行将文件上传至服务器
		  // console.log(file.file);
		  let req = {};
		  req.content = file.content;
		  // req.file = file.file;
		  req.name = file.file.name;
		  req.size = file.file.size;
		  req.type = file.file.type;
		  req.lastModified = file.file.lastModified;
		  
		  let user = {}
		  user.name = localStorage.getItem("name")
		  user.id = localStorage.getItem("id")
		  user.thumb = this.thumb.substring(this.prefix.length)
		  
		  req.user = user;
		 
		  this.$axios({
			  url: "/customer/user/profile/setPhoto.do",
			  method: 'post',
			  data: req,
		  }).then(res => {
			if(res.data.error==-1){
				Toast.fail(res.data.reason);
				return;
			}
			localStorage.setItem("thumb", this.prefix + res.data.data)
			this.thumb = this.prefix + res.data.data
			 
		  }).catch(e => {
			  Toast.fail('上传头像失败');
		  })
		},
		//信息设置
		setUser(type, value){
			// console.log("类别：" + type + " 数据：" + value)
			let req = {};
			//修改凭证: id
			req.id = localStorage.getItem("id")
			//修改类型
			req.type = type
			if(type == "name" || type == "school" || type == "introduction" || type == "studentID" || type == "profession" || type == "phone"
			|| type == "emaill" ){
				if(typeof value=="undefined" || value.trim().length==0){
					Toast.fail('请输入' + this.title)
					return
				}
			}
			req.value = value;
			
			this.$axios({
				url: '/customer/user/setInformation.do',
				method: 'post',
				data: req,
			}).then(res => {
				if(type == "name"){
					this.name = value
					localStorage.setItem('name', value)
				}
				else if(type == "sex"){
					this.sex = value
					localStorage.setItem('sex', value)
				}
				else if(type == "birthday"){
					this.birthday = moment(value).format('YYYY年MM月DD日');
				}
				else if(type == "introduction"){
					this.introduction = value
				}
				else if(type == "school"){
					this.school = value
				}
				// else if(type == "schoolID"){
				// 	this.schoolID = value
				// }
				else if(type == "profession"){
					this.profession = value
				}
				else if(type == "phone"){
					this.phone = value
				}
				else if(type == "email"){
					this.emaill = value
				}
				Toast("修改成功")
			})
			.catch(e => {
				Toast.fail(e.data.reason)
			})
			this.showSex = false;
			this.showBirthday = false;
			
		},
	},
	
	mounted() {
		this.$store.commit(HIDE_TABBAR_MUTATION, false);	
		let req = {}
		req.id = localStorage.getItem("id")
		this.$axios({
			url:"/customer/user/showInformation.do",
			method: 'post',
			data: req
		}).then(res => {
			// console.log(res.data.data)
			this.user = res.data.data.user
			this.name = this.user.name;
			this.sex = this.user.sex;
			this.birthday = moment(this.user.birthday).format('YYYY年MM月DD日');
			this.introduction = this.user.introduction;
			this.school = this.user.school;
			this.studentID = this.user.studentID;
			this.profession = this.user.profession;
			this.phone = this.user.phone;
			this.emaill = this.user.emaill;
			
			this.thumb = this.prefix + this.user.thumb;
			this.user.timeCreate = moment(this.user.timeCreate).format('YYYY年MM月DD日');
			//粉丝数
			this.interestCount = res.data.data.interestCount
			//时间转换
		}).catch(e => {
			Toast.fail(e.data.reason)
		})
		
	},
	
	beforeMount() {
		//第一个参数就是mutations名字,隐藏底部
		// this.$store.commit(HIDE_TABBAR_MUTATION, false);	
	},
	beforeDestroy() {
		// bus.$emit("maizuo", true)
		// this.$store.commit(SHOW_TABBAR_MUTATION, true);	
	},
}
</script>

<style lang="scss" scoped>
.container{
	background-color: #fff9f7;
}
.row{
	padding-bottom: 5px;
}
.headPort{
	width: 4.25rem;
	height: 4.25rem;
}
</style>
