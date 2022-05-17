import React from 'react'
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography';
import {useEffect,useState} from "react";
import { useWeb3React } from '@web3-react/core'
import "../styles/CreateProjectStyle.css"
import { Button, Divider, TextField } from '@mui/material';

import ProjectContract  from "../contracts/ProjectContract";
import ProjectNftContract from "../contracts/ProjectNft";
import ProjectTokenContract from "../contracts/ProjectToken";
import { ethers } from 'ethers';

export default function InvestInProject({projectAddress}:any) {
    console.log(projectAddress)
    const [projectName,setProjectName] = useState("");
    const [projectDescription,setProjectDescription] = useState("");
    const [projectGoal,setProjectGoal] = useState("");
    const [projectDuration,setProjectDuration] = useState("")
    const [amountETH,setAmountETH] = useState("");
    const [nftName,setNftName] = useState("");
    const [nftSymbol,setNftSymbol] = useState("");
    const [tokenName,setTokenName] = useState("");
    const [tokenSymbol,setTokenSymbol] = useState("")
    const [projectPhoto,setProjectPhoto] = useState("")

    const [projectBalance,setProjectBalance] = useState("")


    const {chainId,account,active,library:provider} = useWeb3React();

    useEffect(()=>{
      if(active){
        getProject();
      }
    },[active])

    async function getProject(){
      console.log(projectAddress + " .................")
      if(active && projectAddress !== ""){
        const signer = provider.getSigner();
        console.log(".....");

        let projectContract = ProjectContract(provider.getSigner(),projectAddress);
        // console.log(projectContract)
        let title = await projectContract.title();
        let desc = await projectContract.description();
        let goal = await projectContract.goal()
        let currentBalance = await projectContract.balance();
        let nftAddress = await projectContract.getProjectNftAddress();
        let tokenAddress = await projectContract.getProjectTokenAddress();


        let nftContract = ProjectNftContract(provider.getSigner(),nftAddress);
        let tokenContract = ProjectTokenContract(provider.getSigner(),tokenAddress);

        let nftN = await nftContract.name();
        let nftS = await nftContract.symbol();
        let projPhoto = await nftContract.baseURI();

        let tokenN =  await tokenContract.name();
        let tokenS = await tokenContract.symbol();


        setProjectName(title);
        setProjectDescription(desc)
        setProjectGoal(goal.toString());
        setProjectBalance(currentBalance.toString())
        setNftName(nftN);
        setNftSymbol(nftS);
        setProjectPhoto(projPhoto)

        setTokenName(tokenN);
        setTokenSymbol(tokenS);
      }
    }

    async function invest(){
      const signer = provider.getSigner();
      console.log(".....");

      let projectContract = ProjectContract(provider.getSigner(),projectAddress);
      console.log(amountETH)
      const options = {value: ethers.utils.parseEther(amountETH)}
      await projectContract.invest(options);

    }

  return (
      <>
      <Box>InvestInProject</Box>
        <div>{ projectAddress === "" ? "nimic": "date"}</div>

        <div>{projectName}</div>
        <div>{projectDescription}</div>
        <div>{projectGoal}</div>
      {
        projectAddress === "" ?
        <Box sx={{margin:"auto"}}>
            <Typography sx={{fontSize:"100px"}}>Please Go and select a project</Typography>
        </Box>
        
        :

        <Box className="ProjectContainer">
        <Box sx={{marginLeft:"210px",marginBottom:"20px"}}>
          <Typography sx={{fontSize:"30px"}}>Project:</Typography>

          </Box>
          <Box sx={{ margin:"auto",width:1200,height:650, backgroundColor:"#F0F8FF",
          display:"flex", flexDirection:"column"
          }}>
              <Box sx={{textAlign:"center"}}>
                <Typography sx={{fontSize:"30px",fontWeight:"bold"}}>{projectName}</Typography>
              </Box>

              <Box >
                <Typography sx={{marginLeft:"30px",marginTop:"40px",marginBottom:"20px",fontSize:"20px"}}>{projectDescription}</Typography>
              </Box>
              <Box sx={{marginLeft:"30%"}}>
                <img className="imgDisp" src={projectPhoto}></img>
              </Box>

              <Box className="ProjRewards"
              sx={{display:"flex", flexDirection:"row",
                justifyContent:"space-around",
              }}
              
              >
                <Box >
                  <Typography>Invet and Get a NFT: {nftName} ({nftSymbol})</Typography>
                </Box>
                <Box>
                  <Typography>Also you will get {tokenName} token</Typography>
                </Box>

              </Box>

              <Box sx={{margin:"auto"}}>
              <TextField sx={{width:"150px"}} 
              id="filled-basic"
              label="Amount ETH" 
              variant="filled"
              onChange = {e=> setAmountETH(e.target.value)} />
                <Button  sx={{marginTop:"10px", marginLeft:"20px"}} 
                variant="contained" 
                disabled = {amountETH == "" }
                onClick = {()=> invest()}
                >
                    Invest in project
                </Button>
              
              </Box>
              <Box sx={{ marginBottom:"50px",
              display:"flex", flexDirection:"row",
              justifyContent:"space-around",
            }}>
                <Box>
                <Typography sx={{fontSize:"20px"}}>Current amount</Typography>
                <Typography 
                sx={{ marginLeft:"20px",fontSize:"30px",fontWeight:"bold"}}>
                  {projectBalance} ETH
                </Typography>
                </Box>
                <Box>
                <Typography sx={{fontSize:"20px"}}>Goal amount</Typography>
                <Typography 
                sx={{ marginLeft:"15px",fontSize:"30px",fontWeight:"bold"}}>
                  {projectGoal} ETH
                </Typography>
                </Box>
              </Box>

          </Box>
      </Box>


      }

       
      </>
  )
}
