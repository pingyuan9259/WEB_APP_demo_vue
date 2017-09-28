
/* 写作写文章编辑框的数据处理方法库
 * 作者：平原
 * 创建：2017-8-14 */

// import Store from '../../../vuex/store'
import Quill from 'quill' // 富文本库
import 'quill/dist/quill.snow.css' // quill主题样式

export default {
  // 初始化Quill（富文本库）
  initQuill (quillHandlers, editorChange) {
    // 富文本Quill配置项
    const toolbarOptions = {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': ['', 'center', 'right'] }],
        ['link'],
        ['image'],
        // ['video'],
        ['clean']
      ],

      handlers: {
        // 触发图片上传
        // quill自带的图片上传无法提供异步上传到七牛的接口，所以在这里重新定义
        // 此处相当于屏蔽了quill的image的一切方法而只走image方法，video同理
        image () {
          quillHandlers('image')
        }
        // 使用quill的video作为上传音频的入口
        // video () {
        //   // self.htmlEditor.clipboard.dangerouslyPasteHTML(0, '<audio controls="controls" src="https://o3b126ie1.qnssl.com/voice/39426c7b-ed12-4843-a518-cf2515e78b17"></audio>')
        //   // quillHandlers('audio')
        // }
      }
    }

    // 富文本Quill实例
    const quill = new Quill('#html_editor', {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: '请输入正文',
      theme: 'snow'
    })

    // 监听编辑框变化
    quill.on('editor-change', editorChange)

    return quill
  },

  // 注册页面滚动事件
  scrollEvent (enable, callback) {
    if (enable) {
      window.addEventListener('scroll', callback, false)
    } else {
      window.removeEventListener('scroll', callback)
    }
  }
}
