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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Box from "@mui/material/Box"


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


export default function ProjectCard({item,goToInvest}:any) {
    // console.log("ss")
    // console.log(item.title)
  return (

<Card key = {item.title} sx={{ maxWidth: 445,marginTop:"30px",backgroundColor:"#F0F8FF" }}>
              
              <CardHeader 
            
              avatar = {
                  <CurrencyExchangeIcon  fontSize="large"/>
              }
              title={item.title +  " $" + item.tokenSymbol} subheader={ "Get NFT: " + item.nftName} 
              
              
              />
              <CardMedia
                  component="img"
                  height="100"
                  image = {item.nftURI}
                  alt="green "
              />
              <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  { "Project: " +  item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  { "Description: " +  item.description}
                  </Typography>
                
                <Typography sx={{marginTop:"40px"}}>Goal: {item.goal}ETH</Typography>
                <LinearProgressWithLabel value={ (parseFloat(item.balance) * 100) / parseFloat(item.goal)}/>
              </CardContent>


              <CardActions >
                <Button 
                    sx={{marginLeft:"100px"}}
                   size="large" 
                   variant="contained"
                   onClick={()=>goToInvest(3,item.contractAddress)}>
                    Invest or Learn More
                </Button>
              </CardActions>
           </Card>
  )
}
