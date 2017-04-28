const path = require('path')

const frontMatterEditor = require('../lib/index')

describe('Front Matter Editor', function(){
  it('should activate', function(){
    expect(frontMatterEditor.editorView).toBe(undefined)

    frontMatterEditor.activate()

    expect(frontMatterEditor.editorView).not.toBe(null)
  })

  it('should parse a front matter', function(){
    atom.project.setPaths([path.join(__dirname, 'samples')])

    waitsForPromise(function(){
      return atom.workspace.open('test.md')
    })

    runs(function(){
      frontMatterEditor.editFrontMatter()

      expect(frontMatterEditor.editorView.frontMatter.layout).toBe('something')
    })
  })

  it('should write updates to the editor', function(){
    atom.project.setPaths([path.join(__dirname, 'samples')])

    waitsForPromise(function(){
      return atom.workspace.open('test.md')
    })

    runs(function(){
      frontMatterEditor.editFrontMatter()

      expect(frontMatterEditor.editorView.frontMatter.layout).toBe('something')

      frontMatterEditor.editorView.newFrontMatter.layout = 'another'
      frontMatterEditor.editorView.save()

      activeEditor = atom.workspace.getActiveTextEditor()
      contents = activeEditor.getText()

      expect(contents).toMatch(/layout: another/)
    })
  })
})
