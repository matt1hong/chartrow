import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Feed from './RSSFeed';
import Dialog from 'material-ui/Dialog';
import ReactModal from 'react-modal'
import axios from 'axios'
import TweetFeed from './TweetFeed'
import AdminNav from './AdminNav'
import PostIt from './PostIt'
import {Tabs, Tab} from 'material-ui/Tabs';
import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';


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
			imageLink: '',
			count: 30,
			linkUrl: '',
			openPostIt: false,
			openAddPhoto: false,
			confirmDelete: false,
			tags: [],
			addresses: [],
			connected: false,
			loaded: false,
			activeTab: 0
		}
		this.socket = null;
		this.updateTweets = this.updateTweets.bind(this)
	}
	componentDidMount() {
		axios
        	.get('/api/tags')
        	.then((response) => {
				let tags = response.data.results

				this.setState({
					tags: tags
				})
			})
		this.getExistingTweets('Recents')
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.activeTab === 0 && this.state.activeTab !== 0) {
			this.getExistingTweets('Recents');
		}
	}
	startFeed() {
		this.socket = io.connect('http://' + document.domain + ':' + location.port);
        this.socket.on('tweet', this.updateTweets)
        this.socket.on('connect', ()=>{this.setState({connected: true})});
        this.socket.on('disconnect', ()=>{this.setState({connected: false})});
	}
	endFeed() {
		this.socket ? this.socket.disconnect() : null;
	}
	updateTweets(data) {
		if (Object.keys(data).length) {
			this.setState({
				tweets: this.state.tweets.concat([data])
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
	getExistingTweets(type){
		if (type.toLowerCase() === 'likes') {
			this.endFeed();
		} else if (type.toLowerCase() === 'recents') {
			this.startFeed();
		}
		axios
			.get(`/api/tweets?type=${type}&count=${this.state.count}`)
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
	}
	getImages(link) {
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
			openPostIt: true,
			cropImage: src
		})
	}

	deleteLink(){
		let posts = this.state.existingPosts;
		posts.splice(posts.map((el)=>el.url).indexOf(this.state.linkUrl), 1);
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
			openPostIt: false,
			openAddPhoto: false
		})
	}

	onChange(v) {
		this.setState({
			'addresses': v
		})
	}

	getContent() {
		this.setState({loaded:true, tweets:[]})
		this.state.addresses.split('\n').map((value)=> {
			axios
				.get('/api/links/title?address=' + value)
				.then((response)=> this.createTweet(response, value))
		})	
	}

	createTweet(response, value) {
		this.setState({
			tweets: this.state.tweets.concat([{
				title:response.data.result.title, 
				url:value,
				user_name: response.data.result.name}])
		})
	}

	addTag(tag){
		this.setState({
			tags: this.state.tags.concat([tag])
		})
	}

	logout(){
		axios
			.get('/api/logout')
			.then((response)=>{
				if (response.data.success) {
					window.location.href= "/"
				}
			})
	}

	render() {
		return (
			<div style={{textAlign:'center', fontFamily: 'Helvetica Neue'}}>
		         <Dialog
		          title="Upload image"
		          actions={[
			        	<FlatButton
					    	label="Ok"
					    	primary={true}
					    	keyboardFocused={true}
					    	onTouchTap={()=>this.setCropImage(this.state.imageLink)}
				   		/>
			      ]}
		          open={this.state.openAddPhoto}
		          modal={true}
		        >
			          <TextField 
			          	hintText="Enter URL here" 
			          	value={this.state.imageLink}
			          	onChange={(e)=>{this.setState({imageLink: e.target.value})}}/>
		        </Dialog>
		        <Dialog
		          title="Dialog With Date Picker"
		          open={this.state.openPostIt}
		          contentStyle={{maxWidth: 'none'}}
		          onRequestClose={this.onClose.bind(this)}
		        >
        			<PostIt 
						linkUrl={this.state.linkUrl}
						imgSrc={this.state.cropImage}
						tags={this.state.tags}></PostIt>
				</Dialog>
				<table style={{display:'inline-table', width:1200}}>
					<tbody>
						<tr>
							<td style={{padding: 6}}>
								<FlatButton
							    	label="Home"
							    	primary={true}
							    	onTouchTap={()=> {window.location.href= "/"}}
						   		/>
								<RaisedButton
							    	label="Logout"
							    	secondary={true}
							    	onTouchTap={this.logout}
						   		/>
						   	</td>
					   	</tr>
						<tr>
							<td style={style.td.home}>
								<Tabs>
								    <Tab label="Twitter" 
								    	onActive={()=>this.setState({'activeTab': 0})}>
								    	<div style={{marginTop:6}}>
								    		<AdminNav
								    			getTweets={this.getExistingTweets.bind(this)}
								    			connected={this.state.connected}></AdminNav>
								    		<TweetFeed 
												tweets={this.state.tweets.reverse()}
												onSurf={this.setTweet.bind(this)}></TweetFeed>
								    	</div>
								    </Tab>
								    <Tab 
								    	label="URL list" 
								    	onActive={()=>this.setState({'activeTab': 1})}
								    	>
								    	{
								    		!this.state.loaded ? 
								    			<div>
											    <TextField
											        floatingLabelText="Enter one address per line."
												    multiLine={true}
												    fullWidth={true}
												    rows={2}
												    onChange={(e) => this.onChange(e.target.value)}
												    /> 
												<RaisedButton 
											    	label="Get content from these links" 
											    	fullWidth={true} 
											    	onClick={this.getContent.bind(this)}/>
											    </div>
											: 	<div style={{marginTop:6}}>
													<RaisedButton 
												    	label="Return to links" 
												    	fullWidth={true} 
												    	onClick={()=>this.setState({loaded: false})}/>
													<TweetFeed 
														tweets={this.state.tweets.reverse()}
														onSurf={this.setTweet.bind(this)}></TweetFeed>
													
											    </div>
										}
									</Tab>
									    
								    <Tab 
								    	label="Published" 
								    	onActive={this.getLinks.bind(this)}>
								        <TweetFeed 
											tweets={this.state.existingPosts}
											onSurf={this.setTweet.bind(this)}
											delete={this.deleteLink.bind(this)}
											confirmDelete={this.state.confirmDelete}
											chosen={this.state.linkUrl}></TweetFeed>
								    </Tab>
								  </Tabs>
								
							</td>
							<td style={style.td.home} rowSpan={2}>
								<GridList style={{width: 450}} cols={3}>
									{	
										this.state.linkUrl.length ?
											<GridTile 
												title={'Add image'}
												actionIcon={
													<IconButton 
														onClick={()=>this.setState({openAddPhoto: true})}>
														<AddPhoto color="white" />
													</IconButton>
												}
											></GridTile>
										: <GridTile />
									}
									
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