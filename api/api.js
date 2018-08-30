let fs = require("fs");
let path = require("path");
let Web3 = require('web3'); // https://www.npmjs.com/package/web3

let url = "ws://localhost:7545"

let web3 = new Web3(Web3.givenProvider || url);

let source = fs.readFileSync(path.join(__dirname, "ArbitratedEscrow.json"));
let contractInfo = JSON.parse(source)["contracts"]['contracts/ArbitratedEscrow.sol:ArbitratedEscrow'];

// ABI description as JSON structure
let abi = JSON.parse(contractInfo.abi);
// Smart contract EVM bytecode as hex
let code = '0x' + contractInfo.bin;

const ownerAddress = "0x39d60936C62190570dE5776C7C283baF366417bE"

var buyer = '0x39d60936C62190570dE5776C7C283baF366417bE';
var seller = '0x6e85C3548AF3272257E42BB8dF5A3C4Aa9c90eB4';
var arbitrator = "0x42B56B3A8dAB0bD0725879E84261A4Fad4e86975";
var contract_text = `${buyer} agrees to pay ${seller} after ${seller} performs service.`;

///////////////// Create and Deploy Contract (do this first) /////////////////

// var ArbitratedEscrow = new web3.eth.Contract(abi);

// console.log("Deploying the contract");
// ArbitratedEscrow.deploy({data: code, arguments: [buyer, seller, arbitrator, contract_text]})
//     .send({from: ownerAddress, gas: 4000000, gasPrice: '0'})
//     .then((instance) => {
//         var contractAddress = instance.options.address;
//         console.log(`Address: ${contractAddress}`);
//       });

///////////////// Connect to Contract /////////////////
///////////////// (use this for all calls after the contract has been deployed) /////////////////

// contractAddress = "0x298cfC8aDfe85cc634Bc29a9bC53326912355f73"
// var ArbitratedEscrow = new web3.eth.Contract(abi, contractAddress);
// let params = {};

///////////////// Monitor Event /////////////////

// ArbitratedEscrow.events.allEvents(function(error, event){ console.log(event); })
// .on('error', console.error);

///////////////// Get State Variable /////////////////

// ArbitratedEscrow.methods.parties(seller).call(function(err, res) {
//     console.log(err);
//     console.log(res);
// });

///////////////// Transact with Contract Function /////////////////

// params = {from: buyer};
// ArbitratedEscrow.methods.confirm().send(params, function(err, res) {
//     console.log(err);
//     console.log(res);
// });

///////////////// Transact with Contract Function with Parameter /////////////////

// params = {from: arbitrator};
// ArbitratedEscrow.methods.complete(seller).send(params, function(err, res) {
//     console.log(err);
//     console.log(res);
// });

///////////////// Send Money to Contract /////////////////

// params = {from: buyer, value: web3.utils.toWei("5")};
// ArbitratedEscrow.methods.deposit().send(params, function(err, res) {
//     console.log(err);
//     console.log(res);
// });