const secp = require("ethereum-cryptography/secp256k1")
const utils = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// TODO: change these based on keytool.js generation
// these represent ethereum addresses
const balances = {
  "0xaefb3689b9d4c82792995b0fc288eb8cd16b1519": 100,
  "0x3e2dd124668145274577734ff2299aeaab8826e5": 50,
  "0x8d62d4e0d2d16884336f3d3349426f0dcf76466f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recoveryBit, recipient, amount } = req.body;

  // recover signature, assume msg is gm
  let msg = "gm"
  let msgHash = keccak256(utf8ToBytes(msg))

  let pubKey = secp.recoverPublicKey(msgHash, signature, Number(recoveryBit)).slice(1)
  let sender = `0x${utils.toHex(keccak256(pubKey).slice(-20))}`

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
