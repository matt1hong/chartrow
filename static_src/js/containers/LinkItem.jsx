import React from 'react'


class LinkItem extends React.Component {
	constructor(props) {
		super(props)
		console.log(this.props.imgSrc)
		this.imgSrc = require('../../images/'+this.props.imgSrc)
	}
	render() {
		return (
			<div style={{textAlign:'left'}}>
				<span>{this.props.headline}</span>
				{this.props.imgSrc
					? <img src={this.imgSrc} style={{float:'right'}}/>
					: null
				}
			</div>)
	}
}

LinkItem.propTypes = {
	url: React.PropTypes.string,
	headline: React.PropTypes.string,
	imgSrc: React.PropTypes.string
}

export default LinkItem
