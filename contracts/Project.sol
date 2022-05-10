//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./ProjectNft.sol";
import "./ProjectToken.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



contract Project is IERC721Receiver {
    using SafeERC20 for IERC20;


    address payable public owner;
    string public title;
    string public description;
    uint256 public durationDeadline;
    uint256 public goal;

    bool public goalFulfiled;
    bool public durationOverdue;

    ProjectNft projectNft;
    IERC20 projectToken;

    uint256 public totalRaised;

    uint256 public tokenSupply;
    uint256 public tokenDistributed;
    uint256 public tokenRemaining;

    uint256 public  balance ;


   mapping (address => uint) public contributions;
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier isOver() {
        require(goalFulfiled ==false, "Project: Campaign is over, the goal was fulfield");
        _;
        require(durationOverdue == false, "Project: Campaign is over, the duration to raise funds ended");
    }


    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    constructor(
        address payable projectCreator,
        string memory _title,
        string memory _description,
        uint256 _duration,
        uint256 _goalInETH,
        string memory nftName,
        string memory nftSymbol,
        string memory baseUri,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 supply
    ) {
        owner = projectCreator;
        title = _title;
        description = _description;
        durationDeadline = block.timestamp + _duration * (1 minutes);
        goal = _goalInETH * (10 ** 18);
        balance = 0;

        tokenSupply = supply * (10**uint256(18)); 

        projectNft = new ProjectNft(
            nftName,
            nftSymbol,
            baseUri,
            baseUri
        );
        projectToken = new ProjectToken(
            tokenName,
            tokenSymbol,
            supply
        );
    }

    function invest() external payable{
        // assure that the time and goal are not finished 
        checkIfCompleteOrOverDue();

        // geting the percentage from the pool
        // the pool is equal to goal - balance, 
        uint256 percFromTotal = (msg.value * 10000) / (goal-balance);
        if(percFromTotal >10000){
            percFromTotal = 10000;
        }
        // get the tokens that one user gets rewarded after investing % from the goal amount
        // tokenSupply - tokenDistributed => tokenRemains to distribute;
        
        uint256 totalTokensBasedOnPerc = ((tokenSupply-tokenDistributed) * percFromTotal) / 10000;

        contributions[msg.sender] = contributions[msg.sender] + msg.value;
        totalRaised = totalRaised+ msg.value;
        projectNft.mint(msg.sender,1);
        projectToken.approve(address(this),totalTokensBasedOnPerc +1);
        projectToken.safeTransferFrom(address(this),msg.sender,totalTokensBasedOnPerc);
        tokenDistributed+=totalTokensBasedOnPerc;
        balance = address(this).balance;
    }

    function getPerFromTotal(uint256 sum) public view  returns(uint256){
        uint256 percFromTotal = (sum * 10000) / (goal-balance);
        if(percFromTotal >10000){
            percFromTotal = 10000;
        }
        return percFromTotal;
    }

    function getTotalTokensBasedOnPerc(uint256 sum) external view returns(uint256){
        uint256 percFromTotal = getPerFromTotal(sum);
        uint256 totalTokensBasedOnPerc = ( (tokenSupply-tokenDistributed) * percFromTotal) / 10000;
        return totalTokensBasedOnPerc;
    } 



    function checkIfCompleteOrOverDue() public isOver() {
        if(address(this).balance >= goal){
            goalFulfiled = true;
        }
        if(block.timestamp >= durationDeadline)
        {
            durationOverdue = true;
        }

    }

    // used by owner to retrive the money either when goal is fulfiled or duration is past due
    function payOut() public isOwner() {
        require(balance >= goal || block.timestamp > durationDeadline , "Project: cannot retrive money only if goal is fulfield or duration is past due ");
        sendViaCall(payable(owner), balance);

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
        require(sent, "Project: failed to send amount");
    }

    // // if users don't get their rewards than we need to refund.
    // function getRewards();

    function getProjectNftAddress() external view returns(address){
        return address(projectNft);
    }

    function getProjectTokenAddress() external view returns(address) {
        return address(projectToken);
    }


    function getOwner() external view returns(address){
        return owner;
    }


    function getCurrentBlock() external view returns(uint256){
        return block.timestamp;
    }

    function getRemainingBlockUntilEnding() external view returns(uint256){
        if(durationDeadline > block.timestamp){
            return durationDeadline - block.timestamp;
        }
        else{
            return 0;
        }
    }

    function getContractBalance() external view returns(uint256){
        return address(this).balance;
    }



}
