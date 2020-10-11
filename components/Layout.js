import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import react from 'react';
import Header from './Header';

const Layout = (props) => {
    return (
        <Container>
            <Header />
            {props.children}
        </Container>
    );
};

export default Layout;