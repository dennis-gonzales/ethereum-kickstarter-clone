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

        this.setState({ loading: true, error: false, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send ({ from: accounts[0] });

            this.setState({ success: true, recipient: '', value: '', description: '' });

        } catch (err) {
            this.setState({ error: true, errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onCancel = (e) => {
        console.log('Cancelled');
        Router.push('/'); // TODO: takes time. do a loading screen
    }

    saveRecipientOnChange = (e) => {
        this.setState({
            recipient: e.target.value,
            error: false,
            errorMessage: ''
        });
    }

    saveValueOnChange = (e) => {
        this.setState({
            value: e.target.value,
            error: false,
            errorMessage: ''
        });
    }

    saveDescriptionOnChange = (e) => {
        this.setState({
            description: e.target.value,
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
                                        <Input action={{
                                            color: 'orange', labelPosition: 'left',
                                            icon: 'copy', content: 'Recipient',
                                        }}
                                            type='address' placeholder='Enter recipient address'
                                            value={recipient} onChange={event => this.saveRecipientOnChange(event)} />

                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field required>
                                        <Input action={{
                                            color: 'blue', labelPosition: 'left',
                                            icon: 'ethereum', content: 'Ether',
                                        }}
                                            type='number' placeholder='Enter amount to send'
                                            value={value} onChange={event => this.saveValueOnChange(event)} />
                                    </Form.Field>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Field required>
                                        <Form.TextArea label='Description'
                                            placeholder='Enter spending description...'
                                            value={description} onChange={event => this.saveDescriptionOnChange(event)} />
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
                                            content='You have successfuly created a spending request' />

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