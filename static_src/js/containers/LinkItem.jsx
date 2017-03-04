import React from 'react'


class LinkItem extends React.Component {
	render() {
		return (
			<div style={{textAlign:'left'}}>
				<span>{this.props.headline}</span>
				{this.props.imgSrc
					? <img src={this.props.imgSrc} style={{float:'right'}}/>
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
