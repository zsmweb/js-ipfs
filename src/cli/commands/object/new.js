'use strict'

const multibase = require('multibase')
const { print } = require('../../utils')
const dagPB = require('ipld-dag-pb')
const { cidToString } = require('../../../utils/cid')

module.exports = {
  command: 'new [<template>]',

  describe: 'Create new ipfs objects',

  builder: {
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler ({ ipfs, template, cidBase }) {
    ipfs.object.new(template, (err, node) => {
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
