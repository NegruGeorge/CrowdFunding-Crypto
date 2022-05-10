//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdfundingFull is Ownable {
    uint256 currentPresalePhase;
    struct presaleData {
        uint256 numberOfDays;
        uint256 cost;
        uint256 goal;
        uint256 deadline;
        uint256 balanceOfPresalePeriod;
        uint256 rewardTokenAmount;
        bool exist;
    }
    mapping(uint256 => mapping(address => uint256)) public allocationPerPresale;
    mapping(uint256 => mapping(address => uint256)) public  rewardPerPresale;
    mapping(uint256 => presaleData ) public  dataAboutPresale;

    IERC20 public usdt;
    IERC20 public rewardToken;
    uint256 currentBalance;
    address public devAddress;
    uint256 devReward;
    uint256 ownerReward;

    constructor(address _devAddress) {
        devAddress = _devAddress;
        usdt = IERC20(0x8ddf3Ae7C560E29c28992f3B4f3D139C2AE492DD);
        rewardToken = IERC20(0x4eA3D1C7c081609da3d7940711FE2Ad144346A1F);
    }

    function addPresalePeriod(uint256 _goal, uint256 _numberOfDays, uint256 _presaleNumber, uint256 _cost, uint256 _rewardTokenAmount ) public onlyOwner{
        require(dataAboutPresale[_presaleNumber].exist == false, "This presale number already exist");
        require(rewardToken.transferFrom(msg.sender, address(this), _rewardTokenAmount),"Transfer of reward tokens failed");
        require(_rewardTokenAmount >= _goal / _cost,"Reward token amount must be = goal/cost");
        currentPresalePhase = _presaleNumber;
        dataAboutPresale[_presaleNumber].numberOfDays = _numberOfDays;
        dataAboutPresale[_presaleNumber].cost = _cost;
        dataAboutPresale[_presaleNumber].goal = _goal;
        dataAboutPresale[_presaleNumber].deadline = block.timestamp + (_numberOfDays * 1 minutes);
        dataAboutPresale[_presaleNumber].rewardTokenAmount = _rewardTokenAmount;
        dataAboutPresale[_presaleNumber].exist = true; 
    }

    function pledge(uint256 amount) public {
        require(block.timestamp < dataAboutPresale[currentPresalePhase].deadline,"Presale period was finished ");     // in the fundraising period
        currentBalance = usdt.balanceOf(address(this));           
        require(amount <= (dataAboutPresale[currentPresalePhase].goal-dataAboutPresale[currentPresalePhase].balanceOfPresalePeriod), "The amount entered exceeds the required amount until the goal is reached");
        require(dataAboutPresale[currentPresalePhase].goal > dataAboutPresale[currentPresalePhase].balanceOfPresalePeriod, "It is already founded for this presale period");
        uint256 amountOfTokens = amount / dataAboutPresale[currentPresalePhase].cost;
        devReward = (amountOfTokens / 100) ;
        ownerReward = (amountOfTokens - devReward) ;
        require(dataAboutPresale[currentPresalePhase].rewardTokenAmount >= amountOfTokens,"There are no tokens for reward");
       
        dataAboutPresale[currentPresalePhase].balanceOfPresalePeriod += amount;
        allocationPerPresale[currentPresalePhase][msg.sender] += amount;
        
        usdt.approve(address(this),amount+1);
        require(usdt.transferFrom(msg.sender, address(this), amount), "Transfer tokens from user to contract failed");
      
        rewardToken.approve(address(this),rewardToken.balanceOf(address(this))+1);
        require(rewardToken.transferFrom(address(this), devAddress, (devReward* (10**18))),"Reward to devAddress transfer failed");
        require(rewardToken.transferFrom(address(this), msg.sender, (ownerReward* (10**18))),"Reward to user transfer failed");
        dataAboutPresale[currentPresalePhase].rewardTokenAmount -= amountOfTokens;
        rewardPerPresale[currentPresalePhase][msg.sender] += ownerReward;
    }

    function claimFunds(uint256 presaleNumber) public onlyOwner{
        require(dataAboutPresale[presaleNumber].balanceOfPresalePeriod > 0, "Presale period balance must be > 0");
        require(usdt.balanceOf(address(this)) > 0,"The contract balance must be > 0");
        require(dataAboutPresale[presaleNumber].balanceOfPresalePeriod  >= dataAboutPresale[presaleNumber].goal,"Presale balance must be >= goal"); // funding goal met
        require(block.timestamp >= dataAboutPresale[presaleNumber].deadline,"Current time must be >= deadline");               // in the withdrawal period
        dataAboutPresale[presaleNumber].balanceOfPresalePeriod = 0;
        usdt.approve(address(this),usdt.balanceOf(address(this))+1);
        require(usdt.transferFrom(address(this), msg.sender, usdt.balanceOf(address(this))),"Claim funds transfer failed");
    }

    function getRefund(uint256 presaleNumber) public {
        require(dataAboutPresale[presaleNumber].balanceOfPresalePeriod  < dataAboutPresale[presaleNumber].goal ,"Presale balance must be < presale goal");  // funding goal not met
        require(block.timestamp >= dataAboutPresale[presaleNumber].deadline,"Presale period must be finished");               // in the withdrawal period
        require(dataAboutPresale[presaleNumber].balanceOfPresalePeriod > 0,"Current balance of presale period must be > 0");
        uint256 amount = allocationPerPresale[presaleNumber][msg.sender];
        usdt.approve(address(this), amount+1);
        require(usdt.transferFrom( address(this), msg.sender, amount),"Refund for user failed");
        require(rewardToken.transferFrom(msg.sender, address(this), rewardPerPresale[presaleNumber][msg.sender]));
        
        allocationPerPresale[presaleNumber][msg.sender] = 0;
        dataAboutPresale[presaleNumber].balanceOfPresalePeriod -= amount;
        dataAboutPresale[presaleNumber].rewardTokenAmount += rewardPerPresale[presaleNumber][msg.sender];
        rewardPerPresale[presaleNumber][msg.sender] = 0;
    }

    function deletePresalePeriod(uint256 _presaleNumber) public onlyOwner{
        dataAboutPresale[_presaleNumber].numberOfDays = 0;
        dataAboutPresale[_presaleNumber].cost = 0;
        dataAboutPresale[_presaleNumber].goal = 0;
        dataAboutPresale[_presaleNumber].deadline = 0;
        usdt.approve(address(this),dataAboutPresale[_presaleNumber].balanceOfPresalePeriod+1);
        usdt.transferFrom(address(this), msg.sender, dataAboutPresale[_presaleNumber].balanceOfPresalePeriod);
        dataAboutPresale[_presaleNumber].balanceOfPresalePeriod = 0;
        dataAboutPresale[_presaleNumber].exist = false;
    }

    function getOwnerReward() public view returns(uint256){
        return ownerReward;
    }
      function getDevReward() public view returns(uint256){
        return devReward;
    }
    function getGoal(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].goal;
    }

    function getCost(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].cost;
    }

    function getBalance(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].balanceOfPresalePeriod;
    }

    function getNumberOfDays(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].numberOfDays;
    }

    function getRemainedTimeForPresale(uint256 _presaleNumber) public view returns(uint256){
        require(dataAboutPresale[_presaleNumber].deadline > block.timestamp,"The presale period is over! ");
        return dataAboutPresale[_presaleNumber].deadline-block.timestamp;
    }

    function getFoundsLeftToRise(uint256 _presaleNumber) public view returns(uint256){
        return dataAboutPresale[_presaleNumber].goal-dataAboutPresale[_presaleNumber].balanceOfPresalePeriod;
    }

    function getAllocation(address userAddress, uint256 _presaleNumber) public view returns(uint256){
        return  allocationPerPresale[_presaleNumber][userAddress];
    }

    function getCurrentPresalePhase() public view returns(uint256){
        require(block.timestamp < dataAboutPresale[currentPresalePhase].deadline, "At the moment there is no open presale");
        return currentPresalePhase;
    }

    function getRewardPerPresale(address userAddress, uint256 _presaleNumber) public view returns(uint256){
        return rewardPerPresale[_presaleNumber][userAddress];
    }
}