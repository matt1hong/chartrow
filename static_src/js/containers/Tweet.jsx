import React from 'react';

const style= {
	td: {
		width: '50%'
	}
}

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

export default class Tweet extends React.Component {
	constructor() {
		super()
		console.log('adasdasdas')
	}
	render() {
		return (
			<span>{this.props.tweetId} </span>
			)
	}
}

Tweet.propTypes = {
	tweetId: React.PropTypes.string
}