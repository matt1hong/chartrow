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
			tweets: []
		}
		this.getImages('http://fivethirtyeight.com/features/'+
			'how-trumps-supreme-court-could-overturn-roe-v-wade-without-overturning-it/?ex_cid=story-twitter')
	}
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('connect', function() {
            socket.emit('connected', {data: 'I\'m connected!'});
        });
        socket.on('tweet', this.updateTweets.bind(this))
	}
	updateTweets(data) {
		this.setState({
			tweets: Array.concat(this.state.tweets, JSON.parse(data))
		})
	}
	getImages(link) {
		axios
			.get('/api/get_images?link='+link)
			.then((response) => {
				console.log(response)
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
								onClick={this.getImages.bind(this)}></TweetFeed>
						</td>
						<td style={style.td}>
							<ReactCrop src="https://www.smashingmagazine.com/wp-content/uploads/2016/10/inclusive-design-pattners-250px.png" />
						</td>
						<td style={style.td}>
						<GridList>
						<GridTile title='Sample'>
          <img src={'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg'} />
        </GridTile></GridList>
        </td>
						<td style={style.td}>
							<Feed feed="https://fivethirtyeight.com/politics/feed/" size="5" delay="60" />
						</td>
					</tr>
				</tbody>
			</table>
			</div>
			)
	}
}