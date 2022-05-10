import {ethers} from "ethers";
import ProjectAbi from '../abis/Project.json';


export default(signer,contractAddress) =>{
    return new ethers.Contract(contractAddress,ProjectAbi,signer);
}