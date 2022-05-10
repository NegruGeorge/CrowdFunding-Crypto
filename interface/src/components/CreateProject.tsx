import React from 'react'
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import { Button, Divider, TextField } from '@mui/material';
import {useState} from "react";

import { useWeb3React } from '@web3-react/core'
import CrowdFundingContract from "../contracts/crowdfungindContract.js";
let CrowdFundingAddress = "0xDAB457Efd688904Eac98c2cA493458bDc7495909";


export default function CreateProject() {

    const {chainId,account,active,library:provider} = useWeb3React();

    const [title,setTitle] = useState<any>("");
    const [description,setDescription] = useState<any>("");
    const [goal,setGoal] = useState<any>("");
    const [duration,setDuration] =  useState<any>("")
    const [nftName,setNftName] = useState<any>("")
    const [nftSymbol,setNftSymbol] = useState<any>("")
    const [nftBaseURI,setNftBaseURI] = useState<any>("");
    const [tokenName,setTokenName] = useState<any>("")
    const [tokenSymbol,setTokenSymbol] = useState<any>("")
    const [tokenSupply,setTokenSupply] = useState<any>("")


    async function createNewProject(){
        const signer = provider.getSigner();
        const crowdFundingContract = CrowdFundingContract(signer,CrowdFundingAddress)

        try{
            const tx = await crowdFundingContract.createProject(title,description,duration,goal,nftName,nftSymbol,nftBaseURI,tokenName,tokenSymbol,tokenSupply)

            tx.wait().then((res:any)=>{
                console.log("tranzactie cu success")
            })
            .catch((err:any)=>{
                console.log("err txWait")
                console.log(err)
            })

        }catch(err:any){
            console.log("erroare try111")
            console.log(err)
        }
    }

  return (
      <>
<Typography sx={{fontSize:"20px", fontWeight:"bold"}}>
            Create A new CrowdfundingProject:
        </Typography>

    <Box sx={{}}>

    {/* border:"solid", */}
        <Box sx={{ 
        display:"flex", flexDirection:"row",
        justifyContent:"space-around",
        // alignItems:"center"
        }}>

            <Box className="boxLeft" sx={{marginTop:'20px',marginRight:"20px",alignItems:"center"}} >
                <Box sx={{margin:"auto"}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Title: 
                    </Typography>
                    <TextField sx={{width:"300px"}} id="outlined-basic"
                    label="Project Title"
                    variant="outlined"
                    value = {title}
                    onChange = {e=> setTitle(e.target.value)}
                    />
                </Box>
                <Box sx={{margin:"auto",marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Crowdfunding Duration (minutes): 
                    </Typography>
                    <TextField sx={{width:"300px"}}
                    id="outlined-basic" 
                    label="Duration (minutes)" 
                    variant="outlined"
                    value={duration}
                    onChange = {e=> setDuration(e.target.value)}
                    />
                </Box>
                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Goal to raise (ETH): 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="Goal ethereum" 
                    variant="outlined"
                    value = {goal}
                    onChange = {e=>setGoal(e.target.value)}
                    />
                </Box>

                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Nft Name: 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="NFT Name" 
                    variant="outlined"
                    value = {nftName}
                    onChange = {e=> setNftName(e.target.value)}
                    />
                </Box>

                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Nft Symbol: 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="NFT Symbol" 
                    variant="outlined"
                    value={nftSymbol}
                    onChange = {e=>setNftSymbol(e.target.value)}
                    />
                </Box>

                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project baseURI(photoLink): 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="NFT URI" 
                    variant="outlined"
                    value = {nftBaseURI}
                    onChange = {e=>setNftBaseURI(e.target.value)}
                    />
                </Box>

            </Box>

            <Box className="boxRight">
            
                <Box sx={{margin:"auto", marginTop:'20px'}}>
                <Typography  sx={{fontSize:"30px"}}>
                    Project Description: 
                </Typography>
                <TextField sx={{width:"1000px"}} 
                id="outlined-multiline-static"  
                multiline
                rows={10} 
                label="Description" 
                variant="outlined"
                value = {description}
                onChange = {e => setDescription(e.target.value)}
                />
                </Box>

                <Box sx={{marginTop:'55px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Token Name: 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="Token Name" 
                    variant="outlined"
                    value = {tokenName}
                    onChange = {e=>setTokenName(e.target.value)}
                    />
                </Box>

                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Token Symbol: 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="Token Symbol" 
                    variant="outlined"
                    value = {tokenSymbol}
                    onChange = {e=>setTokenSymbol(e.target.value)}
                    />
                </Box>

                <Box sx={{marginTop:'20px'}}>
                    <Typography  sx={{fontSize:"30px"}}>
                        Project Token Supply: 
                    </Typography>
                    <TextField sx={{width:"300px"}} 
                    id="outlined-basic" 
                    label="Token Supply" 
                    variant="outlined"
                    value={tokenSupply}
                    onChange = {e=> setTokenSupply(e.target.value)}
                    />
                </Box>

            </Box>

        </Box>
        <Box sx={{marginTop:"30px",marginLeft:"100px"}}>
            <Button  
            size="large" 
            variant="contained"
            disabled = {title == "" || description == "" || goal == "" || duration == "" || nftName =="" || nftSymbol =="" || nftBaseURI == "" || tokenName =="" || tokenSymbol == "" || tokenSupply==""}
            onClick={()=> createNewProject()}
           >
                Create Project
                
            </Button>      
        </Box>

       
    </Box>

    
      </>
  )
}
