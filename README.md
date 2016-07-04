## [vue+vuex+vue-router] 强撸一发暗黑风 markdown 日记应用

------
> 容我思考思考文章结构，能够更容易让新手入门，思考的过程中被小编拒了一次，囧。本文将会从项目开发角度出发，由外向内拆解，自顶而下设计

 [项目地址](https://njaulj.github.io/darkMarkdown)

 效果图
 ![图片描述][1]

#### 暗黑风是不是很炫～*Step by step,follow me~*

### 知识储备
-----
- [vue.js 官网教程](http://cn.vuejs.org/)
- [vuex 官方教程](http://vuex.vuejs.org/en/index.html)
   核心思想
   ![vuex数据流][3]
- [vue-router 官方教程](http://router.vuejs.org/zh-cn/index.html)
- [webpack 官方教程](http://webpack.github.io/)
- [node.js 官方](https://nodejs.org/en/)
- [es6 阮一峰老师所著的es6入门](http://es6.ruanyifeng.com/)

对于知识储备这类事，无需多言，尤其是node横空出世之后，前端技能栈日新月异，学海无涯！一开始看不懂不要紧，书读百遍，其义自现！作为一名“码农”， 更要加强阅读能力＋实操能力结合。

### 项目初始化
-----
1. 安装nodejs,这个不赘述了
2. 安装vue-cli，这是vue.js官方推荐的大中型项目构建工具脚手架
 ```
 npm install -g vue-cli
 ```
3. 初始化项目，选择webpack作为资源打包工具
 ```
 vue init webpack workbook(eslint，karma,e2e test等都选择n) 
 cd workbook
 npm install
 npm run dev 
 // 打开 http://localhost:8080,应该能看到页面
 ```
4. 安装相关依赖，咱们把本次能用到的依赖安装一下 
 ```
 npm install -D vue-router vuex marked 
 // -D 和 --save-dev 等效，marked是markdown 语法转换工具库
 ```
### 项目结构
-----
ok，项目初始化工作结束,咱们来思考用vue＋vuex＋vue-router来构建页面吧。
![图片描述][2]
Oh Yeah!组件化设计，见上图！
由于咱们后面几乎所有的工作都在src文件夹下完成，所以我们先来看看我们未来的结构吧
```
├── App.vue //初始化工作，以及挂载路由的router-view组件
├── assets //静态资源文件
│   └── darkness.css //暗黑风stylesheet
├── components  //组件放在这儿
│   ├── rawEditor.vue //markdown 文本编辑器组件
│   └── renderEditor.vue //渲染后的展示组件
├── main.js //入口程序
├── router.js //SPA 路由配置文件
├── views //页面
│   ├── 404.vue // 除'/'以外的非法路由，一律指向404
│   └── index.vue // '/'路由指向页面，内含 rawEditor.vue & renderEditor.vue
└── vuex
    ├── actions.js //vuex理念中 actions -> dispatch
    ├── getters.js //vuex 理念中 Getters Can Return Derived State，简言之，组建里面的状态都通过getters来获取
    └── store.js //vuex 理念中 initial state,mutations，相应dispatch－》mutations－》从而完成对state的更新
```
### AhhA，Talk is cheap ，show me the code！
-----
#### 1.在src 根目录下创建 router.js
```javascript
//router.js
export default (router)=>router.map({
    '/':{
        name:'index',//应用首页
        component:require('./views/index') //加载index页面
    },
    '*':{//除'/'以外的所有路由，均跳转到404页面
        name:'404',
        component:require('./views/404')// 加载404页面
    }
})
```
#### 2.修改main.js 入口文件，我们要加上vue-router
```javascript
//main.js
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import configRouter from './router'
require('./assets/darkness.css') 

Vue.use(VueRouter)
const router = new VueRouter()
configRouter(router)//注入路由规则

router.start(Vue.extend(App),'#app')//#app是what 鬼，哪里来的？
/*
细心或者有经验的同学可能已经发现，在整个项目的根目录有个index.html 文件，这个其实才是我们整个应用的第一入口，SPA（Single Page App）完美的解释,我们来修改一下它吧。
*/

//index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>workbook</title>
    <style type="text/css">
    	html,#app {
    		height:100%;
    	}
    	body{
    		width: 100%;
    		height: 100%;
    		margin:0;
    		padding:0;
    	}

    </style>
  </head>
  <body>
  	<div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```
#### 3. 修改App.vue 
```javascript
//app.vue 瞧好了，vue 组件大法来了
<template>
    <div id="main">
        <router-view></router-view> //路由组件
    </div>   
</template>
<script>
import store from './vuex/store' //后面讲vuex 配置会提到
export default {
    store
}
</script>
<style>
 #main {
    width:100%;
    height:100%;
 }
</style>
```

#### 4.开始写我们的两个页面吧
在src目录下，新建views文件夹，存放我们的页面，index.vue & 404.vue
```
//index.vue
<template>//对照页面布局草稿图，分别把两个组件加载进来
	<raw-editor></raw-editor> 
	<render-editor></render-editor>
</template>

<script>
	import rawEditor from '../components/rawEditor'
	import renderEditor from '../components/renderEditor'

	export default {
		components:{
			rawEditor,
			renderEditor
		}
	}
</script>


//404.vue  简单到令人发指，不过我只是为了实现router功能，请开恩。

<template>
	<h1>404</h1>
</template>

<script>
	export default {
		
	}
</script>
```

#### 5. 开始写具体组件
##### 在写组件之前，我们先静静地思考一下
----
 - 代码都写了快一大半了，怎么还不见饱守吹捧的vuex登场。OK！如你所愿，不过在vuex登场之前，咱们可否拿出纸和笔 或者 头脑风暴一下，想想咱们的应用的state应该是什么！！！

   - **BingGo！** `rawHtml` 和`renderHtml`,简简单单的两个state，就能够满足我们的应用需求。

 - `rawHtml` 和`renderHtml`之间又有什么关系呢?*
    
    - `rawHtml`经过转换之后给`renderHtml`赋值

> Jack：我觉得是时候引入 Vuex 了
在src 文件夹下 新建vuex文件夹，创建store.js ,getters.js,actions.js

```javascript
//store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	rawHtml:'',
	renderHtml:''
}

//这块是重点，能够改变state的只能够在 mutations完成！！！
const mutations = {
	MARKDOWN_SUCCESS(state,_rawHtml,content){
		console.log(_rawHtml,content)
		state.rawHtml = _rawHtml
		state.renderHtml = content
	}
}

//最后别忘了，这块要export 出去，还记得我们在编写app.vue 的时候 引入的store，就是这个，SPA只需要在最顶层的app.vue 引用一次即可。
export default new Vuex.Store({
	state,
	mutations
})

//getters.js 简单到不像，getters存在的意义就是 纯粹！！
export const getRawHtml = (state)=>state.rawHtml;
export const getRenderHtml = (state)=>state.renderHtml;

//actions.js 还记得vuex核心思想的那张数据流图，还有上面我描述src的完成状态的关于 vuex里面各文件的意义所在，actions.js 说白了，就是处理玩rawHtml之后，dispatch 结果到 mutations，剩下更新state的工作交给mutations

import Vue from 'vue'
import marked from 'marked';
//marked配置文件
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


export const renderHtml = ({dispatch},e)=>{
	var _renderHtml = marked(e.target.value) 
	return dispatch('MARKDOWN_SUCCESS',e.target.value,_renderHtml)
}
```
------
#### 继续我们的组件工作
这个项目很简单，两个组件，一个是rawEditor 还有一个是 renderEditor，至于为什么要起这个名字，who knows！在components 文件夹下创建rawEditor.vue 和renderEditor.vue文件。
> 往下走，可能有点复杂，千万别退缩，可能是我表述不够清楚，但是move on，你就能收获整片天空。
```javascript
//rawEditor.vue
<template>
	<div id="raw-editor">
		<textarea
		      :value="rawHtml"
		      @input="renderHtml"
		      class="form-control">
		</textarea>
	</div>
</template>

<script>
    //设计思想就是rawHtml内容已改变，就会触发renderHtml方法
	import {renderHtml} from '../vuex/actions' 
	import {getRawHtml} from '../vuex/getters'
	export default {
		vuex:{//看到没，里面有个 vuex 对象，actions和getters两者相得益彰
			actions:{
				renderHtml //内容改变触发
			},
			getters:{
				rawHtml:getRawHtml//获得rawHtml 
			}
		},
	}
</script>

<style>
	#raw-editor {
		float:left;
		width:45%;
		height:100%;
	}

	textarea{
		width: 100%;
		height:100%;
		border: 0;
		border-radius: 0;
	}
</style>

//renderEditor.vue
<template>
	<div id="render-editor">
		{{{renderHtml}}}
	</div>
</template>

<script>
	import {getRenderHtml} from '../vuex/getters'
	export default {
		vuex:{ //看到没，里面有个 vuex 对象
			getters:{
				renderHtml:getRenderHtml
			}
		}
	}
</script>
<style>
	#render-editor {
		float:right;
		width:50%;
		height:100%;
		overflow: scroll;
	}
</style>
```

### 代码写到这里，离成功不远了，是不是有点小期待呢。
----
```
//打开命令行or terminal 工具，运行一下吧
npm run dev 

```
等待一会编译完成后，打开 http://localhost:8080,查看效果，怎么样，是不是很酷！

好吧！大家发现了，我们的样式不够酷炫，也不是 暗黑风。退货、老板给差评！
在src/assets文件夹中新建 darkness.css
``` css
pre,
code {
  font-family: Menlo, Monaco, "Courier New", monospace;
}

pre {
  padding: .5rem;
  line-height: 1.25;
  overflow-x: scroll;
}

@media print {
  *,
  *:before,
  *:after {
    background: transparent !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  a,
  a:visited {
    text-decoration: underline;
  }

  a[href]:after {
    content: " (" attr(href) ")";
  }

  abbr[title]:after {
    content: " (" attr(title) ")";
  }

  a[href^="#"]:after,
  a[href^="javascript:"]:after {
    content: "";
  }

  pre,
  blockquote {
    border: 1px solid #999;
    page-break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  tr,
  img {
    page-break-inside: avoid;
  }

  img {
    max-width: 100% !important;
  }

  p,
  h2,
  h3 {
    orphans: 3;
    widows: 3;
  }

  h2,
  h3 {
    page-break-after: avoid;
  }
}

a,
a:visited {
  color: #01ff70;
}

a:hover,
a:focus,
a:active {
  color: #2ecc40;
}

.retro-no-decoration {
  text-decoration: none;
}

html {
  font-size: 12px;
}

@media screen and (min-width: 32rem) and (max-width: 48rem) {
  html {
    font-size: 15px;
  }
}

@media screen and (min-width: 48rem) {
  html {
    font-size: 16px;
  }
}

body {
  line-height: 1.85;
}

p,
.retro-p {
  font-size: 1rem;
  margin-bottom: 1.3rem;
}

h1,
.retro-h1,
h2,
.retro-h2,
h3,
.retro-h3,
h4,
.retro-h4 {
  margin: 1.414rem 0 .5rem;
  font-weight: inherit;
  line-height: 1.42;
}

h1,
.retro-h1 {
  margin-top: 0;
  font-size: 3.998rem;
}

h2,
.retro-h2 {
  font-size: 2.827rem;
}

h3,
.retro-h3 {
  font-size: 1.999rem;
}

h4,
.retro-h4 {
  font-size: 1.414rem;
}

h5,
.retro-h5 {
  font-size: 1.121rem;
}

h6,
.retro-h6 {
  font-size: .88rem;
}

small,
.retro-small {
  font-size: .707em;
}

/* https://github.com/mrmrs/fluidity */

img,
canvas,
iframe,
video,
svg,
select,
textarea {
  max-width: 100%;
}

html,
body {
  background-color: #222;
  min-height: 100%;
}

html {
  font-size: 18px;
}

body {
  width: 100%;
  color: #fafafa;
  font-family: "Courier New";
  line-height: 1.45;
  padding: .25rem;
}

pre {
  background-color: #333;
}

blockquote {
  border-left: 3px solid #01ff70;
  padding-left: 1rem;
}
```
不行，代码部分然而并没有高亮，老板，我要退货！
# 服
```
//在 index.html的head 里面加上
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/styles/default.min.css">
```
> 告一段落，这样咱们的暗黑风的在线markdown日记应用就暂告一段落了，文中表述如果有不清不楚的，欢迎留言。同时我也是一命 new vuer，希望老鸟们能够指点！

# 完
  [1]: /img/bVyrCS
  [2]: /img/bVyrSw
  [3]: http://vuex.vuejs.org/en/vuex.png
