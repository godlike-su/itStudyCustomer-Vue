export const HIDE_TABBAR_MUTATION = "hide"
export const SHOW_TABBAR_MUTATION = "show"
//本网站地址
export const itStudyUrl = 'http://119.29.161.208/'
// export const itStudyUrl = 'http://127.0.0.1:3000/'
//后台通讯地址
export const itStudyServerUrlSimple = '127.0.0.1:8081'
//问答分享网址
// export const itStudyAnalysisUrl = 'http://127.0.0.1:3000/analysis/analysisId/analysisReply'
export const itStudyAnalysisUrl = itStudyUrl + 'analysis/analysisId/analysisReply'
//知识分享网址
export const itStudyArticleUrl = itStudyUrl + 'article/articleId'
//聊天室地址
export const itStudyMessageWebStock = 'ws://' + itStudyServerUrlSimple + '/message/webSocket/'
//图片相对地址 头像
export const photoUrl = '/customer/photo'
//验证码地址
export const verifyImage = '/customer/getImage?verifyToken='
//问题图片地址前缀
export const analysisPrefix = '/customer/photo/analysis/'