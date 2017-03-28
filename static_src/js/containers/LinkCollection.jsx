import React from 'react'
import LinkItem from './LinkItem'
import Divider from 'material-ui/Divider';
import axios from 'axios';


class LinkCollection extends React.Component {

	render() {
		return (
			<div style={{width:this.props.width, textAlign: 'left', fontFamily: 'VT323'}}>
				<h4 style={{color:'gray', fontWeight:'normal'}}>{this.props.title}</h4>
				{this.props.links.map((link, key) => (

					<LinkItem 
						key={key}
						index={key}
						imgSrc={link.id.toString()}
						small={!!this.props.index || this.props.small}
						lead={link.lead}
						headline={link.title}
						width={this.props.width}></LinkItem>
					
				))}
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
	width: React.PropTypes.number
}

export default LinkCollection