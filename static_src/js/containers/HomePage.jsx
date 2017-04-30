import React from 'react';
import StackGrid from 'react-stack-grid';
import axios from 'axios';
import LinkItem from './LinkItem'
import LinkCollection from './LinkCollection'
import Header from './Header'
import sizeMe from 'react-sizeme';
import $ from 'jquery';

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
const gutterHeight = 6

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

	constructor(props) {
		super(props)
		this.state = {
			links: [],
			taggedLinks: {},
			tags: [],
			topicTags: [],
			tag: ''
		}
	}

	componentDidMount() {
		$(window).on('hashchange', (function() {
			this.setState({
				tag: window.location.hash.replace('#', '')
			})
		}).bind(this))
	}

	getLinks() {
	    axios
            .get('/api/links/tags')
            .then((response)=>{
                this.setState({
                    tags: response.data.results
                })
            })
		axios
			.get('/api/links')
			.then((response) => {
				let links = response.data.results
				links.sort(sort)

				this.setState({
					links: links,
					topicTags: [...new Set(links.map((lnk) => { return lnk.tag }))]
				})
			})
	}

	// componentWillUpdate(newProps, newState) {
	// 	if (newState.tag === '' && this.state.tag !== '') {
	// 		this.getLinks()
	// 	} 
	// }

	onHeaderClick(tag) {
		axios
			.get(`/api/links/tagged?tag=${tag}`)
			.then((response) => this.onHeaderClickCallback(response, tag))
	}

	onHeaderClickCallback(response, tag) {
		let links = response.data.results
		links.sort(sort)
		let newTaggedLinks = this.state.taggedLinks
		newTaggedLinks[tag] = links
		this.setState({
			taggedLinks: newTaggedLinks,
			tag: tag
		})
	}

	render() {
		const { width, height } = this.props.size;
		let widthTagged = 400;
		let stateTaggedLinks = 
			this.state.links.filter((link) => {
				return link.tag === this.state.tag
			})
	  	return (
	  		<div style={{fontFamily: 'Helvetica Neue', padding: '0 12'}} id="container">
	  		   
		    	<div style={{textAlign:'center'}} id="home">
		    		<Header
		    			columnWidth={columnWidth}
						gutterWidth={gutterWidth}
						tagged={this.state.tag !== ""}
						title="CHARTROW"
						subheader="THE DATA VISUALIZATION CATALOG"
						onClick={()=>{this.setState({tag:''})}}
						onFilterClick={this.onHeaderClick.bind(this)} />
					{
						this.state.tag === "" ? (
							width < columnWidth * 2 + 1 * gutterWidth ? 
								<LinkCollection
									index={1}
									links={this.state.links}
									width={width < widthTagged ? width : widthTagged}
									small={
										width < widthTagged * 2 + 1 * gutterWidth 
										? true 
										: false}/>
							: <StackGrid 
								columnWidth={width < columnWidth ? width : columnWidth}
								gutterWidth={gutterWidth} 
								gutterHeight={gutterHeight}
								monitorImagesLoaded={true}>
								{
									this.state.topicTags.map((tag, key)=>{
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
													: false}
												onHeaderClick={() => this.onHeaderClick(tag)}/>
										)
									})
								}
								</StackGrid>)
						: 	<LinkCollection
								index={1}
								title={this.state.tag}
								links={this.state.taggedLinks[this.state.tag]}
								width={width < widthTagged ? width : widthTagged}
								small={
									width < widthTagged * 2 + 1 * gutterWidth 
									? true 
									: false}/>
					}
		      	</div>
	      	</div>
	    );
	}
}

export default sizeMe({ monitorWidth: true })(HomePage)
