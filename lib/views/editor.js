const etch = require('etch')

const Field = require('./components/field.js')

class EditorView{
  constructor(props, children){
    this.panel = false
    this.frontMatterEditor = props.frontMatterEditor
    this.frontMatter = props.frontMatter
    this.newFrontMatter = Object.create(props.frontMatter)
    this.fileContent = props.fileContent
    this.parsed = false
    this.saveable = false

    etch.initialize(this)
  }

  update(props, children){
    if(props){
      this.frontMatter = props.frontMatter
      this.newFrontMatter = Object.create(props.frontMatter)
      this.fileContent = props.fileContent
      this.parsed = true
    }

    return etch.update(this)
  }

  destroy(){
    return etch.destroy(this)
  }

  render(){
    return etch.dom.div(
      {id: 'front-matter-editor'},
      etch.dom(
        'atom-panel',
        {className: 'padded'},
        etch.dom.div(
          {className: 'block'},
          etch.dom.h1({}, 'Front Matter Editor'),
          etch.dom.div(
            {className: 'btn-group'},
            ...this.buttons()
          )
        ),
        this.contents()
      )
    )
  }

  buttons(){
    var buttons = []

    if(this.saveable){
      buttons.push(etch.dom.button({className: 'btn', onClick: this.save, ref: 'saveButton'}, 'Save'))
    }

    buttons.push(etch.dom.button({className: 'btn', onClick: this.detach}, 'Close'))

    return buttons
  }

  contents(){
    if(!this.parsed){
      return etch.dom.div(
        {className: 'block'},
        etch.dom.progress({className: 'inline-block'}),
        etch.dom.span({className: 'inline-block'}, 'Loading Front Matter')
      )
    }else{
      var fieldNames = Object.keys(this.frontMatter)
      var fields = []

      for(var field in fieldNames){
        fields.push(
          etch.dom(
            Field,
            {
              name: fieldNames[field],
              value: this.frontMatter[fieldNames[field]],
              ref: 'field_' + field,
              parent: this
            }
          )
        )
      }

      return etch.dom.div(
        {className: 'block'},
        ...fields
      )
    }
  }

  attach(){
    if(!this.panel){
      this.panel = atom.workspace.addRightPanel({item: this})
    }
  }

  detach(){
    if(this.panel){
      this.panel.destroy()
      this.panel = false
      this.parsed = false
      this.update({
        frontMatter: {},
        fileContent: ''
      })
    }
  }

  updateFrontMatter(field, value){
    this.newFrontMatter[field] = value

    this.saveable = (this.frontMatter[field] != value)

    this.update()
  }

  save(){
    this.frontMatterEditor.save(this.newFrontMatter, this.fileContent)
  }
}

module.exports = EditorView
