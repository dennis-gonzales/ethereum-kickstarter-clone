import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';

class IndexCampaign extends Component {

    campaigns = this.props.campaignAddresses.map(eachAddress => {
        return {
            header: eachAddress,
            description: <a>View Campaign</a>,
            fluid: true
        };
    });

    render = () => {
        return (
            <Layout>
                <h1>All the Campaigns will show up here!</h1>
                <Button content='Create Campaign' floated='right' icon='add' primary />

                <Card.Group itemsPerRow={1} centered items={this.campaigns} />

            </Layout>
        );
    }
}

export const getServerSideProps = async () => {
    const campaignAddresses = await factory.methods.getCampaignsAddresses().call();

    return {
        props: { campaignAddresses },
    }
}

export default IndexCampaign;