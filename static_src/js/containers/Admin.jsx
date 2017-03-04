import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton'
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
			imageLinks: [],
			cropImage: '',
			cropSize: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			linkUrl: ''
		}
		this.updateTweets = this.updateTweets.bind(this)
		this.promoteLink = this.promoteLink.bind(this)
	}
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('connect', function() {
            socket.emit('connected', {data: 'I\'m connected!'});
        });
        socket.on('tweet', this.updateTweets)
        this.getImages('https://www.nytimes.com/interactive/2017/02/27/us/politics/most-important-problem-gallup-polling-question.html')
		
	}
	updateTweets(data) {
		const tweet = JSON.parse(data)
		this.setState({
			tweets: Array.concat(this.state.tweets, JSON.parse(data))
		})
	}
	getImages(link) {
		this.setState({
			imageLinks: [],
			linkUrl: link
		})
		axios
			.get('/api/get_images?link='+encodeURIComponent(link))
			.then((response) => {
				this.setState({
					imageLinks: response.data.results
				})
			})
	}
	setCropImage(src) {
		this.setState({
			cropImage: src
		})
	}
	promoteLink(){
		axios
			.post('/api/promote', {
				url: this.state.linkUrl,
				imgSrc: this.state.cropImage
			})
			.then((response) => {
				this.setState({
					alert: 'Success!'
				})
			})
			.catch((e) => {
				this.setState({
					alert: e
				})
			})
	}
	render() {
		return (
			<div style={{textAlign:'center'}}>
			<table style={{display:'inline-table', width:1200}}>
				<tbody>
					<tr>
						<td style={style.td} rowSpan="2">
							<TweetFeed 
								tweets={this.state.tweets}
								onSurf={this.getImages.bind(this)}></TweetFeed>
						</td>
						<td style={style.td}>
								<ReactCrop 
									src={this.state.cropImage} 
									crop={this.state.cropSize}
									onComplete={(crop, pixelCrop) => {
										this.setState({
											cropSize: pixelCrop
										})
									}}
									/>
						</td>
						<td style={style.td}>
								<RaisedButton
									label="Promote"
									onClick={this.promoteLink}></RaisedButton>
						</td>
						<td style={style.td}>
						<GridList>
							{ 
								this.state.imageLinks.map((link, k)=>(
									<GridTile key={k} >
										<img src={link} onClick={(e) => this.setCropImage(e.target.src)} />
									</GridTile>	
								))
							}
        				</GridList>
        				</td>
					</tr>
				</tbody>
			</table>
			</div>
			)
	}
}