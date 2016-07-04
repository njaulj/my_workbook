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
	import {renderHtml} from '../vuex/actions'
	import {getRawHtml} from '../vuex/getters'
	export default {
		vuex:{
			actions:{
				renderHtml
			},
			getters:{
				rawHtml:getRawHtml
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