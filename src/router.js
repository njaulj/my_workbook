export default (router)=>router.map({
	'/':{
		name:'index',
		component:require('./views/index')
	},
	'*':{
		name:'404',
		component:require('./views/404')
	}
})