import Vue from 'vue'
import VueResource from 'vue-resource'

import marked from 'marked';
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

Vue.use(VueResource);

export const renderHtml = ({dispatch},e)=>{
	// Vue.http({
 //        url: 'https://api.github.com/markdown',
 //        method: 'POST',
 //        data: {text: e.target.value, mode: 'gfm'}
 //    }).then(function (response) {
 //        // success callback
 //        return dispatch('MARKDOWN_SUCCESS',e.target.value,response.data)
 //    }, function (response) {
 //        // error callback
 //        console.log(response.data);
 //    });
	var _renderHtml = marked(e.target.value) 
	return dispatch('MARKDOWN_SUCCESS',e.target.value,_renderHtml)
}