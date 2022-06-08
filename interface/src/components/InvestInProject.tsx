import React from 'react'
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography';
import {useEffect,useState} from "react";
import { useWeb3React } from '@web3-react/core'
import "../styles/CreateProjectStyle.css"
import { Button, Divider, TextField } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';


import ProjectContract  from "../contracts/ProjectContract";
import ProjectNftContract from "../contracts/ProjectNft";
import ProjectTokenContract from "../contracts/ProjectToken";
import { ethers } from 'ethers';


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}


export default function InvestInProject({projectAddress}:any) {
    // console.log(projectAddress)
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
      //(projectAddress + " .................")
      if(active && projectAddress !== ""){
        const signer = provider.getSigner();
       // console.log(".....");

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
      //console.log(".....");

      let projectContract = ProjectContract(provider.getSigner(),projectAddress);
      //console.log(amountETH)
      const options = {value: ethers.utils.parseEther(amountETH)}
      await projectContract.invest(options);

    }

  return (
      <>
      <Typography sx={{fontSize:"40px",fontWeight:"bold"}}>
      <PaidIcon  sx={{marginLeft:"20px"}}fontSize="large"/>
        Invest in Projects
       
      </Typography>

      {
      projectAddress === "" ?
        <Box sx={{margin:"auto"}}>
            <Typography  sx={{fontSize:"100px"}} color="secondary" >Please Go and select a project</Typography>
        </Box>
        
        :

          projectName ===""  || nftName==="" || nftSymbol==="" ?

          <Box sx={{ display: 'flex', alignItems:"center" }}>
              <Box sx={{margin:"auto"}}>
                <CircularProgress size="10rem"/>
              </Box>
          
           </Box>


          :

            <Box className="ProjectContainer">
            <Box sx={{marginLeft:"210px",marginBottom:"20px"}}>
              <Typography sx={{fontSize:"30px"}}> Project:</Typography>

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

            
            

                <Box sx={{ flexGrow: 1}}>
                  <Grid container spacing={0}>
                    <Grid  sx={{marginLeft:"130px"}}  item xs={2}>
                        <Box>
                        <Typography sx={{fontSize:"20px"}}>Current amount</Typography>
                        <Typography 
                        sx={{ marginLeft:"20px",fontSize:"30px",fontWeight:"bold"}}>
                          {ethers.utils.formatEther(projectBalance)} ETH
                        </Typography>
                        </Box>
                    </Grid>
                    <Grid sx={{marginRight:"30px"}}item xs={6}>
                        <Box sx={{marginTop:"30px"}}>
                          <LinearProgressWithLabel
                          value={(( parseFloat(ethers.utils.formatEther(projectBalance)) * 100 ) /
                            parseFloat(ethers.utils.formatEther(projectGoal)) ) }
                          />
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box>
                        <Typography sx={{fontSize:"20px"}}>Goal amount</Typography>
                        <Typography 
                        sx={{ marginLeft:"15px",fontSize:"30px",fontWeight:"bold"}}>
                          {ethers.utils.formatEther(projectGoal)} ETH
                        </Typography>
                        </Box>
                    </Grid>
                  
                  </Grid>
                </Box>


{/* 
                  <Box sx={{ marginBottom:"50px",
                  display:"flex", flexDirection:"row",
                  justifyContent:"space-around",
                    }}>
                    <Box>
                    <Typography sx={{fontSize:"20px"}}>Current amount</Typography>
                    <Typography 
                    sx={{ marginLeft:"20px",fontSize:"30px",fontWeight:"bold"}}>
                      {ethers.utils.formatEther(projectBalance)} ETH
                    </Typography>
                    </Box>



                    <Box>
                    <Typography sx={{fontSize:"20px"}}>Goal amount</Typography>
                    <Typography 
                    sx={{ marginLeft:"15px",fontSize:"30px",fontWeight:"bold"}}>
                      {ethers.utils.formatEther(projectGoal)} ETH
                    </Typography>
                    </Box>
                  </Box> */}

              </Box>
          </Box>


      }

       
      </>
  )
}
