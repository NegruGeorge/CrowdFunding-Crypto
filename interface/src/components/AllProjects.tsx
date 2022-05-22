import { useWeb3React } from '@web3-react/core'
import React from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {useEffect,useState} from "react";
import { CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {ethers} from "ethers"



import CrowdFundingContract from "../contracts/crowdfungindContract.js";
import ProjectContract  from "../contracts/ProjectContract";
import ProjectNftContract from "../contracts/ProjectNft";
import ProjectTokenContract from "../contracts/ProjectToken";

import ProjectCard from "./ProjectCard"


let CrowdFundingAddress = "0xDAB457Efd688904Eac98c2cA493458bDc7495909";
export default function AllProjects({goToInvest}:any) {
    let [projectsData,setProjectsData]  = useState<any>([]);

    const {chainId,account,active,library:provider} = useWeb3React();

    useEffect(()=>{
        // console.log("in Use")
        if(active){
          getProjects();
        }
      },[active])
  

      async function getProjects() {
        // console.log(active)
        if(active){
          const signer = provider.getSigner();
          // console.log(".......")
          // console.log(signer)
  
          let contractCrowdFunding = CrowdFundingContract(provider.getSigner(),CrowdFundingAddress);
          // console.log(contractCrowdFunding)
        
  
        let projects = await contractCrowdFunding.getAllProjects();
        // console.log(projects);

        // setProjectsData([]);
       let aux:any = []
        // console.log("veee")

        for(let i =0; i<projects.length;i++){
          // console.log("x")
          // console.log(projects[i])
          // console.log("x")
           let projectContract = ProjectContract(signer,projects[i]);
           let NftAddress = await  projectContract.getProjectNftAddress();
           let TokenAddress = await projectContract.getProjectTokenAddress();
          //  console.log("....")
          //  console.log(NftAddress);
          //  console.log(TokenAddress)

           let nftContract =  ProjectNftContract(signer,NftAddress);
           let tokenContract =  ProjectTokenContract(signer,TokenAddress);
          

          let projectTitle =await projectContract.title();
          let projectDescription = await projectContract.description();
          let projectDuration = await projectContract.durationDeadline();
          let projectNftName = await nftContract.name();
          let projectNftSymbol = await nftContract.symbol();
          let projectNftURI = await nftContract.baseURI();
          let projectTokenName = await tokenContract.name();
          let projectTokenSymbol = await tokenContract.symbol();
          let projectTokenSupply = await tokenContract.totalSupply();

          let projectGoal = ethers.utils.formatEther(await projectContract.goal());
          let projectBalance = ethers.utils.formatEther(await projectContract.getContractBalance())

          // console.log("----------------------------")
          // console.log(projectTitle);
          // console.log(projectNftName);
          // console.log(projectNftSymbol);
          // console.log(projectTokenName)
          
           let component = {
             title: projectTitle,
             description:projectDescription,
             duration: projectDuration,
             nftName:projectNftName,
             nftSymbol: projectNftSymbol,
             nftURI: projectNftURI,
             tokeName: projectTokenName,
             tokenSymbol: projectTokenSymbol,
             tokenSupply: projectTokenSupply,
             contractAddress:projects[i],
             balance: projectBalance,
             goal: projectGoal
           }
           aux.push(component)
          // console.log(aux)
            // console.log("xxxxxxxxxxxxxx")
            // console.log(projectsData)
            // setProjectsData(component);
            // console.log([...projectsData])
        }

        // project.forEach(async (proj:any)=>{
        

        // })

        // console.log(aux)
        setProjectsData(aux);

   
        }
      }

     useEffect(()=>{

     },[projectsData])

  return (
    <>
    
    <Typography sx={{fontSize:"40px",fontWeight:"bold"}}>All Projects</Typography>
    {/* <Button onClick={()=>goToInvest(3,"ss")}>Go Invest</Button> */}
    <Typography paragraph>
            {/* chainId: {chainId} <br/>
            address: {account} <br/>
            ative : {active ? 'true':'false'} <br/> */}
            {active ?<Typography   sx={{fontSize:"10px"}} color ="secondary"  >connected</Typography>:
                <Typography   sx={{fontSize:"100px"}} color ="secondary"  >Please connect</Typography>
          }
        </Typography>

          {/* {projectsData.length} */}

    {

     active ? 
     
          projectsData.length ===0 ? 
            
            <Box sx={{ display: 'flex', alignItems:"center" }}>
              <Box sx={{margin:"auto"}}>
                 <CircularProgress size="10rem"/>
              </Box>
           
          </Box>

            :

            <Box sx={{ flexGrow: 1, marginLeft:"100px"}}>
            <Grid container spacing={0}>
                  {projectsData.map((i:any)=>(
                    <Grid item xs={4} sx={{marginBottom:"30px"}}>
                        <ProjectCard key={i.title} item = {i} goToInvest={goToInvest} />
                    </Grid>
                    
                  ))}
            </Grid>
          </Box>
        
      :null


    }

   
           
    </>

    
  )
}
