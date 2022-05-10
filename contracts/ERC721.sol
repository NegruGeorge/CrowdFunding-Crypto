// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ERC721Uni is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Prefix for tokens metadata URI
    string public baseURI;

    // Sufix for tokens metadata URIs
    string public baseExtension = ".json";

    //Cost of 1 NFT
    uint256 public cost = 1 ether;

    //Max Supply of NFTs
    uint256 public maxSupply = 4096;


    // Maximum number of NFTs that can be minted in 1 transaction
    uint256 public maxMintAmount = 50;

    // Operator that set/unset contract to pause
    bool public paused = false;

     // Check if collection is revealed;
    bool public revealed = false;

    // Prefix for tokens metadata URI if the collection is not revealed
    string public notRevealedURI;


    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        string memory _notRevealedURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        setNotRevealedURI(_notRevealedURI);
        mint(msg.sender, 10);
    }

    /**
     * Internat baseURI getter.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * Access: all accounts.
     *
     * @param _to address to allocate the minted token to.
     * @param _mintAmount the number of NFTs that msg.sender want to mint
     */
    function mint(address _to, uint256 _mintAmount)
        public
        payable
        nonReentrant
    {
        uint256 supply = totalSupply();
        require(!paused, "ERC721Uni: contract on pause");
        require(_mintAmount > 0, "ERC721Uni: mintAmount must be > 0");
        require(
            _mintAmount <= maxMintAmount,
            "ERC721Uni: mintAmount must be <= maxMintAmount"
        );
        require(
            supply + _mintAmount <= maxSupply,
            "ERC721Uni: can't exceed supply"
        );
            if (msg.sender != owner()) {
                require(
                    msg.value >= cost * _mintAmount,
                    "ERC721Uni: not enough money to mint"
                );
            }
            for (uint256 i = 1; i <= _mintAmount; i++) {
                _safeMint(_to, supply + i);
            }
    }

    /**
     * Returns the complete metadata URI for the given tokenId.
     */
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if(revealed == false)
        {
            return notRevealedURI;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    /**
     * Set the state for the NFT (revelaed or not)
     *
     * Access: only the contract owner account
     *
     !* @param state operator set the revealed state
     */
    function setRevealed(bool state) public onlyOwner(){
        revealed = state;
    }

    /**
     * Set the cost of 1 NFT
     *
     * Access: only the contract owner account
     *
     !* @param _newCost operator set the new cost !in ether
     */
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    /**
     * Set the max amount of NFTs that can be minted in 1 transaction
     *
     * Access: only the contract owner account
     *
     * @param _newmaxMintAmount operator set the contract max amount that can be minted
     */
    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    /**
     * Changes the base URI for token metadata.
     *
     * Access: only the contract owner account.
     *
     * @param _newBaseURI new value
     */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

        /**
     * Changes the Not revealed base URI for token metadata.
     *
     * Access: only the contract owner account.
     *
     * @param _newNotRevealedURI new value
     */
    function setNotRevealedURI(string memory _newNotRevealedURI) public onlyOwner {
        notRevealedURI = _newNotRevealedURI;
    }

    /**
     * Changes the base extension for token metadata.
     *
     * Access: only the contract owner account.
     *
     * @param _newBaseExtension new value
     */
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    /**
     * Set contract on pause
     *
     * Access: only the contract owner account
     *
     * @param _state operator set the contract on pause
     */
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    /**
     * Transfers the total native coin balance to contract's owner account.
     * The balance must be > 0 so a zero transfer is avoided.
     * 
     * Access: Contract Owner
     */
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance != 0, "ERC721Uni: contract balance is zero");
        sendViaCall(payable(owner()), balance);
    }

    /**
     * @dev Function to transfer coins (the native cryptocurrency of the platform, i.e.: ETH) 
     * from this contract to the specified address.
     *
     * @param _to the address to transfer the coins to
     * @param _amount amount (in wei)
     */
    function sendViaCall(address payable _to, uint256 _amount) private {
        (bool sent, ) = _to.call { value: _amount } ("");
        require(sent, "ERC721Uni: failed to send amount");
    }

}
