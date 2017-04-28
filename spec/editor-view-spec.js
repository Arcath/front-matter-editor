var EditorView = require('../lib/views/editor')

describe('Editor View', function(){
  it('should open', function(){
      editorView = new EditorView({
        frontMatter: {},
        content: ''
      })
      expect(editorView).not.toBe(null)
  })

  it('should set the value of the editors', function(){
    editorView = new EditorView({
      frontMatter: {},
      content: ''
    })

    waitsForPromise(function(){
      return editorView.update({
        frontMatter: {
          test: 'foo'
        },
        content: ''
      })
    })

    runs(function(){
      expect(editorView.refs.field_0.refs.input.getText()).toBe('foo')
    })
  })

  it('should show the save and close button when a value changes', function(){
    editorView = new EditorView({
      frontMatter: {},
      content: ''
    })

    waitsForPromise(function(){
      return editorView.update({
        frontMatter: {
          test: 'foo'
        },
        content: ''
      })
    })

    runs(function(){
      expect(editorView.saveable).toBe(false)
      editorView.updateFrontMatter('test', 'bar')

      expect(editorView.newFrontMatter.test).toBe('bar')
      expect(editorView.saveable).toBe(true)
    })
  })
})
