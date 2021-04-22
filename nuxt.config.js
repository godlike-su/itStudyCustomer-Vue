export default {
  // publicPath: './nuxt',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'itStudy',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
	'vant/lib/index.css',
	'quill/dist/quill.snow.css',
	    'quill/dist/quill.bubble.css',
	    'quill/dist/quill.core.css',
		'~assets/css/main.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  
	{ src: '~/plugins/route', ssr: false },
	{src:'~/plugins/axios'},
	{ src: '~/plugins/Vant-ui', ssr: true },
	{ src: '~/plugins/vue-quill-editor', ssr: false },
	{ src: '~/plugins/mui', ssr: false },
	
	// { src: '~/plugins/util', ssr: true },
	
	
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
	 'nuxt-vuex-localstorage',
	 
	// '@nuxtjs/proxy'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
	proxy: true, //开启代理转发
	// prefix: '/localhost',
	// prefix: '/static',
	// prefix: ['/localhost','/user/api'],
	
	credentials: true,
  },
  
  proxy: {
	  '/static': {
		  target: 'http://localhost:3000/',
		  changeOrigin: true,
			pathRewrite: {
			  '^/static': '', //将 /api 替换掉
			}
	  },
		'/customer': {
		  // target: 'http://123.56.57.78:8081/',
		  target: 'http://127.0.0.1:8081/',
		  changeOrigin: true,
			pathRewrite: {
			  '^/customer': '', //将 /api 替换掉
			}
		},
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
	  transpile: [/^vant/],
		// publicPath: '/_nuxt/',
		// assetsPublicPath: './itStudy',
		assetsPublicPath: './',
		// vue完整版
		// extend(config, {isClient}) {
		// 	config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js'
		// }
  },
  // 这个选项允许您为应用程序中将被 Nuxt.js 转换为 HTML 文件的每个动态路由设置参数值。
	generate: {
		assetsPublicPath: './itStudy',
		// dir: 'gh_pages', // gh_pages/ instead of dist/
		// subFolders: false // HTML files are generated according to the route path
	},
  
  publicRuntimeConfig: {
      // baseURL: process.env.BASE_URL || 'https://nuxtjs.org'
   },
	  
	  
  router:{
		// base:"/itStudy" ,//此为根目录，如果有具体目录需求按实际情况写,
		base:"/" ,//此为根目录，如果有具体目录需求按实际情况写,
		// scrollBehavior (to, from, savedPosition) {
		// 	return { x: 0, y: 0 }
		// }
  }
 //  server: {
	// port: 3000,
	// host: '0.0.0.0'
 //  },
}
