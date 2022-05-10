import {ethers} from "ethers";
import ProjectNftAbi from '../abis/ProjectNft.json';


export default(signer,contractAddress) =>{
    return new ethers.Contract(contractAddress,ProjectNftAbi,signer);
}