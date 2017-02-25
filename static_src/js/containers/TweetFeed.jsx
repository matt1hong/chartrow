import React from 'react';
import Tweet from './Tweet'


const tweetData = {
  id: 'XXX',
  user: {
    name: 'XXX',
    screen_name: 'XXX',
    profile_image_url: 'XXX'
  },
  text: 'XXX',
  created_at: 'XXX',
  favorite_count: 'XXX',
  retweet_count: 'XXX',
  entities: {
    media: [],
    urls: [],
    user_mentions: [],
    hashtags: [],
    symbols: []
  } 
}

export default class TweetFeed extends React.Component {
	render() {
		return (
		      <div className="feedwidget widget">
		        <div className="widget-content">
		          <h2 ref="feed"> Twitter</h2>
		          <ul>
		            {this.props.tweets.map((x,k)=>
		            	x.entities.urls.length > 0 ?
			            	<a key={k} href={x.entities.urls[0].url} target="_blank">
						        <li className="feeditem">{x.text}</li>
						    </a>
						: null
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