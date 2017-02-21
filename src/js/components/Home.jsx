import React from 'react';
import StackGrid from 'react-stack-grid';

const style={
	key1: {
		background:'yellow',
		height: 100
	},
	key2: {
		background: 'blue',
		height: 100
	},
	key3: {
		background: 'brown',
		height: 100
	}
}

export default React.createClass({
  render: function () {
    return (
    	<div style={{textAlign:'center'}}>
			<StackGrid 
				columnWidth="33.333%" 
				gutterWidth={12} 
				gutterHeight={6}>
				<div key="key1" style={style.key1}></div>
				<div key="key2" style={style.key2}></div>
				<div key="key3" style={style.key3}></div>
			</StackGrid>
      	</div>
    );
  }
});
