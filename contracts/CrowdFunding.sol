//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Project.sol";
import "./ProjectNft.sol";
import "./ProjectToken.sol";

contract Crowdfunding {
    Project[] public projects;

    mapping(address => address) prod;

    function createProject(
        string memory title,
        string memory description,
        uint256 duration,
        uint256 goal,
        string memory nftName,
        string memory nftSymbol,
        string memory baseUri,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 supply
    ) external {

        Project project = new Project(
            payable(msg.sender),
            title,
            description,
            duration,
            goal,
            nftName,
            nftSymbol,
            baseUri,
            tokenName,
            tokenSymbol,
            supply
        );
        projects.push(project);
    }

    function getAllProjects() external view returns (Project[] memory) {
        return projects;
    }

    function getProjectForUser(address user) external view returns (Project[] memory){
        Project[] memory projectsForUser = new Project[](projects.length);
        uint256 counter = 0;
        
        for(uint i=0; i<projects.length;i++)
        {
            if(projects[i].getOwner() == user){
                projectsForUser[counter] = projects[i];
                counter+=1;
            }
        }
        return projectsForUser;
    }
}
