import web3 from './web3';
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xB2647eFfb5C68e18751D3dc0a4077EeBAa20e8D8'
);

export default instance;