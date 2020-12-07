import React, { Component } from 'react';
import { Table, Button, Dimmer, Loader, Segment } from 'semantic-ui-react';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

class RequestRow extends Component {

    state = {
        loading: false,
        success: false,
        error: false,
        successMessage: '',
        errorMessage: ''
    };

    onApprove = async () => {
        this.setState({ loading: true, error: false, successMessage: '', errorMessage: '' });

        try {
            const campaign = Campaign(this.props.campaignAddress);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });

            this.setState({ success: true, successMessage: 'Spending request has been successfully approved.' });

        } catch (err) {
            this.setState({ error: true, errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    onFinalize = async () => {
        this.setState({ loading: true, error: false, successMessage: '', errorMessage: '' });

        try {
            const campaign = Campaign(this.props.campaignAddress);

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });

            this.setState({ success: true,
                successMessage: `Spending request has been successfully finallized.
                Ether amounting to ${web3.utils.fromWei(this.request.value, 'ether')} has been to 
                ${request.recipient.substr(0, 10)}
                ...
                ${request.recipient.substr(32, request.recipient.length)}` });

        } catch (err) {
            this.setState({ loading: false });
        }
    };

    render = () => {
        const {
            Row,
            Cell
        } = Table;

        const {
            id,
            request,
            approversCount,
        } = this.props;

        const {
            loading,
            success,
            error,
            successMessage,
            errorMessage
        } = this.state;

        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row textAlign='center' disabled={request.complete} positive={readyToFinalize && !request.complete} title={readyToFinalize ? 'Spending request is now ready to be finalized' : ''}>
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

                    <Segment basic>
                        <Dimmer active={loading} inverted>
                            <Loader size='small' content='Loading' />
                        </Dimmer>
                        <Button positive={!request.complete} content='Approve' onClick={this.onApprove} />
                        <Button primary={!request.complete} content='Finalize' onClick={this.onFinalize} />
                    </Segment>
                    
                </Cell>

            </Row>
        );
    }
}

export default RequestRow;