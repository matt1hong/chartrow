import sizeMe from 'react-sizeme';
import React from 'react'


class Header extends React.Component {
  render() {
    const { width, height } = this.props.size;
    const numCols = 3
    let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
    let style ={
		'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', margin: '0 6', cursor: 'pointer'},
		'h4': {fontFamily: 'VT323', display:'inline'},
		'container': {
            margin: '0 auto', 
            width: this.props.tagged ? this.props.columnWidth : headerWidth, 
            textAlign: 'left', 
            borderBottom: 'solid black 1px',
            paddingBottom: '12px'
        }
	}
    if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth || this.props.tagged) {
    	style.container.width = width < this.props.columnWidth ? width : this.props.columnWidth
    	style.container.textAlign = 'center'
    	style.h1.margin = '0 auto'
    	style.h1.marginRight = null
    	style.h1.fontSize = 30
    	style.h1.display = 'block'
    	style.h4.margin = '0 auto'
    	style.h4.display = 'block'
    	style.h4.fontSize = 12
    } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth && !this.props.tagged) {
    	style.container.width = this.props.columnWidth * 2 + 1 * this.props.gutterWidth
    }
    
    return (
    	<div>
    		<div style={style.container}>
                <img style={{height:35}} src={require('../../cat.jpg')} />
	    		<h1 style={style.h1} onClick={this.props.onClick}>{this.props.title}</h1>
	    		<h4 style={style.h4}>{this.props.subheader}</h4>
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