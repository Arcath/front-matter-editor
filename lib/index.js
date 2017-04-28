var matter = require('gray-matter')

var EditorView = require('./views/editor')

module.exports = {
  activate: function(){
    var _ = this

    atom.commands.add('atom-workspace', 'front-matter-editor:edit-front-matter', function(){ _.editFrontMatter() })

    this.editorView = new EditorView({
      frontMatter: {},
      fileContent: '',
      frontMatterEditor: this
    })
  },

  editFrontMatter: function(){
    this.editorView.attach()

    this.parseFrontMatter()
  },

  parseFrontMatter: function(){
    activeEditor = atom.workspace.getActiveTextEditor()
    contents = activeEditor.getText()

    frontMatter = matter(contents)
    this.editorView.update({frontMatter: frontMatter.data, fileContent: frontMatter.content, parsed: true})
  },

  savefrontMatter: function(frontMatter, contents){
    activeEditor = atom.workspace.getActiveTextEditor()

    activeEditor.setText(matter.stringify(contents, frontMatter))
  }
}
