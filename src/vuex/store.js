import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	rawHtml:'',
	renderHtml:''
}


const mutations = {
	MARKDOWN_SUCCESS(state,_rawHtml,content){
		console.log(_rawHtml,content)
		state.rawHtml = _rawHtml
		state.renderHtml = content
	}
}

export default new Vuex.Store({
	state,
	mutations
})