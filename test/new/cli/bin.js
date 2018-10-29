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
const cliUtils = require('../../../src/cli/utils')

const cli = (args) => {
  bin(['node', 'bin.js'].concat(args || []))
}

describe('cli bin.js', () => {
  beforeEach(() => {
    sinon.stub(cliUtils, 'getIPFS').callsFake((argv, cb) => {
      cb(null, {}, () => {})
    })
  })

  afterEach(function () {
    sinon.restore()
  })

  it('should print help if no sub commands are provided', (done) => {
    sinon.stub(process.stdout, 'write').callsFake((data) => {
      process.stdout.write.restore()
      expect(data).to.contain('Commands:')
      expect(data).to.contain('Options:')
      expect(data).to.contain('export IPFS_PATH=/path/to/ipfsrepo')
      done()
    })
    cli()
  })

  it('should handle --silent flag', (done) => {
    const spy = sinon.stub(cliUtils, 'disablePrinting').returns(false)
    sinon.stub(cliUtils, 'print').callsFake(() => {
      expect(spy.calledOnce).to.eql(true)
      done()
    })
    cli(['help', '--silent'])
  })

  it('should handle unknown arguments correctly', (done) => {
    sinon.stub(process.stdout, 'write').callsFake((data) => {
      process.stdout.write.restore()
      expect(data).to.contain('Unknown arguments: again, random')

      // should then output help
      sinon.stub(process.stdout, 'write').callsFake((data) => {
        process.stdout.write.restore()
        expect(data).to.contain('Commands:')
        expect(data).to.contain('Options:')
        expect(data).to.contain('export IPFS_PATH=/path/to/ipfsrepo')
        done()
      })
    })
    cli(['random', '--again'])
  })
})