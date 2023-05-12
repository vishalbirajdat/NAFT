//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 public listPrice = 0.001 ether;

    


    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        string title;
        string nftURL;
        address payable owner;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
         string title,
        string nftURL,
        address indexed owner,
        uint256 price,
        bool currentlyListed
    );

        //the event emitted when a token is successfully listed
    event historyToFrom (
        uint256 indexed tokenId,
        address indexed to,
        address indexed from,
        uint256 price,
        uint timestamp,
        string memo
    );


    modifier ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NAFTMarket", "NAFT") {
        owner = payable(msg.sender);
    }

    function changePrice(uint256 _price, uint256 _tokenId) public {
        address ownerNft = idToListedToken[_tokenId].owner;
         require(ownerNft == msg.sender, "Only NFT owner can update  price");
         idToListedToken[_tokenId].price = _price;
    }

    
    function disableNft(uint256 _tokenId) public {
        address ownerNft = idToListedToken[_tokenId].owner;
        require(ownerNft == msg.sender, "Only NFT owner can update  nft");
        require(idToListedToken[_tokenId].currentlyListed == true, "You can not disbale it");
        idToListedToken[_tokenId].currentlyListed = false;
    }

        function enableNft(uint256 _tokenId) public {
        address ownerNft = idToListedToken[_tokenId].owner;
        require(ownerNft == msg.sender, "Only NFT owner can update  nft");
        require(idToListedToken[_tokenId].currentlyListed == false, "You can not enable it");
        idToListedToken[_tokenId].currentlyListed = true;
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }




    function getBalance() public view returns(uint256){
            return address(this).balance;
    }

    function getFund(address adr, uint256 _val) ownerOnly public payable{
        payable(adr).transfer(_val);
    }


    //The first time a token is created, it is listed here
    function createToken(string memory _title,string memory _tokenURI, uint256 price) public payable returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, _tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(_title , _tokenURI, newTokenId, price);

        return newTokenId;
    }

    function createListedToken(string memory _title, string memory _tokenURI,uint256 tokenId, uint256 price) private {
        //Just sanity check
        require(price >= listPrice, "Make sure the price isn't negative");

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            _title,
            _tokenURI,
            payable(msg.sender),
            price,
            true
        );
        
        _approve(msg.sender, tokenId);
     
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
              _title,
            _tokenURI,
            payable(msg.sender),
            price,
            true
        );

    emit historyToFrom (
            tokenId,
        payable(msg.sender),
        payable(msg.sender),
            price,
        block.timestamp,
        "created"
    );
    }
       
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }
    
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender) {
                currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId) public payable {
        require(idToListedToken[tokenId].currentlyListed == true, "You can not buy it");
        uint price = idToListedToken[tokenId].price;
        address payable ownerNft = idToListedToken[tokenId].owner;
        // address owner = idToListedToken[tokenId].owner;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(msg.sender != ownerNft);
        //Actually transfer the token to the new owner
        _transfer(ownerNft, msg.sender, tokenId);

         //approve the marketplace to sell NFTs on your behalf
        _approve(msg.sender,tokenId);
    

               //update the details of the token
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].owner = payable(msg.sender);
        _itemsSold.increment();


        uint256 val = msg.value;

        ownerNft.transfer(val - listPrice);

        //Transfer the listing fee to the marketplace creator
        owner.transfer(listPrice);

        emit historyToFrom (
            tokenId,
        payable(msg.sender),
        ownerNft,
            price,
        block.timestamp,
        "transfer"
    );
     
    }

    //We might add a resell token function in the future
    //In that case, tokens won't be listed by default but users can send a request to actually list a token
    //Currently NFTs are listed by default
}
