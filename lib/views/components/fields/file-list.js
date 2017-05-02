const etch = require('etch')
const fs = require('fs')
const path = require('path')

class FileList{
  constructor(props, children){
    this.value = props.value
    this.config = props.config
    this.keyTree = props.keyTree
    this.parent = props.parent

    etch.initialize(this)
  }

  update(props, children){
    return etch.update(this)
  }

  render(){
    return etch.dom.div(
      {className: 'block'},
      etch.dom.div(
        {className: 'select-list'},
        etch.dom.ol(
          {className: 'list-group'},
          ...this.listEntries()
        )
      )
    )
  }

  listEntries(){
    var entries = []

    if(!this.files){
      entries.push(etch.dom.li({}, 'Loading...'))
      this.loadFiles()
    }else{
      for(var file of this.files){
        var fileDetails = path.parse(file)
        var className = ''
        if(fileDetails.name == this.value){
          className = 'selected'
        }
        entries.push(etch.dom.li({className: className, onClick: this.handleClick, "data-item": fileDetails.name}, fileDetails.name))
      }
    }

    return entries
  }

  loadFiles(){
    var dir = path.join(atom.project.getPaths()[0], this.config.dir)
    var _ = this
    fs.readdir(dir, function(err, items){
      if(!err){
        _.files = items
        _.update()
      }
    })
  }

  handleClick(event){
    var newValue = event.target["data-item"]

    this.parent.updateFrontMatter(this.keyTree, newValue)
    this.value = newValue
    this.update()
  }
}

module.exports = FileList
