// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Contract is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 450000000 * (10**uint256(18));



    constructor(string memory _name, string memory  _symbol) ERC20(_name, _symbol) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}