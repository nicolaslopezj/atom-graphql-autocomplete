'use babel'
import Snippets from './Snippets'
import Linter from './Linter'

export default {

  orionsoftView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    disableErrors: {
      type: 'object',
      properties: {
        fragmentIsNeverUsed: {
          title: 'Disable fragment is never used',
          type: 'boolean',
          default: true
        },
        unknownFragment: {
          title: 'Disable unkown fragment',
          type: 'boolean',
          default: true
        },
        templateString: {
          title: 'Template string in JS',
          type: 'boolean',
          default: true
        }
      }
    }
  },

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
