import sizeMe from 'react-sizeme';
import React from 'react'


class Header extends React.Component {
  render() {
    const { width, height } = this.props.size;
    const numCols = 3
    let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
    let style ={
		'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', marginRight: 12},
		'h2': {fontFamily: 'VT323', fontSize: 18, display:'inline'},
		'container': {
            margin: '0 auto', 
            width: headerWidth, 
            textAlign: 'left', 
            borderBottom: 'solid black 1px',
            paddingBottom: '12px'
        }
	}
    if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth) {
    	style.container.width = width < this.props.columnWidth ? width : this.props.columnWidth
    	style.container.textAlign = 'center'
    	style.h1.margin = '0 auto'
    	style.h1.marginRight = null
    	style.h1.fontSize = 30
    	style.h1.display = 'block'
    	style.h2.margin = '0 auto'
    	style.h2.display = 'block'
    	style.h2.fontSize = 12
    } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth) {
    	style.container.width = this.props.columnWidth * 2 + 1 * this.props.gutterWidth
    }
    
    return (
    	<div>
    		<div style={style.container}>
	    		<h1 style={style.h1}>{this.props.title}</h1>
	    		<h2 style={style.h2}>{this.props.subheader}</h2>
	    	</div>
    	</div>
    	
     
    );
  }
}

Header.propTypes = {
	title: React.PropTypes.string,
	subheader: React.PropTypes.string,
	columnWidth: React.PropTypes.number,
	gutterWidth: React.PropTypes.number
}

export default sizeMe({ monitorWidth: true })(Header);