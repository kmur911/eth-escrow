var fs = require("fs");
var path = require("path");
var Web3 = require('web3'); // https://www.npmjs.com/package/web3

var url = "ws://localhost:7545";
var web3 = new Web3(Web3.givenProvider || url);

var source = fs.readFileSync(path.join(__dirname, "ArbitratedEscrow.json"));
var contractInfo = JSON.parse(source)["contracts"]['contracts/ArbitratedEscrow.sol:ArbitratedEscrow'];

// ABI description as JSON structure
var abi = JSON.parse(contractInfo.abi);
// Smart contract EVM bytecode as hex
var code = '0x' + contractInfo.bin;

const ownerAddress = "0x39d60936C62190570dE5776C7C283baF366417bE"
    
var buyer = '0x39d60936C62190570dE5776C7C283baF366417bE';
var seller = '0x6e85C3548AF3272257E42BB8dF5A3C4Aa9c90eB4';
var arbitrator = "0x42B56B3A8dAB0bD0725879E84261A4Fad4e86975";
var contract_text = `${buyer} agrees to pay ${seller} after ${seller} performs service.`;
var address_map = {
    "buyer": buyer,
    "seller": seller,
    "arbitrator": arbitrator
}

var contractAddress = "0x298cfC8aDfe85cc634Bc29a9bC53326912355f73"

var appRouter = function (app) {

  app.post("/create-agreement", function (req, res) {
    
    ///////////////// Create and Deploy Contract (do this first) /////////////////
    
    var ArbitratedEscrow = new web3.eth.Contract(abi);
    
    console.log("Deploying the contract");
    ArbitratedEscrow.deploy({data: code, arguments: [buyer, seller, arbitrator, contract_text]})
        .send({from: ownerAddress, gas: 4000000, gasPrice: '0'})
        .then((instance) => {
            var contractAddress = instance.options.address;
            var data = ({
                "contractAddress": contractAddress
              });
            console.log(`Address: ${contractAddress}`);
            res.status(200).send(data);
          });
  });

  app.post("/confirm-agreement", function (req, res) {
    var ArbitratedEscrow = new web3.eth.Contract(abi, contractAddress);
    params = {from: address_map[req.body.from]};
    ArbitratedEscrow.methods.confirm().send(params, function(err, resp) {
        var data = ({
            "result": "success"
          });
        res.status(200).send(data);
    });
  });

  app.post("/deposit-money", function (req, res) {
    var ArbitratedEscrow = new web3.eth.Contract(abi, contractAddress);
    params = {from: address_map[req.body.from], value: web3.utils.toWei("5")};
    ArbitratedEscrow.methods.deposit().send(params, function(err, resp) {
        var data = ({
            "result": "success"
          });
        res.status(200).send(data);
    });
  });

  app.post("/complete-agreement", function (req, res) {
    var ArbitratedEscrow = new web3.eth.Contract(abi, contractAddress);
    params = {from: address_map[req.body.from]};
    ArbitratedEscrow.methods.complete(address_map[req.body.destination]).send(params, function(err, resp) {
        var data = ({
            "result": "success"
          });
        res.status(200).send(data);
    });

  });

 app.get("/agreement-state", function (req, res) {
    var ArbitratedEscrow = new web3.eth.Contract(abi, contractAddress);
    ArbitratedEscrow.methods.state_string().call(function(err, resp) {
        var data = ({
            "state": resp
        });
        res.status(200).send(data);
    });
 });
}

module.exports = appRouter;