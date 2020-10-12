import React, { Component } from 'react';
import { Reveal, Card, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class CampaignDetails extends Component {

    render = () => {
        const {
            minimumContribution,
            balance,
            requestCount,
            approversCount,
            manager,
            errorMessage

        } = this.props;

        const summary = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The one who created the campaign to support their creation',
                fluid: true
            },
            {
                header: balance,
                meta: 'Balance of the Campaign',
                description: 'Total money available for withdrawal',
                fluid: true
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution',
                description: 'Required amount of ether to be considered as an approver',
                fluid: true
            },

        ];

        return(
            <Layout>
                <h1>Campaign Details</h1>
                
                <Card.Group itemsPerRow={2} items={errorMessage ? [] : summary} />

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
                    requestCount: summary[2],
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