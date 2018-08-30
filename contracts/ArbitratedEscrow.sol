pragma solidity ^0.4.24;

contract ArbitratedEscrow {
    struct Party {
        address destination;
        bool confirmed;
    }

    uint public balance;
    address public buyer;
    address public seller;
    address public arbitrator;
    string public contract_text;
    mapping (address => Party) public parties;
    uint private start;

    // Events allow light clients to react on
    // changes efficiently.
    event Confirmed(address from);
    event Completed(address from, address to);
    event AttemptedPayment(uint256 value, address whom);

    constructor(address buyer_address, address seller_address, address arbitrator_address, string initial_contract_text) public {
        // this is the constructor function that runs ONCE upon initialization
        buyer = buyer_address;
        seller = seller_address;
        arbitrator = arbitrator_address;
        contract_text = initial_contract_text;
        start = now; //now is an alias for block.timestamp, not really "now"
    }

    function confirm() public {
        parties[msg.sender].confirmed = true;
        emit Confirmed(msg.sender);
    }
    
    function complete(address to) public {
        if (to != seller && to != buyer) {
            revert("Invalid destination");
        }

        parties[msg.sender].destination = to;

        address seller_dest = parties[seller].destination;
        address buyer_dest = parties[buyer].destination;
        address arbitrator_dest = parties[arbitrator].destination;

        // If agreement, pay out
        if (seller_dest != address(0) && (seller_dest == buyer_dest || seller_dest == arbitrator_dest)) {
            payBalance(seller_dest);
        } else if (buyer_dest != address(0) && buyer_dest == arbitrator_dest) {
            payBalance(buyer_dest);
        }
        
    }
    
    function payBalance(address to) private {
        // send the balance
        emit AttemptedPayment(address(this).balance, to);
        to.transfer(address(this).balance);
        balance = 0;
    }
    
    function deposit() public payable {
        if (!(parties[buyer].confirmed && parties[seller].confirmed && parties[arbitrator].confirmed)) {
            revert("Contract awaiting confirmation");
        }
        balance += msg.value;
    }

}
