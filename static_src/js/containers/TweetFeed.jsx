import React from 'react';
import Tweet from './Tweet'


export default class TweetFeed extends React.Component {
	render() {
		return (
		      <div className="feedwidget widget">
		        <div className="widget-content">
		          <h2 ref="feed"> Twitter</h2>
		          <ul>
		            {this.props.tweets.map((x,k)=>
		            	<span>{x.id} </span>
					)}
		          </ul>
		        </div>
		      </div>
		    )
	}
}

TweetFeed.propTypes = {
	tweets: React.PropTypes.array
}