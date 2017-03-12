import React from 'react'
import LinkItem from './LinkItem'
import axios from 'axios';

class LinkCollection extends React.Component {

	render() {
		return (
			<div style={{width:400}}>
				{this.props.links.map((link, key) => (

					<LinkItem 
						key={key}
						imgSrc={link.id.toString()}
						large={!this.props.small && link.lead}
						// url={link.url}
						headline='Headline 1'>{console.log(!this.props.small && link.lead)}</LinkItem>
					
				))}
			</div>
		)
	}
}

LinkCollection.propTypes = {
	links: React.PropTypes.array,
	small: React.PropTypes.bool
}

export default LinkCollection