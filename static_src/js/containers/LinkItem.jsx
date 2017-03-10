import React from 'react'

const style= {
	largeTitle: {
		fontSize: 24,
		fontFamily: 'Helvetica Neue'
	},
	title: {
		fontSize: 15,
		fontFamily: 'Helvetica Neue'
	}
}

class LinkItem extends React.Component {
	constructor(props) {
		super(props)
		console.log(this.props.large)
		this.state = {
			large: this.props.large
		}
		this.imgImports = {
			small: require(`../../images/${this.props.imgSrc}.png`),
			large: require(`../../images/${this.props.imgSrc}-400.png`),
		}
	}
	render() {
		return (
			<div style={{textAlign:'left'}} onClick={this.props.onClick}>
				{
					!this.state.large ? 
					<span style={style.title}>{this.props.headline}</span>
					: null
				}
				{
					this.props.imgSrc ? 
						<img src={this.state.large ? 
								this.imgImports.large
								: this.imgImports.small
						} style={{float:'right'}}/>
					: null
				}
				{
					this.state.large ? 
					<span style={style.largeTitle}>{this.props.headline}</span>
					: null
				}
			</div>)
	}
}

LinkItem.propTypes = {
	url: React.PropTypes.string,
	headline: React.PropTypes.string,
	imgSrc: React.PropTypes.string,
	large: React.PropTypes.bool,
	onClick: React.PropTypes.func
}

export default LinkItem
