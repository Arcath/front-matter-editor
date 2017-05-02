const {TextEditor} = require('atom')
const etch = require('etch')

const Fields = {
  color: require('./fields/color'),
  fileList: require('./fields/file-list')
}

class Field{
  constructor(props, children){
    this.name = props.name
    this.value = props.value
    this.parent = props.parent
    this.keyTree = props.keyTree
    this.projectConfig = props.projectConfig

    etch.initialize(this)

    if(this.setText){
      this.refs.input.setText(this.value)

      var _ = this
      this.disposable = this.refs.input.onDidStopChanging(function(){
        _.parent.updateFrontMatter(_.keyTree, _.refs.input.getText())
      })
    }
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
        ...this.fieldSelect()
      )
    )
  }

  fieldSelect(){
    if(this.projectConfig && this.projectConfig[this.name]){
      var fieldConfig = this.projectConfig[this.name]
      return [etch.dom(Fields[fieldConfig.type], {name: this.name, value: this.value, config: fieldConfig, parent: this.parent, keyTree: this.keyTree})]
    }else{
      return this.input()
    }
  }

  input(){
    switch (typeof this.value) {
      case 'string':
        this.setText = true
        return [etch.dom(TextEditor, {ref: 'input', mini: true})]
        break;
      case 'object':
        return this.objectInput()
        break;
      default:
        return etch.dom.p({}, 'Front Matter Editor does not know how to handle ' + (typeof this.value) + '.')
    }
  }

  objectInput(){
    var keys = Object.keys(this.value)
    var entries = []

    for(var key in keys){
      entries.push(
        etch.dom.div(
          {className: 'block'},
          ...this.fieldPerKey(keys[key], this.value[keys[key]])
        )
      )
    }

    return entries
  }

  fieldPerKey(objectKey, object){
    var keys = Object.keys(object)
    var entries = []

    for(var key in keys){
      entries.push(
        etch.dom(Field, {name: keys[key], value: object[keys[key]], parent: this.parent, keyTree: this.keyTree.concat([objectKey, keys[key]]), projectConfig: this.projectConfig})
      )
    }

    return entries
  }
}

module.exports = Field
