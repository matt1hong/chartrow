import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import Feed from './RSSFeed';
import ReactCrop from 'react-image-crop'
import axios from 'axios'
import TweetFeed from './TweetFeed'

import 'react-image-crop/dist/ReactCrop.css';

const style= {
	td: {
		width: '50%'
	}
}

export default class Admin extends React.Component {
	constructor() {
		super()
		this.state= {
			tweets: [],
			imageLinks: []
		}
		this.updateTweets = this.updateTweets.bind(this)
	}
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('connect', function() {
            socket.emit('connected', {data: 'I\'m connected!'});
        });
        socket.on('tweet', this.updateTweets)
        this.getImages('http://fivethirtyeight.com/features/'+
			'how-trumps-supreme-court-could-overturn-roe-v-wade-without-overturning-it/?ex_cid=story-twitter')
		
	}
	updateTweets(data) {
		const tweet = JSON.parse(data)
		this.setState({
			tweets: Array.concat(this.state.tweets, JSON.parse(data))
		})
	}
	getImages(link) {
		this.setState({
			imageLinks: []
		})
		axios
			.get('/api/get_images?link='+encodeURIComponent(link))
			.then((response) => {
				this.setState({
					imageLinks: response.data.results
				})
			})
	}
	render() {
		return (
			<div style={{textAlign:'center'}}>
			<table style={{display:'inline-table', width:1200}}>
				<tbody>
					<tr>
						<td style={style.td}>
							<TweetFeed 
								tweets={this.state.tweets}
								onSurf={this.getImages.bind(this)}></TweetFeed>
						</td>
						<td style={style.td}>
							<ReactCrop src="https://www.smashingmagazine.com/wp-content/uploads/2016/10/inclusive-design-pattners-250px.png" />
						</td>
						<td style={style.td}>
						<GridList>
							{ 
								this.state.imageLinks.map((link, k)=>(
									<GridTile key={k}>
										<img src={link} />
									</GridTile>	
								))
							}
        				</GridList>
        </td>
						<td style={style.td}>
							<Feed onSurf={this.getImages.bind(this)} feed="https://fivethirtyeight.com/politics/feed/" size="5" delay="60" />
						</td>
					</tr>
				</tbody>
			</table>
			</div>
			)
	}
}