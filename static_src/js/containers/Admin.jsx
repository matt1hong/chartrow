import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import Feed from './RSSFeed';
import ReactCrop from 'react-image-crop'
import ReactModal from 'react-modal'
import axios from 'axios'
import TweetFeed from './TweetFeed'
import InlineEdit from 'react-edit-inline'
import Chip from 'material-ui/Chip';
import {Tabs, Tab} from 'material-ui/Tabs';

import 'react-image-crop/dist/ReactCrop.css';

const style= {
	td: {
		home: {
			width: '50%',
			verticalAlign: 'top'
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
			cropImage: '',
			cropRatio: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			cropPixels: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			date: null,
			linkUrl: 'https://www.nytimes.com/interactive/2017/02/27/us/politics/most-important-problem-gallup-polling-question.html',
			openModal: false,
			lead: false,
			title: 'Enter title',
			tag: 'New tag',
			tags: [],
			timestamp: 0
		}
		this.updateTweets = this.updateTweets.bind(this)
	}
	componentDidMount() {
		var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on('tweet', this.updateTweets)
        this.getImages(this.state.linkUrl)
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
	handleDateChange(event, date) {
		if (date === this.state.date) {
			this.setState({date:null})
		} else {
			this.setState({date});
		}
	    
	};
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
	getImages(link) {
		if (typeof(link) === 'string') {
			this.setState({
				imageLinks: [],
				linkUrl: link,
				timestamp: 0
			})
		} else {
			this.setState({
				imageLinks: [],
				linkUrl: link.url,
				timestamp: link.timestamp_ms
			})
		}
		axios
			.get('/api/get_images?link='+encodeURIComponent(this.state.linkUrl))
			.then((response) => {
				this.setState({
					imageLinks: response.data.results
				})
			})
	}
	setCropImage(src) {
		this.setState({
			openModal: true,
			cropImage: src
		})
	}
	setCropSize(crop, pixelCrop) {
		this.setState({
			cropRatio: crop,
			cropPixels: pixelCrop
		})
	}
	promoteLink(){
		axios
			.post('/api/promote', {
				url: this.state.linkUrl,
				imgSrc: this.state.cropImage,
				cropPixels: this.state.cropPixels,
				lead: this.state.lead,
				title: this.state.title,
				tag: this.state.tag,
				realTimestamp: +this.state.date || this.state.timestamp
			})
			.then((response) => {
				this.setState({
					alert: 'Success!'
				})
				if (!(this.state.tag in this.state.tags)) {
					this.setState({
						tags: [this.state.tag].concat(this.state.tags)
					})
				}
			})
			.catch((e) => {
				this.setState({
					alert: e
				})
			})
	}
	deleteLink(){
		axios
			.post('/api/delete', {
				url: this.state.linkUrl
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
	titleChanged(data){
		this.setState(data)
	}
	tagChanged(data){
		this.setState(data)
	}
	tagSelected(event){
		this.setState({
			tag: event.target.innerText
		})
	}
    customValidateText(text) {
      return (text.length > 0 && text.length < 64);
    }
	render() {
		return (
			<div style={{textAlign:'center'}}>
			<ReactModal isOpen={this.state.openModal} contentLabel="cropImage">
				<table>
					<tbody>
						<tr>
							<td rowSpan="7">
								<ReactCrop 
								src={this.state.cropImage} 
								onComplete={this.setCropSize.bind(this)}
								/>
							</td>
							<td>
								<Checkbox
								      label="Lead article"
								      checked={this.state.lead}
								      onCheck={(event, checked) => {
								      	this.setState({
								      		lead: checked
								      	})
								      }}
								    />
							</td>
						</tr>
						<tr>
							<td>
								
									<InlineEdit
										validate={this.customValidateText}
										text={this.state.title}
										paramName="title"
										change={this.titleChanged.bind(this)}></InlineEdit>
							</td>
						</tr>
						<tr>
							<td>
								<InlineEdit
										validate={this.customValidateText}
										text={this.state.tag}
										paramName="tag"
										change={this.tagChanged.bind(this)}></InlineEdit>
							</td>
						</tr>
						<tr>
							<td>
								<div style={{
										flex:'wrap'
									}}>
										{this.state.tags.map((tag, key) => (
											<Chip key={key} onTouchTap={this.tagSelected.bind(this)}>{tag}</Chip>
										))}
									</div>
							</td>
						</tr>
						<tr>
							<td>
								<DatePicker 
									hintText="Custom publication date" 
									container="inline" 
									value={this.state.date}
        							onChange={this.handleDateChange.bind(this)}/>
							</td>
						</tr>
						<tr>
							<td>
								<RaisedButton
										label="Promote"
										onClick={this.promoteLink.bind(this)}></RaisedButton>
							</td>
						</tr>
						<tr>
							<td>
								<RaisedButton
									label="Close"
									onClick={() => {
										this.setState({
											openModal: false
										})
									}}></RaisedButton>
							</td>
						</tr>
					</tbody>
				</table>
			</ReactModal>
			<table style={{display:'inline-table', width:1200}}>
				<tbody>
					<tr>
						<td style={style.td.home} rowSpan="2">
							<Tabs>
							    <Tab label="Twitter" >
								      <TweetFeed 
									tweets={this.state.tweets}
									onSurf={this.getImages.bind(this)}></TweetFeed>
							   
							    </Tab>
							    <Tab 
							    	label="Item Two" 
							    	onActive={this.getLinks.bind(this)}>
							      <div>
							        <TweetFeed 
										tweets={this.state.existingPosts}
										onSurf={this.getImages.bind(this)}
										delete={this.deleteLink.bind(this)}></TweetFeed>
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