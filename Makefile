compile:
	solc contracts/ArbitratedEscrow.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > routes/ArbitratedEscrow.json

run:
	node api.js