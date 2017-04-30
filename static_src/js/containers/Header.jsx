import sizeMe from 'react-sizeme';
import React from 'react'
import axios from 'axios'
import Menu from './Sidebar'

class Header extends React.Component {
    constructor(){
        super()
        this.state={
            tags: [],
            isOpen: false
        }
    }
    componentDidMount(){
        axios
            .get('/api/links/tags')
            .then((response)=>{
                this.setState({
                    tags: response.data.results
                })
            })
    }

    isMenuOpen(state) {
        if (this.state.isOpen !== state.isOpen){
            this.setState({
                isOpen: state.isOpen
            })
        }
    };

    render() {
        const { width, height } = this.props.size;
        const numCols = 3
        let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
        let style ={
    		'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', marginRight: 6, cursor: 'pointer', fontWeight: 'bold'},
    		'h4': {fontFamily: 'VT323', display:'inline'},
            'menu': {fontFamily: 'VT323', float: 'left', margin: "6 0 0"},
            'burgerIcon': {display:'inline', float:'right', fontSize: 48, margin: '-6 0', cursor:'pointer', fontWeight: 'bold'},
    		'container': {
                paddingTop: 8,
                margin: '0 auto', 
                width: this.props.tagged ? this.props.columnWidth : headerWidth, 
                textAlign: 'left', 
                borderBottom: 'solid black 1px',
                paddingBottom: '30px'
            },
            'image': {height:36, marginRight: 6}
    	}
        if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth || this.props.tagged) {
        	style.container.width = width < this.props.columnWidth ? width : this.props.columnWidth
        	style.container.textAlign = 'center'
            style.container.paddingBottom = 12
        	style.h1.marginRight = 0
        	style.h1.fontSize = 36
        	style.h4.margin = '0 auto'
        	style.h4.display = 'block'
        	style.h4.fontSize = 12
            style.image.height = 24
            style.menu.fontSize = 10
            style.burgerIcon.fontSize = 30
            style.burgerIcon.margin = "-52 0"
        } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth && !this.props.tagged) {
        	style.container.width = this.props.columnWidth * 2 + 1 * this.props.gutterWidth
        }
        
        return (
        	<div>
        		<div style={style.container}>
                    <div>
        	    		<span style={style.h1} onClick={this.props.onClick}>
                            <img style={style.image} src={require('../../cat.jpg')} />
                            {this.props.title}
                        </span>

        	    		<span style={style.h4}>{this.props.subheader}</span>
                        <span style={style.burgerIcon} onClick={()=>this.setState({isOpen: !this.state.isOpen})}>&#9776;</span>
                        
                        <Menu 
                            tags={this.state.tags}
                            onFilterClick={this.onFilterClick}
                            isOpen={this.state.isOpen}
                            isMenuOpen={this.isMenuOpen.bind(this)}></Menu>
                    </div>
                    {
                        !(width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth || this.props.tagged) ?
                            <span style={style.menu}>
                            {
                                this.state.tags
                                    .filter((tag, key)=>{
                                        return tag[0] === 'Theme'
                                    })
                                    .map((tag,key)=>{
                                        if (key === 0) {
                                            return tag[1]
                                        } else {
                                            return ' • ' + tag[1]
                                        }
                                    })
                            } 
                            <span> | </span>
                            {
                                this.state.tags
                                    .filter((tag, key)=>{
                                        return tag[0] === 'Genre'
                                    })
                                    .map((tag,key)=>{
                                        if (key === 0) {
                                            return tag[1]
                                        } else {
                                            return ' • ' + tag[1]
                                        }
                                    })
                            } 
                            </span>
                            : null
                    }
                    
    	    	</div>
        	</div>
        	
         
        );
    }
}

Header.propTypes = {
	title: React.PropTypes.string,
	subheader: React.PropTypes.string,
	columnWidth: React.PropTypes.number,
	gutterWidth: React.PropTypes.number,
    tagged: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onFilterClick: React.PropTypes.func,
    isOpen: React.PropTypes.bool
}

export default sizeMe({ monitorWidth: true })(Header);