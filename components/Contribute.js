import React, { Component } from 'react';
import { Form, Input, Message } from 'semantic-ui-react';

class Contribute extends Component {

    render = () => {
        return (
            <Form success>
                <Form.Field>
                    <Input type="number" min={1} 
                        label={{ basic: true, content: 'Wei' }} labelPosition='right'
                        placeholder="Enter Contribution" />
                </Form.Field>

                <Message
                    success
                    icon='check circle outline'
                    header='Transaction completed'
                    content='Creation of the campaign is successful!' />
            </Form>
        );
    }
}

export default Contribute;