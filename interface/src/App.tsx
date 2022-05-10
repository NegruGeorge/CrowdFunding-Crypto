import { useWeb3React } from '@web3-react/core';
import React from 'react';
import './App.css';
import PermanentDrawer from './components/PermanentDrawer';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";


function getLibrary(provider:any, connector:any) {
  let library =  new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
  // library.pollingInterval = 12000;
  return library;
}


function App() {
  return (
      <Web3ReactProvider getLibrary={getLibrary} >
        <PermanentDrawer/>
      </Web3ReactProvider>
  );
}

export default App;
