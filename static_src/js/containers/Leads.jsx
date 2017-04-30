import React from 'react'

class Leads extends React.Component {
	constructor() {
		super()
		this.state = {
			tweets: []
			connected: false
			existingPosts: []
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
				tweets: this.state.tweets.concat([data]).reverse()
			})
		}
		
	}
	getLinks(){
		axios
			.get('/api/links')
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

	render() {
		return (
			<Tabs>
			    <Tab label="Twitter" 
			    	onActive={()=>this.setState({'activeTab': 0})}>
			    	<div style={{marginTop:6}}>
			    		<AdminNav
			    			getTweets={this.getExistingTweets.bind(this)}
			    			connected={this.state.connected}></AdminNav>
			    		<TweetFeed 
							tweets={this.state.tweets}
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
									tweets={this.state.tweets}
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
		)
	}
}

React.propTypes = {
	setTweet: React.PropTypes.func
}