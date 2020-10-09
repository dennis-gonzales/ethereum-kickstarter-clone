const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;
let campaign2;
let campaignAddress;
let campaignAddress2;

// console.log('---------------------------------------------------');
// console.log(JSON.parse(compiledFactory.interface));
// console.log('---------------------------------------------------');
// console.log(compiledFactory.bytecode);

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.CreateCampaign('100')
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.CreateCampaign('50000')
        .send({ from: accounts[0], gas: '1000000' });

    const campaignAddresses = await factory.methods.GetCampaignsAddresses().call();
    
    campaignAddress = campaignAddresses[0];
    campaignAddress2 = campaignAddresses[1];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
    campaign2 = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress2);
});

describe('Campaigns', () => {
    it('deployed a factory and campaigns', async () => {
        assert.ok(factory._address);
        assert.ok(campaign._address);
        assert.ok(campaign2._address);
    });

    // const manager = await campaign.methods.manager().call();
});