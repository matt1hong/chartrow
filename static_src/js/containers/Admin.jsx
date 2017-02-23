import React from 'react';
import Feed from './RSSFeed';
import ReactCrop from 'react-image-crop'
import Tweet from 'react-tweet'
import axios from 'axios'

import 'react-image-crop/dist/ReactCrop.css';

const style= {
	td: {
		width: '50%'
	}
}

export default class Admin extends React.Component {
	componentDidMount() {
		axios.get('/api/get_tweets').then(response => {
			console.log(JSON.parse(response.data.results))
		})
	}
	render() {
		return (
			<div style={{textAlign:'center'}}>
			<table style={{display:'inline-table', width:1200}}>
				<tbody>
					<tr>
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