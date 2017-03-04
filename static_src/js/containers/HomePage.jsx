import React from 'react';
import StackGrid from 'react-stack-grid';
import axios from 'axios';
import LinkItem from './LinkItem'

const style={
	key1: {
		background:'yellow',
		height: 100
	},
	key2: {
		background: 'blue',
		height: 100
	},
	key3: {
		background: 'brown',
		height: 100
	}
}

export default class HomePage extends React.Component {

	constructor() {
		super()
		this.state = {
			links: []
		}
	}

	componentDidMount() {
		axios
			.get('/api/get_links')
			.then((response) => {
				this.setState({
					links: Array.concat(this.state.links, response.data.results)
				})
			})
	}

	render() {
	  	return (
	    	<div style={{textAlign:'center'}}>
				<StackGrid 
					columnWidth="33.333%" 
					gutterWidth={12} 
					gutterHeight={6}>
					{ this.state.links.map((link, key) => (
						<LinkItem 
							key={key}
							imgSrc={link.img_src}
							// url={link.url}
							headline='Headline 1' />
					))}
				</StackGrid>
	      	</div>
	    );
	}
}
