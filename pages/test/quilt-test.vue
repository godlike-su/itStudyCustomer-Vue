<template>
	<div>
		<section class="container">
			<div class="quill-editor" 
				 :content="content"
				 @change="onEditorChange($event)"
				 @blur="onEditorBlur($event)"
				 @focus="onEditorFocus($event)"
				 @ready="onEditorReady($event)"
				 v-quill:myQuillEditor="editorOption">
			</div>
		</section>
	</div>
</template>

<script>
export default {
    data () {
      return {
        content: '<p>I am Example</p>',
        editorOption: {
          // some quill options
          modules: {
            toolbar: {
                  container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    ['image']
                  ],
                  handlers: {
                    'image': function () {
                      // 意思是使用插入图片的功能时候，触发文件上传控件的点击事件
                      document.getElementById('getFile').click();
                    }
                  }
			}
          }
        },
		
      }
    },
   
    methods: {
      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        console.log('editor change!', editor, html, text)
        this.content = html
      },
	  // 选择图片之后的处理
	  selectContentImg(e) {
	    let file = e.target.files;
	    if (file.length > 0) {
	      let data = new FormData();
	      for (let item of file) {
	        data.append('files', item)
	      }
	      // 可以使用post方法上传文件到服务器
	      // 然后把返回的路径拼接好插入到内容里
	      uploadFile(data).then(res => {
	        this.content += `<img src="${res.imgUrl}" alt="内容图片">`;
	      })
	    }
	  }
	  
    }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 60%;
    margin: 0 auto;
    padding: 50px 0;
    .quill-editor {
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
