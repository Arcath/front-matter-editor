var {Emitter} = require('atom')
var fs = require('fs')
var matter = require('gray-matter')
var path = require('path')

var EditorView = require('./views/editor')

module.exports = {
  activate: function(){
    var _ = this

    atom.commands.add('atom-workspace', 'front-matter-editor:edit-front-matter', function(){ _.editFrontMatter() })

    this.emitter = new Emitter
    this.projectConfig = {}
    this.gotProjectConfig = false
    this.gettingProjectConfig = false

    this.editorView = new EditorView({
      frontMatter: {},
      fileContent: '',
      frontMatterEditor: this
    })

    this.getProjectConfig()
  },

  editFrontMatter: function(){
    this.editorView.attach()

    if(this.gotProjectConfig){
      this.parseFrontMatter()
    }else{
      var _ = this
      this.waitingDisposable = this.emitter.on('projectConfig', function(){
        _.parseFrontMatter()
        _.waitingDisposable.dispose()
      })

      this.getProjectConfig()
    }
  },

  getProjectConfig: function(){
    if(!this.gettingProjectConfig){
      this.gettingProjectConfig = true
      var _ = this
      fs.open(
        path.join(atom.project.getPaths()[0], 'front-matter.json'),
        'r',
        function(err,fd){ _.handleFileRead(err, fd) }
      )
    }
  },

  handleFileRead: function(err, fd){
    if(!err){
      this.projectConfig = JSON.parse(fs.readFileSync(fd))
    }

    this.gettingProjectConfig = false
    this.gotProjectConfig = true
    this.emitter.emit('projectConfig')
  },

  parseFrontMatter: function(){
    activeEditor = atom.workspace.getActiveTextEditor()
    if(activeEditor){
      contents = activeEditor.getText()

      frontMatter = matter(contents)
      this.editorView.update({frontMatter: frontMatter.data, fileContent: frontMatter.content, parsed: true, projectConfig: this.projectConfig})
    }
  },

  savefrontMatter: function(frontMatter, contents){
    activeEditor = atom.workspace.getActiveTextEditor()

    activeEditor.setText(matter.stringify(contents, frontMatter))
  }
}
