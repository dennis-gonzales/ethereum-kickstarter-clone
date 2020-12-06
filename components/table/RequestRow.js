import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class RequestRow extends Component {

    onApprove = async () => {
        const campaign = Campaign(this.props.campaignAddress);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.campaignAddress);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    render = () => {
        const {
            Row,
            Cell
        } = Table;

        const {
            id,
            request,
            approversCount
        } = this.props;

        return (
            <Row textAlign='center' disabled={request.complete}>
                <Cell>{id}</Cell>
                
                <Cell>{request.description}</Cell>

                <Cell>{web3.utils.fromWei(request.value, 'ether')} ETH</Cell>
                
                <Cell>
                    {request.recipient.substr(0, 10)}
                    ...
                    {request.recipient.substr(32, request.recipient.length)}
                </Cell>
                
                <Cell>{request.approvalCount}/{approversCount}</Cell>

                <Cell>
                    <Button positive={!request.complete} content='Approve' onClick={this.onApprove} />
                    <Button primary={!request.complete} content='Finalize' onClick={this.onFinalize} />
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;