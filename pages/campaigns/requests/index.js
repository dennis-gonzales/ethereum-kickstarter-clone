import { Link } from '../../../routes';
import React, { Component } from 'react';
import { Table, Button, Grid } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/table/RequestRow';

class RequestsIndex extends Component {

    render = () => {

        const {
            campaignAddress,
            approversCount,
            requests,
            serverError,
            httpError
        } = this.props;

        console.log(approversCount);
        console.log(requests);

        if (serverError) {
            return <h1>Error {httpError}</h1>;
        }

        const rows = requests.map((eachRequest, eachIndex) => {
            return (
                <RequestRow
                    key={eachIndex}
                    id={eachIndex}
                    request={eachRequest}
                    approversCount={approversCount}
                    campaignAddress={campaignAddress}
                />
            );
        });

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
                                <Button color='teal' content='CREATE SPENDING REQUEST' />
                            </a>
                        </Link>
                    </Grid.Row>

                    <Grid.Row>
                        <Table striped celled selectable>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell>Index</Table.HeaderCell>
                                    <Table.HeaderCell>Description</Table.HeaderCell>
                                    <Table.HeaderCell>Amount (Ether)</Table.HeaderCell>
                                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {rows}
                            </Table.Body>
                        </Table>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export const getServerSideProps = async (context) => {
    const { address } = context.query;

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
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );

        return {
            props: {
                campaignAddress: address,
                approversCount: approversCount,
                requests: JSON.parse(JSON.stringify(requests))
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