import {ethers} from "ethers";
import CrowdFunding_abi from '../abis/CrowdFunding.json';


export default(signer,contractAddress) =>{
    return new ethers.Contract(contractAddress,CrowdFunding_abi,signer);
}