//添加历史记录
// 过滤一个结果的空记录添加，过滤空搜索。需要传入参数为：localStore中需要保存的名称，保存的值，保存的长度
//需要使用的data: {
// 	searchHistoryList: [],
// }
export default  {
	
	articleAppendKeywords: function(name, value, length) {
	/**
	 * 1.已经有的关键词不再添加
	 * 2.添加到数组的首位，若超出10个则删除最后一个
	 * 3.添加到缓存
	 */
	let appendFlag = true
	if (this.searchHistoryList !== null && this.searchHistoryList !== undefined && this.searchHistoryList.length > 0) {
	 //如果历史记录有了，则把该记录调到最前面
	  for(let i=0; i<this.searchHistoryList.length; i++){
		  let currentValue = this.searchHistoryList[i]
		  if (currentValue == value) {
			appendFlag = false
			if(i != 0) {
				this.searchHistoryList.splice(i, 1);
				this.searchHistoryList.unshift(value)
				localStorage.setItem(name, JSON.stringify(this.searchHistoryList))	
			}
			return
		  }
	  }
	  
	  // 判断-添加
	  if (appendFlag === true) {
		// 长度判断
		if (this.searchHistoryList.length >= length) {
		  this.searchHistoryList.unshift(value)
		  this.searchHistoryList.pop()
		} else {
		  this.searchHistoryList.unshift(value)
		}
		localStorage.setItem(name, JSON.stringify(this.searchHistoryList))
	  }
	} else {
	  this.searchHistoryList = []
	  this.searchHistoryList.push(value)
	  localStorage.setItem(name, JSON.stringify(this.searchHistoryList))
	}
  },
}