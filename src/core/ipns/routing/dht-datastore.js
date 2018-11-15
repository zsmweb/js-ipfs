'use strict'

const { Key } = require('interface-datastore')
const { encodeBase32 } = require('./utils')

// Dht datastore sets the proper encoding for storing records
class DhtDatastore {
  constructor (dht) {
    this._dht = dht
  }

  /**
   * Put a value to the dht indexed by the received key properly encoded.
   * @param {Buffer} key identifier of the value.
   * @param {Buffer} value value to be stored.
   * @param {function(Error)} callback
   * @returns {void}
   */
  put (key, value, callback) {
    // encode key properly - base32(/ipns/{cid}) TODO: remove this
    const routingKey = new Key('/' + encodeBase32(key), false)

    // this._dht.put(key, value, callback) // TODO: leveldatastore toString() makes utf8 key
    this._dht.put(routingKey.toBuffer(), value, callback)
  }

  /**
   * Get a value from the local datastore indexed by the received key properly encoded.
   * @param {Buffer} key identifier of the value to be obtained.
   * @param {function(Error, Buffer)} callback
   * @returns {void}
   */
  get (key, callback) {
    // encode key properly - base32(/ipns/{cid}) TODO: remove this
    const routingKey = new Key('/' + encodeBase32(key), false)

    // this._dht.get(key, callback) // TODO: leveldatastore toString() makes utf8 key
    this._dht.get(routingKey.toBuffer(), callback)
  }
}

exports = module.exports = DhtDatastore
