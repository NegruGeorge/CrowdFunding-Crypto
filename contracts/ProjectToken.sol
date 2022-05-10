// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProjectToken is ERC20 {
    uint256 public  INITIAL_SUPPLY;
    constructor(string memory _name, string memory  _symbol,uint256 _supply) ERC20(_name, _symbol) {
        INITIAL_SUPPLY = _supply * (10**uint256(18));

        _mint(msg.sender, INITIAL_SUPPLY);
    }
}