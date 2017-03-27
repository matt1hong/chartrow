import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton'
import Feed from './RSSFeed';
import ReactModal from 'react-modal'
import axios from 'axios'
import TweetFeed from './TweetFeed'
import PostIt from './PostIt'
import {Tabs, Tab} from 'material-ui/Tabs';

const style= {
	td: {
		home: {
			width: '50%',
			verticalAlign: 'top',
			padding: 6
		},
		modal: {
			textAlign: 'center'
		}
	}
}

export default class Admin extends React.Component {
	constructor() {
		super()
		this.state= {
			tweets: [],
			existingPosts: [],
			imageLinks: [],
			count: 30,
			linkUrl: 'https://www.nytimes.com/interactive/2017/02/27/us/politics/most-important-problem-gallup-polling-question.html',
			openModal: false,
			confirmDelete: false
		}
		this.updateTweets = this.updateTweets.bind(this)
	}
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('tweet', this.updateTweets)
        this.setTweet(this.state.linkUrl)
        this.getExistingTweets()
        axios
        	.get('/api/tags')
        	.then((response) => {
				let tags = response.data.results

				this.setState({
					tags: tags
				})
			})
	}
	updateTweets(data) {
		if (Object.keys(data).length) {
			this.setState({
				tweets: [data].concat(this.state.tweets)
			})
		}
		
	}

	getLinks(){
		axios
			.get('/api/get_links')
			.then((response) => {
				this.setState({
					existingPosts: response.data.results
				})
			})
	}
	getExistingTweets(){
		axios
			.get(`/api/tweets?count=${this.state.count}`)
			.then((response) => {
				const results = response.data.results.filter((el) => {
					return Object.keys(el).length
				})
				this.setState({
					tweets: results
				})
			})
	}
	setTweet(link) {
		if (typeof(link) === 'string') {
			this.setState({
				imageLinks: [],
				linkUrl: link,
				timestamp: 0
			}, () => {this.getImages(link)})
		} else {
			this.setState({
				imageLinks: [],
				linkUrl: link.url,
				timestamp: link.timestamp_ms
			}, () => {this.getImages(link.url)})
		}
		console.log('settweet')
	}
	getImages(link) {
		axios
			.get('/api/get_images?link='+encodeURIComponent(this.state.linkUrl))
			.then((response) => {
				this.setState({
					imageLinks: response.data.results
				})
			})
		console.log('getimages')
	}
	setCropImage(src) {
		this.setState({
			openModal: true,
			cropImage: src
		})
	}

	deleteLink(){
		let posts = this.state.existingPosts;
		posts.splice(posts.indexOf(this.state.linkUrl), 1);
		console.log(posts)
		axios
			.post('/api/delete', {
				url: this.state.linkUrl
			})
			.then((response) => {
				this.setState({
					alert: 'Success!',
					existingPosts: posts
				})
			})
			.catch((e) => {
				this.setState({
					alert: e
				})
			})
	}

	onClose() {
		this.setState({
			openModal: false
		})
	}

	render() {
		return (
			<div style={{textAlign:'center'}}>
				<ReactModal isOpen={this.state.openModal} contentLabel="cropImage">
					<PostIt 
						linkUrl={this.state.linkUrl}
						imgSrc={this.state.cropImage}
						onClose={this.onClose.bind(this)}></PostIt>
				</ReactModal>
				<table style={{display:'inline-table', width:1200}}>
					<tbody>
						<tr>
							<td style={style.td.home}>
								<Tabs>
								    <Tab label="Twitter" >
									    <TweetFeed 
											tweets={this.state.tweets}
											onSurf={this.setTweet.bind(this)}></TweetFeed>
								   
								    </Tab>
								    <Tab 
								    	label="Published" 
								    	onActive={this.getLinks.bind(this)}>
								      <div>
								        <TweetFeed 
											tweets={this.state.existingPosts}
											onSurf={this.setTweet.bind(this)}
											delete={this.deleteLink.bind(this)}
											confirmDelete={this.state.confirmDelete}
											chosen={this.state.linkUrl}></TweetFeed>
								      </div>
								    </Tab>
								  </Tabs>
								
							</td>
							<td style={style.td.home}>
							<GridList style={{width: 450}} cols={3}>
								{ 
									this.state.imageLinks.map((link, k)=>(
										<GridTile key={k} >
											<img
												style={{height: "100%"}} 
												src={link} 
												onClick={(e) => this.setCropImage(e.target.src)} />
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