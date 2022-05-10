import {ethers} from "ethers";
import ProjectToken from '../abis/ProjectToken.json';


export default(signer,contractAddress) =>{
    return new ethers.Contract(contractAddress,ProjectToken,signer);
}