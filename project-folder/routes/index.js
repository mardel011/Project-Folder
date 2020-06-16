var express = require("express");
var router = express.Router();
/* GET home page. */
router.get("/", async function(req, res, next) {
  const Web3 = require("web3");
  var Tx = require("ethereumjs-tx").Transaction;
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:7545")
  );
  var accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  const contractAddress = "0xb859fb11b51e2a1cc33f0ea9e95c711a1c07facb";
  const ABI = require("./test.abi.json");
  const account = "0x7B28E407AD98d1c6b421d68F6922D8D4f3838d68";
  const privateKey = Buffer.from(
    "2491d1f4f473b6c379825c8b3c36b0fd5ea2b71db36d75bfd01ce24893ac3c97",
    "hex"
  );

  var TestContract = new web3.eth.Contract(ABI, contractAddress);
  const _data = TestContract.methods.setName('name').encodeABI();

  _nonce = await web3.eth.getTransactionCount(account);

  var rawTx = {
    nonce: _nonce,
    gasPrice: "0x20000000000",
    gasLimit: "0x27511",
    to: contractAddress,
    value: 0,
    data: _data
  };

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  var _receipt = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex")
  );
  console.log("Receipt: ", _receipt);

  res.render("index", { title: "Express", receipt: JSON.stringify(_receipt) });
});

module.exports = router;
