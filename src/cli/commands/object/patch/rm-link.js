'use strict'

const multibase = require('multibase')
const { print } = require('../../../utils')
const dagPB = require('ipld-dag-pb')
const { cidToString } = require('../../../../utils/cid')

module.exports = {
  command: 'rm-link <root> <link>',

  describe: 'Remove a link from an object',

  builder: {
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler ({ ipfs, root, link, cidBase }) {
    ipfs.object.patch.rmLink(root, { name: link }, {
      enc: 'base58'
    }, (err, node) => {
      if (err) {
        throw err
      }

      dagPB.util.cid(node, (err, cid) => {
        if (err) {
          throw err
        }

        print(cidToString(cid, cidBase))
      })
    })
  }
}
