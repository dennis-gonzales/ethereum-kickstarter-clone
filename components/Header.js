import react, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class Header extends Component {

    menus = [
        { id: 'menu-home', value: 'Home' },
        { id: 'menu-campaigns', value: 'Campaigns' },
        { id: 'menu-create-campaign', value: '+' },
    ];

    state = {
        activeItem: this.menus[0].id
     };

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
    }

    render = () => {
        const { activeItem } = this.state;
        
        return (
            <div>
                <Menu pointing>
                    <Menu.Item
                        content={this.menus[0].value}
                        name={this.menus[0].id}
                        active={activeItem === this.menus[0].id}
                        onClick={this.handleItemClick}
                    />
                    
                    <Menu.Menu position='right'>
                        <Menu.Item
                            content={this.menus[1].value}
                            name={this.menus[1].id}
                            active={activeItem === this.menus[1].id}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            content={this.menus[2].value}
                            name={this.menus[2].id}
                            active={activeItem === this.menus[2].id}
                            onClick={this.handleItemClick}
                        />
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default Header;