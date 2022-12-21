const secp = require("ethereum-cryptography/secp256k1")
const utils = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

// generate some keys
const generateKeys = (num) => {
  if (num == null) {
    num = 1
  }

  for (let i=0; i<num; i++) {
    const privateKey = secp.utils.randomPrivateKey()
    const publicKey = secp.getPublicKey(privateKey, false).slice(1) // remove compression byte
    const address = keccak256(publicKey).slice(-20) // hash and take last 20 bytes

    console.log(`-- key: ${i }--`)
    console.log(`private key: ${utils.toHex(privateKey)}`)
    console.log(`public key: ${utils.toHex(publicKey)}`)
    console.log(`address: 0x${utils.toHex(address)}`)
  }
}

// sample sign
const sign = async (msg, privateKey) => {
  let msgHash = keccak256(utf8ToBytes(msg))
  let signer = await secp.sign(msgHash, privateKey, {recovered: true})

  console.log(`signature: ${utils.toHex(signer[0])}`)
  console.log(`recovered bit: ${signer[1]}`)

  let pubKey = await secp.recoverPublicKey(msgHash, signer[0], signer[1]);
  console.log(`public key: ${utils.toHex(pubKey.slice(1))}`)
}

module.exports = {generateKeys, sign}