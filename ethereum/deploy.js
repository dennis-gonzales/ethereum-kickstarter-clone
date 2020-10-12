const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'mouse indoor tragic ridge broom small accident prison ridge midnight indoor body',
    'https://rinkeby.infura.io/v3/f458482a8a4b4067b6632de99e52dc3d'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode }) // add bytecode
        .send({ from: accounts[0] }); // remove gas

    console.log('Contract deployed to: ', result._address);
};

deploy(); // TODO: fix - doesn't quit the terminal