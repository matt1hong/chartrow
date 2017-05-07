import React from 'react';
import StackGrid from 'react-stack-grid';
import axios from 'axios';
import LinkItem from './LinkItem'
import LinkCollection from './LinkCollection'
import Header from './Header'
import sizeMe from 'react-sizeme';
import $ from 'jquery';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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

const genres = ['Annotated charts', 'Posters', 'Comic strips', 'Slide shows', 'Movies', 'Articles', 'Trackers']
const themes = ['Trends', 'Outliers', 'Networks', 'Averages', 'Categories']

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
		this.getLinks()
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
			.get('/api/links/' + (this.props.staging ? 'all' : ''))
			.then((response) => {
				let links = response.data.results
				links.sort(sort)

				this.setState({
					links: links,
					topicTags: [...new Set(links.map((lnk) => { return lnk.topic }))]
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
		if (links.length > 0) {
			links.sort(sort)
			let newTaggedLinks = this.state.taggedLinks
			newTaggedLinks[tag] = links
			this.setState({
				taggedLinks: newTaggedLinks,
				tag: tag
			})
		}
	}

	renderCollections(width) {
		let widthTagged = 400;
		if (this.state.tag === "") {
			if (width < columnWidth * 2 + 2 * gutterWidth) { 
				return (
					<LinkCollection
						key={0}
						index={1}
						links={this.state.links}
						width={width < widthTagged ? width : widthTagged}
						small={
							width < widthTagged * 2 + 2 * gutterWidth 
							? true 
							: false}/>)
			}
		} else {
			return (
				<LinkCollection
					key={2}
					index={1}
					title={this.state.tag}
					links={this.state.taggedLinks[this.state.tag]}
					width={width < widthTagged ? width : widthTagged}
					small={
						width < widthTagged * 2 + 2 * gutterWidth 
						? true 
						: false}/>)
		}
	}

	render() {
		const { width, height } = this.props.size;
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
						onFilterClick={this.onHeaderClick.bind(this)}
						genres={genres}
						themes={themes} />
			      <div>
					{
						this.renderCollections(width)
					}
					{
						<StackGrid 
							key={1}
							columnWidth={width < columnWidth ? width : columnWidth}
							gutterWidth={gutterWidth} 
							gutterHeight={gutterHeight}
							monitorImagesLoaded={true}>
							{
								this.state.tag === "" && !(width < columnWidth * 2 + 2 * gutterWidth) ?
									this.state.topicTags.map((tag, key)=>{
										let taggedLinks = this.state.links.filter((link) => {
											return link.topic === tag
										})
										return (
											<LinkCollection
												key={key}
												index={key}
												title={tag}
												links={taggedLinks}
												width={width < columnWidth ? width : columnWidth}
												small={
													width < columnWidth * 2 + 2 * gutterWidth 
													? true 
													: false}
												onHeaderClick={() => this.onHeaderClick(tag)}/>
										)
									})
								: null
							}
							</StackGrid>
					}
				</div>
		      	</div>
	      	</div>
	    );
	}
}

HomePage.propTypes = {
	staging: React.PropTypes.bool
}

export default sizeMe({ monitorWidth: true })(HomePage)
