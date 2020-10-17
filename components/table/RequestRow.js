import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class RequestRow extends Component {
    render = () => {
        const {
            Row,
            Cell
        } = Table;

        const {
            id,
            request,
            approversCount,
            campaignAddress
        } = this.props;

        return (
            <Row textAlign='center'>
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
                    <Button positive content='Approve' />
                    <Button negative content='Decline' />
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;