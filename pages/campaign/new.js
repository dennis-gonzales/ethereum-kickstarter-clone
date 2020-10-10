import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class NewCampaign extends Component {

    state = {
        minimumContribution: '0',
        errorMessage: ''
    };

    onSubmit = async (event) => {
        console.log('Hello World!');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)
                .send({ from: accounts[0] });

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    saveValueOnChange = (event) => {
        this.setState({ minimumContribution: event.target.value, errorMessage: '' });
    }

    render = () => {
        return(
            <Layout>
                <h3>Create your own campaign</h3>

                <Form error={this.state.errorMessage !== ''} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <div className="ui action input">
                            <Button content='Save Campaign' labelPosition='right'
                                color='black' icon='ethereum' />
                                
                            <Input type="number" min={1} value={this.state.minimumContribution}
                                onChange={event => this.saveValueOnChange(event) }
                                label={{ basic: true, content: 'Wei' }} labelPosition='right'
                                placeholder="Minimum contribution in Wei" />
                        </div>
                    </Form.Field>
                    <Message
                        error
                        header='Hold your horses!'
                        content={this.state.errorMessage}
                    />
                </Form>
            </Layout>
        );
    }
}

export default NewCampaign;