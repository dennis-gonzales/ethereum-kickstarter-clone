import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react'
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';

class IndexCampaign extends Component {

    renderCampaigns = () => {
        const items = this.props.campaignAddresses.map(eachAddress => {
            return {
                header: eachAddress,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });

        return <Card.Group itemsPerRow={1} centered items={items} />
    }

    render = () => {
        return (
            <Layout>
                <h1>All the Campaigns will show up here!</h1>
                <Button content='Create Campaign' floated='right' icon='add' primary />
                <div>{this.renderCampaigns()}</div>
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