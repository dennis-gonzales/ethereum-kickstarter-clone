import Web3 from 'web3';

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    // in the browser and metamask is running
    window.ethereum.enable();
    web3 = new Web3(window.web3.currentProvider);
} else {
    // in the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/f458482a8a4b4067b6632de99e52dc3d'
    );
    web3 = new Web3(provider);
}

export default web3;