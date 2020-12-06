import { Link, Router } from '../../../routes';
import React, { Component } from 'react';
import { Button, Grid, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class CreateRequest extends Component {

    state = {
        recipient: '',
        value: '',
        description: '',
        errorMessage: '',
        loading: false,
        success: false,
        error: false
    };

    onSubmit = async (e) => {
        const { campaignAddress } = this.props;
        const { description, value, recipient } = this.state;

        const campaign = Campaign(campaignAddress);

        this.setState({ loading: true, error: false, description: '', errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send ({ from: accounts[0] });

            this.setState({ success: true, recipient: '', value: '', description: '' });

            setTimeout(() => Router.pushRoute(`/campaigns/${campaignAddress}/requests`), 3000);

        } catch (err) {
            this.setState({ error: true, errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onCancel = (e) => {
        this.setState({ loading: true });
        Router.pushRoute(`/campaigns/${this.props.campaignAddress}/requests`);
    }

    saveValueOnChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState ({
            [name]: value,
            error: false,
            errorMessage: ''
        });
    }

    render = () => {
        const { serverError, httpError } = this.props;

        if (serverError) {
            return <h1>Error {httpError}</h1>;
        }

        const {
            recipient, value, description,
            loading, success, error,
            errorMessage
        } = this.state;

        return (
            <Layout>
                <Grid centered>
                    <Grid.Row></Grid.Row>

                    <Grid.Row>
                        <h3>Create Spending Request</h3>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={8} textAlign='center'>
                            <Form widths='equal'
                                loading={loading}
                                success={success}
                                error={error} >

                                <Form.Group>
                                    <Form.Field required>
                                        <Input action={{ color: 'orange', labelPosition: 'left',
                                            icon: 'copy', content: 'Recipient', }}
                                            name='recipient'
                                            type='address' placeholder='Enter recipient address'
                                            value={recipient} onChange={this.saveValueOnChange} />

                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field required>
                                        <Input action={{ color: 'blue', labelPosition: 'left',
                                            icon: 'ethereum', content: 'Ether', }}
                                            name='value'
                                            type='number' placeholder='Enter amount to send'
                                            value={value} onChange={this.saveValueOnChange} />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field required>
                                        <Form.TextArea label='Description' name='description'
                                            placeholder='Enter spending description...'
                                            value={description} onChange={this.saveValueOnChange} />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field>
                                        <Button.Group>
                                            <Button onClick={this.onCancel} negative>Cancel</Button>
                                            <Button.Or />
                                            <Button onClick={this.onSubmit} positive>Save</Button>
                                        </Button.Group>
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field>
                                        <Message
                                            success
                                            icon='check circle outline'
                                            header='Transaction completed'
                                            content='You have successfuly created a spending request
                                                You will be redirected to your campaign in 3 seconds.'  />

                                        <Message
                                            error
                                            icon='remove'
                                            header='Hold your horses!'
                                            content={errorMessage} />
                                    </Form.Field>
                                </Form.Group>

                            </Form>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Layout>
        );
    }
}

export const getServerSideProps = async (context) => {
    const { address } = context.query;
    
    if (web3.utils.isAddress(address)) {
        return {
            props: {
                campaignAddress: address,
            },
        }
    } else {
        return {
            props: {
                serverError: true,
                httpError: 404
            },
        }
    }
}

export default CreateRequest;