import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import react from 'react';
import Header from './Header';

const Layout = (props) => {
    return (
        <div>
            <Header />
            <Container>
                {props.children}
            </Container>
        </div>
    );
};

export default Layout;