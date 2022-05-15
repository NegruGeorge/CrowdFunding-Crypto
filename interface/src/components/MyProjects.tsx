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
import ProjectCard from "./ProjectCard"


let CrowdFundingAddress = "0xDAB457Efd688904Eac98c2cA493458bDc7495909";

export default function MyProjects() {
  let [projectsData,setProjectsData]  = useState<any>([]);


  const {chainId,account,active,library:provider} = useWeb3React();

  useEffect(()=>{
    console.log("in Use")
    if(active){
      getProjects();
    }
  },[active])

  async function getProjects() {
    console.log(active)
    if(active){
      const signer = provider.getSigner();
      console.log(".......")
      console.log(signer)

      let contractCrowdFunding = CrowdFundingContract(provider.getSigner(),CrowdFundingAddress);
      console.log(contractCrowdFunding)
    

    let projects = await contractCrowdFunding.getProjectForUser(account);
    console.log(projects);

    // setProjectsData([]);
   let aux:any = []
    console.log("veee")

    for(let i =0; i<projects.length;i++){
      console.log("x")
      console.log(projects[i])
      console.log("x")
       let projectContract = ProjectContract(signer,projects[i]);
       let NftAddress = await  projectContract.getProjectNftAddress();
       let TokenAddress = await projectContract.getProjectTokenAddress();
       console.log("....")
       console.log(NftAddress);
       console.log(TokenAddress)

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
      console.log("----------------------------")
      console.log(projectTitle);
      console.log(projectNftName);
      console.log(projectNftSymbol);
      console.log(projectTokenName)
      
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
         contractAddress:projects[i]
       }
       aux.push(component)
      console.log(aux)
        // console.log("xxxxxxxxxxxxxx")
        // console.log(projectsData)
        // setProjectsData(component);
        // console.log([...projectsData])
    }

    // project.forEach(async (proj:any)=>{
    

    // })

    console.log(aux)
    setProjectsData(aux);


    }
  }

  useEffect(()=>{

  },[projectsData])


  return (
      <>
    <div>My Project</div>

    {projectsData.length}
            
            {projectsData.map((i:any)=>(
                <ProjectCard key={i.title} item = {i}  />
            ))}
      
      </>
   

    )
}
