import React from 'react'
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box"
import { Divider, TextField } from '@mui/material';
import {useEffect,useState} from "react";
import { useWeb3React } from '@web3-react/core'


import CrowdFundingContract from "../contracts/crowdfungindContract.js";
import ProjectContract  from "../contracts/ProjectContract";
import ProjectNftContract from "../contracts/ProjectNft";
import ProjectTokenContract from "../contracts/ProjectToken";
import MyProjectCard from "./MyProjectCard"
import CircularProgress from '@mui/material/CircularProgress';


let CrowdFundingAddress = "0xDAB457Efd688904Eac98c2cA493458bDc7495909";

export default function MyProjects() {
  let [projectsData,setProjectsData]  = useState<any>([]);


  const {chainId,account,active,library:provider} = useWeb3React();

  useEffect(()=>{
    // console.log("in Use")
    if(active){
      getProjects();
    }
  },[active])

  async function getProjects() {
   //console.log(active)
    if(active){
      const signer = provider.getSigner();
      //console.log(".......")
      //console.log(signer)

      let contractCrowdFunding = CrowdFundingContract(provider.getSigner(),CrowdFundingAddress);
      //console.log(contractCrowdFunding)
    

    let projects = await contractCrowdFunding.getProjectForUser(account);
    //console.log(projects);

    // setProjectsData([]);
   let aux:any = []
    //console.log("veee")

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

      let projectBalance = await projectContract.balance();
      let projectGoal = await projectContract.goal();

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
         balance:projectBalance,
         goal:projectGoal
       }
       aux.push(component)
      //console.log(aux)
        // console.log("xxxxxxxxxxxxxx")
        // console.log(projectsData)
        // setProjectsData(component);
        // console.log([...projectsData])
    }

    // project.forEach(async (proj:any)=>{
    

    // })

    //console.log(aux)
    setProjectsData(aux);


    }
  }


  async function withdrawFunds(projectAddress:any){
    if(active){

      const signer = provider.getSigner();

      let projectContract = ProjectContract(signer,projectAddress);

      try{
       let tx = await  projectContract.payOut();
       tx.wait();
      }catch(err){
        console.log(err)
      }


    }
  }

  async function checkIfProjectIsOver(projectAddress:any){
    if(active){

      const signer = provider.getSigner();

      let projectContract = ProjectContract(signer,projectAddress);

      try{
       let tx = await  projectContract.checkIfCompleteOrOverDue();
       tx.wait();
      }catch(err){
        console.log(err)
      }


    }
  }



  useEffect(()=>{

  },[projectsData])


  return (
      <>
      <Typography sx={{fontSize:"40px",fontWeight:"bold"}}>My Projects</Typography>

    {active ?<Typography   sx={{fontSize:"10px"}} color ="secondary"  >connected</Typography>:
                <Typography   sx={{fontSize:"100px"}} color ="secondary"  >Please connect</Typography>
    }
    {/* {projectsData.length} */}
            
            {/* {projectsData.map((i:any)=>(
                <MyProjectCard
                  key={i.title}
                  item = {i} 
                  withdraw ={withdrawFunds} 
                  checkIfProjectIsOver ={checkIfProjectIsOver}
                
                
                />
            ))} */}
      
{
      active ? 
     
     projectsData.length ===0 ? 
       
       <Box sx={{ display: 'flex', alignItems:"center" }}>
         <Box sx={{margin:"auto"}}>
            <CircularProgress size="10rem"/>
         </Box>
      
     </Box>

       :

       projectsData.map((i:any)=>(
        <MyProjectCard
          key={i.title}
          item = {i} 
          withdraw ={withdrawFunds} 
          checkIfProjectIsOver ={checkIfProjectIsOver}
        
        
        />
    ))
   
 :null

             }

      </>
   

    )
}
