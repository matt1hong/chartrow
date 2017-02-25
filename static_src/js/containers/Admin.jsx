import React from 'react';
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
		this.loadData = this.loadData.bind(this)
	}
	componentDidMount() {
		this.loadData();
	}
	loadData() {
		axios.get('/api/get_tweets').then(response => {
			this.setState({
				tweets: JSON.parse(response.data.results).data
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
							<TweetFeed tweets={this.state.tweets}></TweetFeed>
						</td>
						<td style={style.td}>
							<ReactCrop src="https://www.smashingmagazine.com/wp-content/uploads/2016/10/inclusive-design-pattners-250px.png" />
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