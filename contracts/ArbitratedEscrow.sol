pragma solidity ^0.4.24;

contract ArbitratedEscrow {
    struct Party {
        address location;
        address destination;
        bool confirmed;
    }

    uint public balance;
    Party public buyer;
    Party public seller;
    Party public arbitrator;
    mapping (address => Party) public parties;
    uint private start;

    // Events allow light clients to react on
    // changes efficiently.
    event Confirmed(address from);
    event Completed(address from, address to);

    constructor(address buyer_address, address seller_address, address arbitrator_address) public {
        // this is the constructor function that runs ONCE upon initialization
        parties[buyer_address] = buyer;
        buyer.location = buyer_address;
        parties[seller_address] = seller;
        seller.location = seller_address;
        parties[arbitrator_address] = arbitrator;
        arbitrator.location = arbitrator_address;
        start = now; //now is an alias for block.timestamp, not really "now"
    }

    function confirm() public {
        parties[msg.sender].confirmed = true;
        emit Confirmed(msg.sender);
    }
    
    function complete(address to) public {
        parties[msg.sender].destination = to;
        
        if (to != address(0) && (to == seller.location || to == buyer.location)) {
            // If agreement, pay out
            if (seller.location == buyer.location || seller.location == arbitrator.location) {
                payBalance(seller.location);
            } else if (buyer.location == arbitrator.location) {
                payBalance(buyer.location);
            }
        } else {
            revert("Invalid destination");
        }
    }
    
    function payBalance(address to) private {
        // send the balance
        to.transfer(address(this).balance);
        balance = 0;
    }
    
    function deposit() public payable {
        if (!(buyer.confirmed && seller.confirmed && arbitrator.confirmed)) {
            revert("Contract awaiting confirmation");
        }
        balance += msg.value;
    }

}
