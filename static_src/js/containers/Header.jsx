import sizeMe from 'react-sizeme';
import React from 'react'
import axios from 'axios'
import Sidebar from './Sidebar'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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

    renderHeader(width) {
        let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
        let style ={
            'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', marginRight: 6, cursor: 'pointer', fontWeight: 'bold'},
            'h4': {fontFamily: 'VT323', display:'inline'},
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
        let key = 2
        if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth || this.props.tagged) {
            style.h1.marginRight = 0
            style.h1.fontSize = 36
            style.h4.margin = '0 auto'
            style.h4.display = 'block'
            style.h4.fontSize = 12
            style.image.height = 24
            style.burgerIcon.fontSize = 30
            style.burgerIcon.margin = "-52 0"
            key=0
        } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth && !this.props.tagged) {
            key=1
        }
        return (<div key={key}><span style={style.h1} onClick={this.props.onClick}>
                        <img style={style.image} src={require('../../cat.jpg')} />
                        {this.props.title}
                    </span>

                    <span style={style.h4}>{this.props.subheader}</span>
                    <span style={style.burgerIcon} onClick={()=>this.setState({isOpen: !this.state.isOpen})}>&#9776;</span>
                    </div>)
    }

    onFilterClick(tag) {
        this.props.onFilterClick(tag);
        this.setState({
            isOpen: false
        })
    }

    renderHeaderMenu(width) {
        const style={fontFamily: 'VT323', float: 'left', margin: "6 0 0"}
        if (!(width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth || this.props.tagged)) {
            return (<span key={0} style={style}>
                    {
                        this.props.themes.map((tag,key)=>{
                                if (key === 0) {
                                    return <span style={{cursor: 'pointer'}} key={key} onClick={()=>this.onFilterClick(tag)}>{tag}</span>
                                } else {
                                    return <span style={{cursor: 'pointer'}} key={key}> • <span onClick={()=>this.onFilterClick(tag)}>{tag}</span></span>
                                }
                            })
                    } 
                    <span> | </span>
                    {
                        this.props.genres.map((tag,key)=>{
                                if (key === 0) {
                                    return <span style={{cursor: 'pointer'}} key={key} onClick={()=>this.onFilterClick(tag)}>{tag}</span>
                                } else {
                                    return <span style={{cursor: 'pointer'}} key={key}> • <span onClick={()=>this.onFilterClick(tag)}>{tag}</span></span>
                                }
                            })
                    } 
                    </span>)
        }
        return null;
    }

    render() {
        const { width, height } = this.props.size;
        const numCols = 3
        let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
        
        const containerStyle={
            paddingTop: 8,
            margin: '0 auto', 
            width: this.props.tagged ? this.props.columnWidth : headerWidth, 
            textAlign: 'left', 
            borderBottom: 'solid black 1px',
            paddingBottom: '30px'
        }
        if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth || this.props.tagged) {
            containerStyle.width = width < this.props.columnWidth ? width : this.props.columnWidth
            containerStyle.textAlign = 'center'
            containerStyle.paddingBottom = 12
        } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth && !this.props.tagged) {
            containerStyle.width = this.props.columnWidth * 2 + 1 * this.props.gutterWidth
            containerStyle.paddingBottom = 8
        }
        return (
        	<div>
        		<div style={containerStyle}>
                    <div>
                        <CSSTransitionGroup
                          transitionName="example"
                          transitionEnterTimeout={400}
                          transitionLeave={false}>
                      
                        {
                            this.renderHeader(width)
                        }
                        </CSSTransitionGroup>
                        <Sidebar 
                            tags={this.state.tags}
                            onFilterClick={this.onFilterClick.bind(this)}
                            isOpen={this.state.isOpen}
                            isMenuOpen={this.isMenuOpen.bind(this)}
                            themes={this.props.themes}
                            genres={this.props.genres}></Sidebar>
                    </div>
                    <CSSTransitionGroup
                      transitionName="example"
                      transitionEnterTimeout={400}
                      transitionLeave={false}>
                  
                    {
                        this.renderHeaderMenu(width)
                    }
                    </CSSTransitionGroup>
                    
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
    isOpen: React.PropTypes.bool,
    genres: React.PropTypes.array,
    themes: React.PropTypes.array
}

export default sizeMe({ monitorWidth: true })(Header);