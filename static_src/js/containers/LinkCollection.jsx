import React from 'react'
import LinkItem from './LinkItem'
import Divider from 'material-ui/Divider';
import axios from 'axios';


class LinkCollection extends React.Component {

	render() {
		return (
			<div style={{width:this.props.width, textAlign: 'left', fontFamily: 'VT323', margin: '0 auto'}}>
				<h4 
					style={{color:'gray', fontWeight:'normal', marginBottom: '0.66em', cursor: 'pointer'}}
					onClick={this.props.onHeaderClick}>{this.props.title || ""}</h4>
				{this.props.links ? 
					this.props.links.map((link, key) => (
						<LinkItem 
							key={key}
							index={key}
							imgSrc={link.id.toString()}
							small={!!this.props.index || this.props.small}
							lead={link.lead}
							headline={link.title}
							width={this.props.width}></LinkItem>
					
					))
					: null
				}
				<Divider></Divider>
			</div>
		)
	}
}

LinkCollection.propTypes = {
	links: React.PropTypes.array,
	small: React.PropTypes.bool,
	index: React.PropTypes.number,
	title: React.PropTypes.string,
	width: React.PropTypes.number,
	onHeaderClick: React.PropTypes.func
}

export default LinkCollection