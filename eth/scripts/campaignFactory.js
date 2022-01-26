import web3 from "./web3";
import { CAMPAIGN_FACTORY_ADDRESS } from "@env";
import CampaignFactory from "../build/CampaignFactory.json";

const instance = await new web3.eth.Contract(
  CampaignFactory.abi,
  CAMPAIGN_FACTORY_ADDRESS
);
export default instance;
