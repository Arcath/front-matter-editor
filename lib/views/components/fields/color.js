const {TextEditor} = require('atom')
const color = require('color')
const etch = require('etch')

class Color{
  constructor(props, children){
    this.value = props.value
    this.config = props.config
    this.keyTree = props.keyTree
    this.parent = props.parent
    this.disposables = []

    etch.initialize(this)

    this.color = color(this.value)

    this.refs.red.setText('' + this.color.red())
    this.refs.green.setText('' + this.color.green())
    this.refs.blue.setText('' + this.color.blue())

    var _ = this
    this.disposables.push(this.refs.red.onDidStopChanging(function(){
      _.color = _.color.red(_.refs.red.getText())
      _.value = _.color.hex()
      _.parent.updateFrontMatter(_.keyTree, _.value)
      _.update()
    }))

    this.disposables.push(this.refs.green.onDidStopChanging(function(){
      _.color = _.color.green(_.refs.green.getText())
      _.value = _.color.hex()
      _.parent.updateFrontMatter(_.keyTree, _.value)
      _.update()
    }))

    this.disposables.push(this.refs.blue.onDidStopChanging(function(){
      _.color = _.color.blue(_.refs.blue.getText())
      _.value = _.color.hex()
      _.parent.updateFrontMatter(_.keyTree, _.value)
      _.update()
    }))
  }

  update(props, children){
    this.color = color(this.value)

    if('' + this.color.red() != this.refs.red.getText()){
      this.refs.red.setText('' + this.color.red())
    }
    if('' + this.color.green() != this.refs.green.getText()){
      this.refs.green.setText('' + this.color.green())
    }
    if('' + this.color.blue() != this.refs.blue.getText()){
      this.refs.blue.setText('' + this.color.blue())
    }

    return etch.update(this)
  }

  render(){
    return etch.dom.div(
      {className: 'block'},
      etch.dom.div(
        {className: 'color-field'},
        etch.dom.div({className: 'preview', style: {backgroundColor: this.value}}),
        etch.dom.div(
          {className: 'block'},
          'Red',
          etch.dom(TextEditor, {ref: 'red', mini: true})
        ),
        etch.dom.div(
          {className: 'block'},
          'Green',
          etch.dom(TextEditor, {ref: 'green', mini: true})
        ),
        etch.dom.div(
          {className: 'block'},
          'Blue',
          etch.dom(TextEditor, {ref: 'blue', mini: true})
        )
      )
    )
  }
}

module.exports = Color
