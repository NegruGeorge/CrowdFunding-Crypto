const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectToken", function () {
  it("Should deploy a new token and check the name, symbol and deployer balance", async function () {

    [deployer] = await ethers.getSigners();

    const ProjectToken = await ethers.getContractFactory("ProjectToken");
    const projectToken = await ProjectToken.deploy("GeorgeToken","GTKN",10000);  
    await projectToken.deployed();

    expect(await projectToken.name()).to.equal("GeorgeToken");
    expect(await projectToken.symbol()).to.eq("GTKN")

    let balance = await projectToken.balanceOf(deployer.address);
    expect(balance).to.eq(ethers.utils.parseEther("10000"));
  
  });
});
