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


import CrowdFundingContract from "../contracts/crowdfungindContract.js";
import ProjectContract  from "../contracts/ProjectContract";
import ProjectNftContract from "../contracts/ProjectNft";
import ProjectTokenContract from "../contracts/ProjectToken";

import ProjectCard from "./ProjectCard"


let CrowdFundingAddress = "0xDAB457Efd688904Eac98c2cA493458bDc7495909";
export default function AllProjects(goToInves:any) {
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
        
  
        let projects = await contractCrowdFunding.getAllProjects();
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
             tokenSupply: projectTokenSupply
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
    <div>AllProjects</div>
    <Typography paragraph>
            chainId: {chainId} <br/>
            address: {account} <br/>
            ative : {active ? 'true':'false'} <br/>
            {/* {active ?<Button variant="contained"  color ="secondary" onClick = {getProjects}>getProjects</Button>:
                <Button variant="contained"  color ="secondary"  >Please connect</Button>
          } */}
          
        {/* <Card sx={{ maxWidth: 345,marinTop:"30px" }}>
            <CardHeader title="Project Title" subheader='NFTName' />
            <CardMedia
                component="img"
                height="140"
                image = {require('../images/bk.jpg')}
                alt="green "
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                Project Title
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Project Description
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>
            </Card> */}


        </Typography>

          {projectsData.length}
            
      {projectsData.map((i:any)=>(
          <ProjectCard key={i.title} item = {i}  />
      ))}

    </>

    
  )
}
