import web3 from './web3';
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xF81593a94BA7a0AC4FfBBB36605489604925bc86'
);

export default instance;