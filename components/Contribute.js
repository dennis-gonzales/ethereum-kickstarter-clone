import React, { Component } from 'react';
import { Form, Input, Button, Message, Label, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

class Contribute extends Component {

    state = {
        loading: false,
        success: false,
        error: false,
        contribution: '',
        errorMessage: ''
    };

    onSubmit = async (event) => {
        const { campaignAddress } = this.props;

        const { contribution } = this.state;

        this.setState({ loading: true, success: false, error: false, errorMessage: '' });

        try {
            const campaign = Campaign(campaignAddress);
            const accounts = await web3.eth.getAccounts();
            const contributionInWei = web3.utils.toWei(contribution, 'ether')

            await campaign.methods.contribute().send({
                value: contributionInWei,
                from: accounts[0] 
            });

            this.setState({ success: true, contribution: '' });

            setTimeout(() => Router.pushRoute(`/campaigns/${campaignAddress}`), 3000);

        } catch (err) {
            this.setState({ error: true, errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    saveValueOnChange = (event) => {
        this.setState({
            contribution: event.target.value,
            success: false,
            error: false,
            errorMessage: ''
        });
    }

    render = () => {
        const { loading, success, error, errorMessage, contribution } = this.state;
        const { campaignAddress } = this.props;

        return (
            <div>
                <Label color='blue' image style={{ marginBottom: '10px' }}>
                    <Icon name='address book' />
                    {campaignAddress.substr(0, 10)}...{campaignAddress.substr(32, campaignAddress.length)}
                <Label.Detail>Campaign Address</Label.Detail>
                </Label>

                <Form onSubmit={this.onSubmit}
                    loading={loading}
                    success={success}
                    error={error}>
                    <Form.Field>
                        <div className="ui action input">
                            <Button content='Contribute' labelPosition='right'
                                color='red' icon='ethereum' />

                            <Input type="number" value={contribution}
                                onChange={event => this.saveValueOnChange(event)}
                                label={{ basic: true, content: 'Ether' }} labelPosition='right'
                                placeholder="Enter contribution"
                                error={error} />
                        </div>
                    </Form.Field>

                    <Message
                        success
                        icon='check circle outline'
                        header='Transaction completed'
                        content='You have successfuly contributed to this Campaign!
                            page will reload in 3 seconds...' />

                    <Message
                        error
                        icon='remove'
                        header='Hold your horses!'
                        content={errorMessage} />
                </Form>
            </div>
        );
    }
}

export default Contribute;