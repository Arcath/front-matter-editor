const {TextEditor} = require('atom')
const etch = require('etch')

class Field{
  constructor(props, children){
    this.name = props.name
    this.value = props.value
    this.parent = props.parent

    etch.initialize(this)
    this.refs.input.setText(this.value)

    var _ = this
    this.disposable = this.refs.input.onDidStopChanging(function(){
      _.parent.updateFrontMatter(_.name, _.refs.input.getText())
    })
  }

  update(props, children){
    return etch.update(this)
  }

  render(){
    return etch.dom(
      'atom-panel',
      {className: 'padded'},
      etch.dom.div(
        {className: 'inset-panel padded'},
        this.name,
        etch.dom(TextEditor, {ref: 'input', mini: true})
      )
    )
  }
}

module.exports = Field
