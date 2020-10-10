import react from 'react';
import { Menu } from 'semantic-ui-react';

const Header = () => {
    return (
        <Menu>
            <Menu.Item>
                Kickstarter Clone
            </Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;