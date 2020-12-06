import { Link } from '../../../routes';
import React, { Component } from 'react';
import { Table, Button, Grid, Segment, Header, Divider, Icon, Search } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/table/RequestRow';

class RequestsIndex extends Component {

    render = () => {

        const {
            campaignAddress,
            approversCount,
            requestCount,
            requests,
            serverError,
            httpError
        } = this.props;

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

                <Segment placeholder>
                    <Grid columns={2} stackable textAlign='center'>
                        <Divider vertical>Or</Divider>

                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column>
                            <Header icon>
                                <Icon name='search' />
                                Found {requestCount} requests.
                            </Header>

                            <Link route={`/campaigns/${campaignAddress}/requests/create`}>
                                <a>
                                    <Button color='teal' content='Create Spending Request' />
                                </a>
                            </Link>

                            </Grid.Column>

                            <Grid.Column>
                            <Header icon>
                                <Icon name='world' />
                                Create My Own Campaign
                            </Header>
                            <Link route='/campaigns/create'>
                                <a>
                                    <Button color='violet' content='Create Campaign' />
                                </a>
                            </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
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
                requestCount: requestCount,
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