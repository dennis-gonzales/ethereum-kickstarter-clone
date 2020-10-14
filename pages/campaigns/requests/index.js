import { Link } from '../../../routes';
import React, { Component } from 'react';
import { Button, Grid, Menu } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web from '../../../ethereum/web3';

class RequestsIndex extends Component {

    render = () => {

        const { campaignAddress } = this.props;

        return (
            <Layout>
                <Grid centered>
                    <Grid.Row></Grid.Row>
                    
                    <Grid.Row>
                        <h3>Campaign Expenses</h3>
                    </Grid.Row>

                    <Grid.Row>
                        <Link route='campaign-spending-requests-create' params={{ address: campaignAddress }}>
                            <a>
                                <Button primary content='CREATE SPENDING REQUEST' />
                            </a>
                        </Link>
                    </Grid.Row>

                    <Grid.Row>
                        {/* TODO: Table goes here */}
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export const getServerSideProps = async (context) => {
    const { address } = context.query;
    const campaign = Campaign(address);

    try {
        // TODO: campaign backend calls
        return {
            props: {
                campaignAddress: address,
            },
        }
    } catch (err) {
        return {
            props: {
                errorMessage: err.message
            },
        }
    }
}

export default RequestsIndex;