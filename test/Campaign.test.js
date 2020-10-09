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

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    // account at [0] created the factory
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    // account at [1] created a campaign using the factory and is the manager
    await factory.methods.CreateCampaign('100')
        .send({ from: accounts[1], gas: '1000000' });

    // account at [2] created a campaign using the factory and is the manager
    await factory.methods.CreateCampaign('50000')
        .send({ from: accounts[2], gas: '1000000' });

    const campaignAddresses = await factory.methods.GetCampaignsAddresses().call();
    
    campaignAddress = campaignAddresses[0];
    campaignAddress2 = campaignAddresses[1];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
    campaign2 = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress2);
});

describe('Campaigns', () => {
    it('deployed a factory and campaigns', () => {
        assert.ok(factory._address);
        assert.ok(campaign._address);
        assert.ok(campaign2._address);
    });

    it('marks the creator of the campaign as manager', async () => {
        const manager = await campaign.methods.manager().call();
        const manager2 = await campaign2.methods.manager().call();

        assert(accounts[1] == manager);
        assert(accounts[2] == manager2);
    });
    it('can contribute and marks as approver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[0]
        });

        const isContributor = await campaign.methods.approvers(accounts[0]).call();
        assert(isContributor);
    });
    it('fails when contribution is below minimum', async () => {
        try {
            // do a [failing test] by sending a contribution below minimum
            await campaign.methods.contribute().send({
               value: 0,
               from: accounts[0] 
            });

        } catch(err) {
            // the test has failed -> [therefore it passed the test]
            assert(err);
            return;
        }
        // it passed the test -> [therefore the test has failed]
        assert(false);
    });
    it('allows manager to create a payment request', async () => {
        await campaign.methods.createRequest('For renting a Onee-san Girlfriend', 999999, accounts[3]).send({
            from: accounts[1],
            gas: '1000000'
        });

        await campaign.methods.createRequest('For renting a Senpai Girlfriend', 999999, accounts[3]).send({
            from: accounts[1],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        const request2 = await campaign.methods.requests(1).call();
        
        assert.strictEqual('For renting a Onee-san Girlfriend', request.description);
        assert.strictEqual('For renting a Senpai Girlfriend', request2.description);
    });
    it('proccess requests', async () => {
        // recipient balance before finalizing the spending request
        const oldRecipientBalance = await web3.eth.getBalance(accounts[3]);

        // account at [0](the owner of the factory) donated 10 ether to the campaign
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: accounts[0]
        });

        const approversCount = await campaign.methods.approversCount().call();
        assert.strictEqual('1', approversCount);

        // account at [1](the manager of the campaign) creates a spending request of 5 ether and send it to account at [3](The recipient)
        await campaign.methods.createRequest('THICC THIGS', web3.utils.toWei('5', 'ether'), accounts[3]).send({
            from: accounts[1],
            gas: '1000000'
        });

        // account at [0](the owner of the factory, and the donator of 10 ether) approves the spending request at index [0]
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();
        // TODO: get the boolean value(Approved if true) from the approvals mapping
        // const isApproved = await request.approvals[accounts[1]];

        assert.strictEqual('1', request.approvalCount);

        // account at [1](he manager of the campaign) finalizes the spending request and now the contract will send the ether to account at [3](The recipient)
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });
        
        // recipient balance after finalizing the spending request
        const newRecipientBalance = await web3.eth.getBalance(accounts[3]);

        // get the difference of the new and old balance to determine how much ether has sent
        const difference = web3.utils.fromWei(newRecipientBalance, 'ether') - web3.utils.fromWei(oldRecipientBalance, 'ether');

        // assert that the difference is greater that the sent ether diminished by 1(for gas)
        assert(parseFloat(difference) > '4');
    });
});