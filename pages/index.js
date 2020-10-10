import React, { Component } from 'react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import useSWR from 'swr';

class HomePage extends Component {

    componentDidMount = async () => {
        // console.log('componentDidMount');
        // const accounts = await web3.eth.getAccounts();
        // console.log(accounts);
        // this.setState({ accounts });
    }

    render() {        
        return (
            <div>
                <h2>Hello World</h2>
                <p>Factory Contract Addresses: {this.props.factoryContractAddress}</p>
                <p>Campaign Addresses: {this.props.campaignAddresses[0]}</p>
                <p>Account [0]: {this.props.accounts}</p>
            </div>
        );
    }
}

export const getServerSideProps = async () => {
    const factoryContractAddress = await factory._address;
    const campaignAddresses = await factory.methods.getCampaignsAddresses().call();
    const accounts = await web3.eth.getAccounts();

    return {
        props: {
            campaignAddresses,
            factoryContractAddress,
            accounts
        },
    }
}

// export function Profile() {
  
// }

export default HomePage;