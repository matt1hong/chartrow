import sizeMe from 'react-sizeme';
import React from 'react'


class Header extends React.Component {
  render() {
    const { width, height } = this.props.size;
    const numCols = 3
    let style ={
		'h1': {fontFamily: 'VT323', fontSize: 60, display:'inline', marginRight: 12},
		'h2': {fontFamily: 'VT323', fontSize: 18, display:'inline'}
	}
    let headerWidth = this.props.columnWidth * 3 + 2 * this.props.gutterWidth;
    if (width < this.props.columnWidth * 2 + 1 * this.props.gutterWidth) {
    	headerWidth = this.props.columnWidth
    } else if (width < this.props.columnWidth * 3 + 2 * this.props.gutterWidth) {
    	headerWidth = this.props.columnWidth * 2 + 1 * this.props.gutterWidth
    }
    
    return (
    	<div>
    		<div style={{margin: '0 auto', width: headerWidth, textAlign: 'left'}}>
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