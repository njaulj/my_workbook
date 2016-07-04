<template>
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