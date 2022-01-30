import Web3 from "web3";
import { INFURA_ROBSTEN_URL_WSS, INFURA_ROBSTEN_URL } from "@env";
const provider = new Web3.providers.WebsocketProvider(INFURA_ROBSTEN_URL_WSS);
const web3 = new Web3(provider);
// export const Web3Context = React.createContext(web3);
export default web3;
