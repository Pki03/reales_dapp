// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//real estate nft

// Import OpenZeppelin ERC721 and ERC721URIStorage contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RealEstate is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Constructor to initialize the ERC721 contract with name and symbol
    constructor() ERC721("Real Estate", "REAL") {}

    // Function to mint new NFT with a given token URI
    function mint(string memory tokenURL) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Mint the new token
        _mint(msg.sender, newItemId);

        // Set the token URI for the new token
        _setTokenURI(newItemId, tokenURL);

        return newItemId;
    }
    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }
}
