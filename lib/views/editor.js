const etch = require('etch')
const lodash = require('lodash')

const Form = require('./components/form')

class EditorView{
  constructor(props, children){
    this.panel = false
    this.frontMatterEditor = props.frontMatterEditor
    this.frontMatter = props.frontMatter
    this.newFrontMatter = lodash.cloneDeep(props.frontMatter)
    this.fileContent = props.fileContent
    this.parsed = false
    this.saveable = false

    etch.initialize(this)
  }

  update(props, children){
    if(props){
      this.frontMatter = props.frontMatter
      this.newFrontMatter = lodash.cloneDeep(props.frontMatter)
      this.fileContent = props.fileContent
      this.parsed = !(lodash.isEqual(this.frontMatter, {}))
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
      buttons.push(etch.dom.button({className: 'btn', onClick: this.saveFrontMatter, id: 'fme-save'}, 'Save'))
    }

    buttons.push(etch.dom.button({className: 'btn', onClick: this.detach, id: 'fme-close'}, 'Close'))

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
      return etch.dom(Form, {parent: this, object: this.frontMatter, keyTree: []})
    }
  }

  attach(){
    if(!this.panel){
      this.panel = atom.workspace.addRightPanel({item: this})
    }
  }

  detach(event){
    if(event){
      if(event.target.id != 'fme-close'){
        return
      }
    }
    if(this.panel){
      this.panel.destroy()
      this.panel = false
      this.parsed = false
      this.update({
        frontMatter: {},
        fileContent: '',
        parsed: false
      })
    }
  }

  updateFrontMatter(keyTree, value){
    var i
    var check = this.frontMatter
    var update = this.newFrontMatter
    for(i = 0; i < keyTree.length - 1; i++){
      update = update[keyTree[i]]
      check = check[keyTree[i]]
    }

    update[keyTree[i]] = value;

    this.saveable = (check[keyTree[i]] != value)

    this.update()
  }

  saveFrontMatter(){
    this.frontMatterEditor.savefrontMatter(this.newFrontMatter, this.fileContent)
    this.frontMatter = lodash.cloneDeep(this.newFrontMatter)
  }
}

module.exports = EditorView
