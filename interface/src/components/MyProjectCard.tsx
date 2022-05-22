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
import {ethers} from "ethers"



export default function MyProjectCard({item,goToInvest,withdraw,checkIfProjectIsOver}:any) {
    // console.log("ss")
    // console.log(item.title)
  return (

<Card key = {item.title} sx={{ maxWidth: 1045,marginTop:"30px",backgroundColor:"#F0F8FF" }}>
              
              <CardHeader 
        
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
                  <Typography variant="h5" component="div">
                    {"Goal to Raise:  " + ethers.utils.formatEther(item.goal)}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {"Total Raised:  " + ethers.utils.formatEther(item.balance)}
                  </Typography>


              </CardContent>
              <CardActions >
                <Button 
                    sx={{marginLeft:"300px"}}
                   size="large" 
                   variant="contained"
                   color="secondary"

                   onClick={()=>checkIfProjectIsOver(item.contractAddress)}>
                    Check if over 
                </Button>

                <Button 
                    sx={{marginLeft:"200px"}}
                   size="large" 
                   variant="contained"
                   color="secondary"
                   onClick={()=>withdraw(item.contractAddress)}>
                    Withdraw money
                </Button>
              </CardActions>
           </Card>
  )
}
