'use babel'
import Snippets from './Snippets'
import {CompositeDisposable} from 'atom'
import provideLinter from './provideLinter'

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

  activate(state) {
    this.completionProvider = new Snippets()
    this.subscriptions = new CompositeDisposable()
  },

  deactivate() {
    delete this.completionProvider
    this.completionProvider = null
    this.subscriptions.dispose()
    this.subscriptions = null
  },

  serialize() {
    return {}
  },

  getCompletionProvider() {
    return this.completionProvider
  },

  provideLinter
}
