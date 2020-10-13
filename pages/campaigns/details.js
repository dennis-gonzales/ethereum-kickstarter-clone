import React, { Component } from 'react';
import { Grid, Card, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import Contribute from '../../components/Contribute';

class CampaignDetails extends Component {

    render = () => {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager,
            errorMessage

        } = this.props;

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
                <h1>Campaign Details</h1>
                
                <Grid>
                    <Grid.Column stretched={false} largeScreen={10} mobile={16}>
                        <Card.Group itemsPerRow={2} items={errorMessage ? [] : summary} />
                    </Grid.Column>

                    <Grid.Column largeScreen={6} mobile={16}>
                        <Contribute />
                    </Grid.Column>
                </Grid>

                <Message icon='remove'
                    className={'error ' + (errorMessage ? 'visible' : 'hidden')}
                    header='Whooops! Stop right there.' content={errorMessage} />

            </Layout>
        );
    }
}

export const getServerSideProps = async (context) => {
    const address = context.query.address;

    if (web3.utils.isAddress(address)) {
        const campaign = Campaign(address);
        
        try {
            const summary = await campaign.methods.getSummary().call();

            return {
                props: {
                    minimumContribution: summary[0],
                    balance: summary[1],
                    requestsCount: summary[2],
                    approversCount: summary[3],
                    manager: summary[4]
                },
            }
        } catch(err) {
            console.error(err);
        }

        
    } else {
        return {
            props: {
                errorMessage: 'You shouldn\'t be here!\nAre you being redicted? report the issue at pro.gonzalesdennis@gmail.com'
            },
        }
    }
}

export default CampaignDetails;