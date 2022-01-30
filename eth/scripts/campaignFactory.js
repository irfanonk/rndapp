import { CAMPAIGN_FACTORY_ADDRESS } from "@env";
import web3 from "../../web3/web3";
import CampaignFactory from "../build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  CAMPAIGN_FACTORY_ADDRESS
);
export default instance;
