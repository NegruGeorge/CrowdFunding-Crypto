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


export default function ProjectCard({item}:any) {
    console.log("ss")
    console.log(item.title)
  return (
<Card key = {item.title} sx={{ maxWidth: 345,marginTop:"30px" }}>
              <CardHeader title={item.title} subheader='NFTName' />
              <CardMedia
                  component="img"
                  height="140"
                  image = "https://s2.coinmarketcap.com/static/img/coins/64x64/8567.png"
                  alt="green "
              />
              <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {item.description}
                  </Typography>
              </CardContent>
              <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
              </CardActions>
           </Card>
  )
}