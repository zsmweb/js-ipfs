/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const CID = require('cids')
const waitFor = require('../../utils/wait-for')

module.exports = (http) => {
  describe('/bitswap', () => {
    const wantedCid = 'QmUBdnXXPyoDFXj3Hj39dNJ5VkN3QFRskXxcGaYFBB8CNR'
    let api

    before(() => {
      api = http.api.server.select('API')
    })

    before(function (done) {
      this.timeout(120 * 1000)

      // Add a CID to the wantlist
      api.inject({
        method: 'GET',
        url: `/api/v0/block/get?arg=${wantedCid}`
      })

      const test = (cb) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/bitswap/wantlist'
        }, (res) => {
          if (res.statusCode !== 200) {
            return cb(new Error(`unexpected status ${res.statusCode}`))
          }
          const wanted = Boolean(res.result.Keys.find(k => k['/'] === wantedCid))
          cb(null, wanted)
        })
      }

      waitFor(test, {
        name: wantedCid + ' to be wanted',
        timeout: 60 * 1000
      }, done)
    })

    it('/wantlist', (done) => {
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/wantlist'
      }, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.have.property('Keys')
        expect(res.result.Keys).to.deep.include({ '/': wantedCid })
        done()
      })
    })

    it('/wantlist?cid-base=base64', (done) => {
      const base64Cid = new CID(wantedCid).toV1().toString('base64')
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/wantlist?cid-base=base64'
      }, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.Keys).to.deep.include({ '/': base64Cid })
        done()
      })
    })

    it('/wantlist?cid-base=invalid', (done) => {
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/wantlist?cid-base=invalid'
      }, (res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.result.Message).to.include('child "cid-base" fails')
        done()
      })
    })

    it('/stat', (done) => {
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/stat'
      }, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result).to.have.property('ProvideBufLen')
        expect(res.result).to.have.property('BlocksReceived')
        expect(res.result).to.have.property('Wantlist')
        expect(res.result).to.have.property('Peers')
        expect(res.result).to.have.property('DupBlksReceived')
        expect(res.result).to.have.property('DupDataReceived')
        expect(res.result).to.have.property('DataReceived')
        expect(res.result).to.have.property('BlocksSent')
        expect(res.result).to.have.property('DataSent')
        done()
      })
    })

    it('/stat?cid-base=base64', (done) => {
      const base64Cid = new CID(wantedCid).toV1().toString('base64')
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/stat?cid-base=base64'
      }, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.result.Wantlist).to.deep.include({ '/': base64Cid })
        done()
      })
    })

    it('/stat?cid-base=invalid', (done) => {
      api.inject({
        method: 'GET',
        url: '/api/v0/bitswap/stat?cid-base=invalid'
      }, (res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.result.Message).to.include('child "cid-base" fails')
        done()
      })
    })
  })
}
