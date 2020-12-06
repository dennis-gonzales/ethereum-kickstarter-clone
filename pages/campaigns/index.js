import { Link } from '../../routes';
import React, { Component } from 'react';
import { Grid, Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';

class IndexCampaign extends Component {

    render = () => {

        const { campaignAddresses } = this.props;

        const campaigns = campaignAddresses.map(eachAddress => {
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

        return (
            <Layout>
                <Grid centered>
                    <Grid.Row></Grid.Row>
                    
                    <Grid.Row>
                        <h1>Support the great Ideas!</h1>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column floated='right' width={3}>
                            <Link route='/campaigns/create'>
                                <a>
                                    <Button primary icon='add'
                                        content='Create Campaign' />
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Card.Group
                                itemsPerRow={2}
                                items={campaigns} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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