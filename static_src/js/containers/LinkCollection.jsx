import React from 'react'
import LinkItem from './LinkItem'
import axios from 'axios';

const sort = (x, y) => x.real_timestamp - y.real_timestamp

class LinkCollection extends React.Component {
	constructor(props) {
		super(props)
		this.sorted = [].concat(this.props.links).sort(sort)
	}

	render() {
		return (
			<div style={{width:400}}>
				{this.props.links.map((link, key) => (

					<LinkItem 
						key={key}
						index={key}
						imgSrc={link.id.toString()}
						small={this.props.small}
						lead={link.lead}
						headline={link.title}></LinkItem>
					
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