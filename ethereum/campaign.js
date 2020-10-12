import web3 from './web3';
import campaign from "./build/Campaign.json";

const Campaign = (address) => {
    if (web3.utils.isAddress(address)) {
        return new web3.eth.Contract(JSON.parse(campaign.interface), address);
    }
}

export default Campaign;