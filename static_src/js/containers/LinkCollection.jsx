import React from 'react'
import LinkItem from './LinkItem'
import Divider from 'material-ui/Divider';
import axios from 'axios';


class LinkCollection extends React.Component {

	render() {
		return (
			<div style={{width:400}}>
				{this.props.links.map((link, key) => (

					<LinkItem 
						key={key}
						index={key}
						imgSrc={link.id.toString()}
						small={!!this.props.index || this.props.small}
						lead={link.lead}
						headline={link.title}></LinkItem>
					
				))}
				<Divider></Divider>
			</div>
		)
	}
}

LinkCollection.propTypes = {
	links: React.PropTypes.array,
	small: React.PropTypes.bool,
	index: React.PropTypes.number
}

export default LinkCollection