import React from 'react';
import axios from 'axios';
import BurgerMenu from 'react-burger-menu';
const Menu = BurgerMenu['slide']

const styles = {
    bmBurgerButton: {
        width: '36px',
        height: '30px',
        position: 'relative'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px',
        color: 'black'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: 'white',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em',
        zIndex: 100,
        textAlign: 'left'
    },
    bmMenuWrap: {
        zIndex: 99
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: 'black',
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
};

class Sidebar extends React.Component {
	render(){
		return (
            <div id='outer-container' style={{position: 'fixed', top: 0, left: 0}}>

    			<Menu 
                    customBurgerIcon={false}
                    isOpen={this.props.isOpen}
                    pageWrapId={'home'} 
                    outerContainerId={'container'}
                    styles={styles} 
                    onStateChange={this.props.isMenuOpen}>
                    {
                        this.props.tags
                            .filter((tag, key)=>{
                                return tag[0] === 'Theme'
                            })
                            .map((tag,key)=>{
                                return (<a 
                                    className="menu-item"
                                    id={tag[1]}
                                	key={key}
                                	onClick={()=>this.props.onFilterClick(tag[1])}>
                                	{tag[1]}</a>)
                            })
                    } 
                    <hr />
                    {
                        this.props.tags
                            .filter((tag, key)=>{
                                return tag[0] === 'Genre'
                            })
                            .map((tag,key)=>{
                                return (<a 
                                    className="menu-item"
                                    id={tag[1]}
                                	key={key}
                                	onClick={()=>this.props.onFilterClick(tag[1])}>
                                	{tag[1]}</a>)
                            })
                    }
    			</Menu>
            </div>)
	}
}

Sidebar.propTypes = {
	tags: React.PropTypes.array,
	onFilterClick: React.PropTypes.func,
    isOpen: React.PropTypes.bool,
    isMenuOpen: React.PropTypes.func
}

export default Sidebar;