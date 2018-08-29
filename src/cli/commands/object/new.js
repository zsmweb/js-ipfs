'use strict'

const multibase = require('multibase')
const { print } = require('../../utils')
const {
  util: {
    cid
  }
} = require('ipld-dag-pb')
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

  handler (argv) {
    argv.ipfs.object.new(argv.template, (err, node) => {
      if (err) {
        throw err
      }

      cid(node, (err, cid) => {
        if (err) {
          throw err
        }

        print(cidToString(cid, argv.cidBase))
      })
    })
  }
}
