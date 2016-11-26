'use babel'
import Snippets from './Snippets'
import Linter from './Linter'

export default {

  orionsoftView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.completionProvider = new Snippets()
    this.linter = new Linter()
  },

  deactivate () {
    delete this.linter
    this.linter = null
    delete this.completionProvider
    this.completionProvider = null
  },

  serialize () {
    return {}
  },

  provideLinter () {
    return this.linter
  },

  getCompletionProvider () {
    return this.completionProvider
  }

}
