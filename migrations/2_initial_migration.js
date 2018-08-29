var ArbitratedEscrow = artifacts.require("./ArbitratedEscrow.sol");
var buyer = 0x39d60936C62190570dE5776C7C283baF366417bE;
var seller = 0x6e85C3548AF3272257E42BB8dF5A3C4Aa9c90eB4;
var arbitrator = 0x42B56B3A8dAB0bD0725879E84261A4Fad4e86975;

module.exports = function(deployer) {
  deployer.deploy(ArbitratedEscrow, buyer, seller, arbitrator);
};
