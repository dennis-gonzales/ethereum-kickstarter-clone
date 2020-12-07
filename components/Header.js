import Link from 'next/link';
import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class Header extends Component {

    menus = [
        { id: 'menu-home', value: 'Home', route: '/' },
        { id: 'menu-campaigns', value: 'Campaigns', route: '/campaigns' },
        { id: 'menu-campaigns-create', value: '+', route: '/campaigns/create' },
    ];

    render = () => {
        return (
            <div>
                <Menu pointing style={{ marginTop: '10px' }}>
                    <Link href={this.menus[0].route}>
                        <a className='item'>{this.menus[0].value}</a>
                    </Link>
                    
                    <Menu.Menu position='right'>
                        <Link href={this.menus[1].route}>
                            <a className='item'>{this.menus[1].value}</a>
                        </Link>

                        <Link href={this.menus[2].route}>
                            <a className='item'>{this.menus[2].value}</a>
                        </Link>
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

export default Header;