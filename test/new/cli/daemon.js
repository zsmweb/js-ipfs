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
const daemonHandler = require('../../../src/cli/commands/daemon')

const cli = (args) => {
  bin(['node', 'bin.js'].concat(args || []))
}

describe('cli daemon', () => {
  afterEach(function () {
    sinon.restore()
  })

  it('should invoke the daemon handler', (done) => {
    sinon.stub(daemonHandler, 'handler').callsFake((argv) => {
      expect(argv.local).to.eql(false)
      expect(argv.pass).to.eql('')
      expect(argv.enablePubsubExperiment).to.eql(false)
      expect(argv.enableDhtExperiment).to.eql(false)
      expect(argv.enableShardingExperiment).to.eql(false)
      done()
    })
    cli(['daemon'])
  })
})