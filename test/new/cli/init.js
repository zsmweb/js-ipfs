'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const path = require('path')
const sinon = require('sinon')

const pkg = require('../../../package')
const BIN_PATH = path.resolve(pkg.bin.jsipfs)
const bin = require(BIN_PATH)
const initHandler = require('../../../src/cli/commands/init')

const cli = (args) => {
  bin(['node', 'bin.js'].concat(args || []))
}

describe('cli init', () => {
  afterEach(function () {
    sinon.restore()
  })

  it('should invoke the init handler', (done) => {
    sinon.stub(initHandler, 'handler').callsFake((argv) => {
      expect(argv.bits).to.eql('2048')
      expect(argv.privateKey).to.not.exist()
      expect(argv.emptyRepo).to.not.exist()
      expect(argv.pass).to.eql('')
      done()
    })
    cli(['init'])
  })
})