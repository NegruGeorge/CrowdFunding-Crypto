import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

import { useWeb3React } from '@web3-react/core';
import {InjectedConnector} from "@web3-react/injected-connector";
import Button from '@mui/material/Button';
import {useEffect,useState} from "react";
import CrowdFunding_abi from '../abis/CrowdFunding.json';
import Project_abi from "../abis/Project.json";
import ProjectNft_abi from "../abis/ProjectNft.json"
import ProjectToken_abi from "../abis/ProjectToken.json";
import { ethers, Signer } from 'ethers';

import CrowdFundingContract from "../contracts/crowdfungindContract.js";
import AllProjects from './AllProjects';
import MyProjects from './MyProjects';
import CreateProject from './CreateProject';
import About from "./About";
import InvestInProject from './InvestInProject';

const drawerWidth = 240;

export default function PermanentDrawer() {
  const [selectedIndex,setSelectedIndex] = useState(0);

  const [projectAddress,setProjectAddress] = useState("");

  const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  })
    const {chainId,account,active,activate,library:provider} = useWeb3React();
    async function connect(){
        try{
           activate(injectedConnector)
        }catch(err){
            console.log(err);
        }
    }

    function handleChange(text:any,index:any){
      setSelectedIndex(index);
    }

    function handleChangeForInvest(index:any,projAddress:any){
      setSelectedIndex(index);
      setProjectAddress(projAddress)
      // console.log(".............................")
      // console.log("handleInvest")
      // console.log(index)
      // console.log(projAddress)
      // console.log(".............................")

    }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          {
              active ? (
                  <Typography>
                   
                      <Button variant="contained"  color ="secondary"  >{account}</Button>
                  </Typography>
              ):(
                  <Button variant="contained"  color ="secondary" onClick = {connect}>Connect</Button>
              )
          }
            

        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['All Projects', 'My Projects', 'Create A Project',"Invest","About"].map((text, index) => (
            <ListItem button key={text} selected={selectedIndex ===index}  onClick= {()=> handleChange(text,index)}>
              <ListItemIcon>
                {(index === 0) ? <MenuBookIcon/>:null}
                {(index === 1) ? <AccountCircleIcon/>:null}
                {(index === 2) ? <AddCircleIcon/>:null}
                {(index === 3) ?  <CurrencyBitcoinIcon/>:null }
                {(index === 4) ? <InfoIcon/>:null}
              
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />

          {selectedIndex ===0 ? <AllProjects goToInvest={handleChangeForInvest}/>:null}
          {selectedIndex ===1 ? <MyProjects/>:null}
          {selectedIndex ===2 ? <CreateProject/>:null}
          {selectedIndex ===3 ? <InvestInProject  projectAddress={projectAddress}/>:null}
          {selectedIndex ===4 ? <About/>:null}

        {/* <Typography paragraph>
            from the main Drawer
        </Typography> */}
      </Box>
    </Box>
  );
}
