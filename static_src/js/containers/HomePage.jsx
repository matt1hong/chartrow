import React from 'react';
import StackGrid from 'react-stack-grid';
import axios from 'axios';
import LinkItem from './LinkItem'
import LinkCollection from './LinkCollection'
import Header from './Header'
import sizeMe from 'react-sizeme';

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

const columnWidth = 400
const gutterWidth = 24
const gutterHeight = 12

const leadSort = (x, y) => +y.lead - +x.lead
const dateSort = (x, y) => new Date(y.real_date) - new Date(x.real_date)
const sort = function(x, y) {
	let byLead = leadSort(x,y);
	if (!byLead) {
		return dateSort(x,y);
	}
	return byLead;
}

class HomePage extends React.Component {

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
				links.sort(sort)

				this.setState({
					links: links,
					tags: [...new Set(links.map((lnk) => { return lnk.tag }))]
				})
			})
	}

	render() {
		const { width, height } = this.props.size;
	  	return (
	  		<div style={{fontFamily: 'Helvetica Neue'}}>
	    	<div style={{textAlign:'center'}}>
	    		<Header 
	    			columnWidth={columnWidth}
					gutterWidth={gutterWidth}
					title="CHARTROW"
					subheader="Truths are only errors to be exposed" />
				<StackGrid 
					columnWidth={width < columnWidth ? width : columnWidth}
					gutterWidth={gutterWidth} 
					gutterHeight={gutterHeight}
					monitorImagesLoaded={true}>
					
					{
						this.state.tags.map((tag, key)=>{
							let taggedLinks = this.state.links.filter((link) => {
								return link.tag === tag
							})
							return (
								<LinkCollection
									key={key}
									index={key}
									title={tag}
									links={taggedLinks}
									width={width < columnWidth ? width : columnWidth}
									small={
										width < columnWidth * 2 + 1 * gutterWidth 
										? true 
										: false}/>
							)
						})
					}
						
				</StackGrid>
	      	</div>
	      	</div>
	    );
	}
}

export default sizeMe({ monitorWidth: true })(HomePage)
