import sizeMe from 'react-sizeme';
import React from 'react'


class Header extends React.Component {
  render() {
    const { width, height } = this.props.size;
    const numCols = 3
    let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
    let style ={
		'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', marginRight: 6, cursor: 'pointer', fontWeight: 'bold'},
		'h4': {fontFamily: 'VT323', display:'inline'},
        'menu': {fontFamily: 'VT323', float: 'left', margin: "6 0 0"},
		'container': {
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
    	style.h1.marginRight = 0
    	style.h1.fontSize = 36
    	style.h4.margin = '0 auto'
    	style.h4.display = 'block'
    	style.h4.fontSize = 12
        style.image.height = 24
        style.menu.fontSize = 10
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
                </div>
                <span style={style.menu}>Trends • People • Cause-and-effects • Maps | Annotated charts • Infographics • Comic strips • Slide shows • Movies • Articles</span>
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
    onClick: React.PropTypes.func
}

export default sizeMe({ monitorWidth: true })(Header);