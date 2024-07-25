// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Minimal interface for ERC721 with transfer function
interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

// Escrow contract to manage transactions involving NFTs
contract Escrow {
    address public lender;
    address public inspector;
    address payable public seller;
    address public nftAddress;

    modifier onlySeller() {
    require(msg.sender == seller, "Only seller can perform this action");
    _;
}
    // Use modifier to restrict access to the buyer of the NFT
    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can perform this action");
        _;
    }



    mapping(uint256=>bool) public isListed;
    mapping(uint256=>uint256) public purchasePrice;
    mapping(uint256=>uint256) public escrowAmount;
    mapping(uint256=>address) public buyer;

    // Constructor to initialize the contract with addresses
    constructor(
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    // Function to list an NFT for escrow
    function list(uint256 _nftID,address _buyer,uint _purchasePrice,uint256 _escrowAmount) public payable onlySeller() {
        // Ensure the caller is the seller
        // require(msg.sender == seller, "Only the seller can list the NFT");

        // Transfer the NFT from the seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    // You can add more functions to handle escrow logic here

    //put under contract only buyer only
    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID){
        require(msg.value>=escrowAmount[_nftID]);
    }

    receive() external payable{}

    
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
}
