import React from 'react';
import StackGrid from 'react-stack-grid';
import axios from 'axios';
import LinkItem from './LinkItem'
import LinkCollection from './LinkCollection'

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
			links: [],
			tags: []
		}
	}

	componentDidMount() {
		axios
			.get('/api/get_links')
			.then((response) => {
				let links = response.data.results

				this.setState({
					links: Array.concat(this.state.links, links),
					tags: links.map((lnk) => { return lnk.tag })
				})
			})
	}

	render() {
	  	return (
	  		<div>
	  		<h1>Chartrow</h1>
	    	<div style={{textAlign:'center'}}>
				<StackGrid 
					columnWidth={400}
					gutterWidth={12} 
					gutterHeight={6}>
					{
						this.state.tags.map((tag, key)=>{
							let taggedLinks = this.state.links.filter((link) => {
								return link.tag === tag
							})
							return (
								<LinkCollection
									key={key}
									title={tag}
									links={taggedLinks}/>
							)
						})
					}
						
				</StackGrid>
	      	</div>
	      	</div>
	    );
	}
}
