// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SafeTrade {
    
    // Structure to hold item details
    struct Listing {
        uint256 id;
        address payable seller;
        address payable buyer;
        string title;
        string photoUrl; // Will store the web3.storage CID
        uint256 price;
        State state;
    }

    enum State { Available, Locked, Completed }

    uint256 public listingCount = 0;
    mapping(uint256 => Listing) public listings;

    event ListingCreated(uint256 id, string title, uint256 price, address seller);
    // Event emitted when an item is funded and locked
    event FundsLocked(uint256 id, address buyer);
    // Event emitted when the transaction is finalized
    event TradeCompleted(uint256 id);

    // Creates a new listing on the marketplace. Sets the seller as the caller.
    function createListing(string memory _title, string memory _photoUrl, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        listingCount++;
        listings[listingCount] = Listing({
            id: listingCount,
            seller: payable(msg.sender),
            buyer: payable(address(0)),
            title: _title,
            photoUrl: _photoUrl,
            price: _price,
            state: State.Available
        });
        emit ListingCreated(listingCount, _title, _price, msg.sender);
    }

    // Allows buyer to send ETH to the contract to lock in a purchase.
    function payForListing(uint256 _id) public payable {
        Listing storage item = listings[_id];
        
        require(item.state == State.Available, "Item is not available");
        require(msg.value == item.price, "Please submit the exact asking price");
        require(msg.sender != item.seller, "Seller cannot buy their own item");
        item.buyer = payable(msg.sender);
        item.state = State.Locked;
        emit FundsLocked(_id, msg.sender);
    }

    // Releases the locked funds to the seller. Can only be called by the buyer.
    function confirmReceipt(uint256 _id) public {
        Listing storage item = listings[_id];
        require(item.state == State.Locked, "Funds are not currently locked");
        require(msg.sender == item.buyer, "Only the buyer can confirm receipt");
        item.state = State.Completed;

        // Transfer the funds from the contract to the seller
        (bool success, ) = item.seller.call{value: item.price}("");
        require(success, "Transfer failed.");
        emit TradeCompleted(_id);
    }

    // Retrieves the  details of a single listing.
    function getListing(uint256 _id) public view returns (Listing memory) {
        return listings[_id];
    }
    // Retrieves the total number of listings to help the frontend iterate through items.
    function getTotalListings() public view returns (uint256) {
        return listingCount;
    }
}