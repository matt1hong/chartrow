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
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('connect', function() {
            socket.emit('connected', {data: 'I\'m connected!'});
        });
		socket.on('tweet', function (data) {
			console.log(data)
		});
	}
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