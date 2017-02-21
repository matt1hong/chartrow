import React from 'react';
import Feed from './RSSFeed';

export default React.createClass({
	render: function() {
		return (
			<div style={{textAlign:'center'}}>
	    		<Feed feed="https://fivethirtyeight.com/politics/feed/" size="5" delay="60" />
        	</div>)
	}
})