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
const idHandler = require('../../../src/cli/commands/id')

const cli = (args) => {
  bin(['node', 'bin.js'].concat(args || []))
}

describe('cli id', () => {
  afterEach(function () {
    sinon.restore()
  })

  it('should invoke the id handler', (done) => {
    sinon.stub(idHandler, 'handler').callsFake((argv) => {
      expect(argv.ipfs.id).to.be.a('function')
      done()
    })
    cli(['id'])
  })

  it('should return a valid id', (done) => {
    const id = {
      id: 'Qm',
      publicKey: 'a public key',
      addresses: ['/dns4/ipfs.io/tcp/443/ipfs/Qm'],
      agentVersion: 'js-ipfs/x.xx.x',
      protocolVersion: '9000'
    }
    const idStub = sinon.stub().callsFake((cb) => {
      cb(null, id)
    })
    sinon.stub(process.stdout, 'write').callsFake((data) => {
      process.stdout.write.restore()
      expect(data).to.eql(`${JSON.stringify(id, '', 2)}\n`)
      done()
    })
    idHandler.handler({
      ipfs: {
        id: idStub
      }
    })
  })

  it('should handle an error', (done) => {
    const idStub = sinon.stub().callsFake((cb) => {
      cb(new Error('bad things'))
    })
    expect(() => {
      idHandler.handler({
        ipfs: {
          id: idStub
        }
      })
    }).to.throw('bad things')
    done()
  })
})