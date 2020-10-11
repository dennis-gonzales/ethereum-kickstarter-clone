import { Link } from '../../routes';
import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';

class IndexCampaign extends Component {

    campaigns = this.props.campaignAddresses.map(eachAddress => {
        return {
            header: eachAddress,
            description: (
                <Link route={`/campaigns/${eachAddress}`}>
                    <a>View Campaign</a>
                </Link>
            ),
            fluid: true
        };
    });

    render = () => {
        return (
            <Layout>
                <h1>All the Campaigns will show up here!</h1>

                <Link route='/campaigns/create'>
                    <a><Button primary
                        content='Create Campaign'
                        floated='right'
                        icon='add'
                    /></a>
                </Link>

                <Card.Group centered
                itemsPerRow={1} 
                items={this.campaigns} />

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