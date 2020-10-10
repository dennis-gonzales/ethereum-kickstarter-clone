import Web3 from 'web3';

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    // in the browser and metamask is running
    window.ethereum.enable();
    web3 = new Web3(window.web3.currentProvider);
} else {
    // in the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/109705d448d6470792529a46e8e40e28'
    );
    web3 = new Web3(provider);
}

export default web3;