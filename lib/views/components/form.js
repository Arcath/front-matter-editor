const etch = require('etch')

const Field = require('./field')

class Form{
  constructor(props, children){
    this.parent = props.parent
    this.object = props.object
    this.keyTree = props.keyTree
    this.projectConfig = props.projectConfig

    etch.initialize(this)

  }

  update(props, children){
    return etch.update(this)
  }

  render(){
    var fieldNames = Object.keys(this.object)
    var fields = []

    for(var field in fieldNames){
      fields.push(
        etch.dom(
          Field,
          {
            name: fieldNames[field],
            value: this.object[fieldNames[field]],
            parent: this.parent,
            keyTree: this.keyTree.concat(fieldNames[field]),
            projectConfig: this.projectConfig
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

module.exports = Form
