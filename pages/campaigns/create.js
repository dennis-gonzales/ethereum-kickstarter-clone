import { Router } from '../../routes';
import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CreateCampaign extends Component {

    state = {
        minimumContribution: 0,
        loading: false,
        success: false,
        error: false,
        errorMessage: ''
    };

    onSubmit = async (event) => {
        const { minimumContribution } = this.state;
        
        this.setState({ loading: true, success: false, error: false, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minimumContribution)
                .send({ from: accounts[0] });

            this.setState({ success: true, minimumContribution: 0 });

        } catch (err) {
            this.setState({ error: true, errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    saveValueOnChange = (event) => {
        this.setState({ 
            minimumContribution: event.target.value,
            error: false,
            errorMessage: ''
        });
    }

    render = () => {
        const { loading, success, error, errorMessage, minimumContribution } = this.state;

        return(
            <Layout>
                <h3>Create your own campaign</h3>

                <Form onSubmit={this.onSubmit}
                    loading={loading}
                    success={success}
                    error={error}>

                    <Form.Field>
                        <div className="ui action input">
                            <Button content='Save Campaign' labelPosition='right'
                                color='black' icon='ethereum' />
                                
                            <Input type="number" min={1} value={minimumContribution}
                                onChange={event => this.saveValueOnChange(event) }
                                label={{ basic: true, content: 'Wei' }} labelPosition='right'
                                placeholder="Minimum contribution in Wei"
                                error={error} />
                        </div>
                    </Form.Field>

                    <Message
                        success
                        icon='check circle outline'
                        header='Transaction completed'
                        content='Creation of the campaign is successful!' />

                    <Message
                        error
                        icon='remove'
                        header='Hold your horses!'
                        content={errorMessage} />

                </Form>
            </Layout>
        );
    }
}

export default CreateCampaign;