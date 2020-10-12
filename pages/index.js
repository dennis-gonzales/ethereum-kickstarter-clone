import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import Layout from '../components/Layout';

class HomePage extends Component {

    state = {
        accounts: []
    };

    componentDidMount = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });
    }

    render = () => {
        return (
            <Layout>
                <div>
                    <h2>Hello World</h2>
                    <p>Factory Contract Addresses: {this.props.factoryContractAddress}</p>
                    <p>Campaign Addresses: {this.props.campaignAddresses[0]}</p>
                    <p>Account [0]: {this.state.accounts[0]}</p>
                </div>
            </Layout>
        );
    }
}

export const getServerSideProps = async () => {
    const factoryContractAddress = await factory._address;
    const campaignAddresses = await factory.methods.getCampaignsAddresses().call();

    return {
        props: {
            campaignAddresses,
            factoryContractAddress
        },
    }
}

export default HomePage;