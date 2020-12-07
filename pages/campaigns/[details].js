import React, { Component } from 'react';
import { Grid, Card, Message, Button, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import Contribute from '../../components/Contribute';
import Link from 'next/link';

class CampaignDetails extends Component {

    render = () => {
        const { serverError, httpError } = this.props;
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
            campaignAddress,
            errorMessage

        } = this.props;

        if (serverError) {
            return <h1>Error {httpError}</h1>;
        }

        if (!web3.utils.isAddress(manager)) {
            return ('Invalid link or data doesn\'t exist');
        }

        const summary = [
            {
                header: '[' + manager.substring(0, 7) + ']',
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            },
        ];

        return(
            <Layout>
                <Grid centered>
                    <Grid.Row></Grid.Row>
                    
                    <Grid.Row>
                        <h1>Campaign Details</h1>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column largeScreen={10} mobile={16}>
                            <Card.Group itemsPerRow={2} items={errorMessage ? [] : summary} />
                        </Grid.Column>

                        <Grid.Column largeScreen={6} mobile={16}>
                            <Contribute campaignAddress={campaignAddress} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Link className='center' href={`/campaigns/requests/${campaignAddress}`}>
                            <a>
                                <Button primary animated>
                                    <Button.Content visible>VIEW CAMPAIGN EXPENSES</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='arrow right' />
                                    </Button.Content>
                                </Button>
                            </a>
                        </Link>
                    </Grid.Row>
                </Grid>

                <Message icon='remove'
                    className={'error ' + (errorMessage ? 'visible' : 'hidden')}
                    header='Whooops! Stop right there.' content={errorMessage} />

            </Layout>
        );
    }
}

export const getServerSideProps = async (context) => {
    const { details } = context.query;

    const address = details;
    
    if (!web3.utils.isAddress(address)) {
        return {
            props: {
                serverError: true,
                httpError: 404
            },
        }
    }

    try {
        const campaign = Campaign(address);
        const summary = await campaign.methods.getSummary().call();

        return {
            props: {
                campaignAddress: address,
                minimumContribution: summary[0],
                balance: summary[1],
                requestsCount: summary[2],
                approversCount: summary[3],
                manager: summary[4]
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

export default CampaignDetails;