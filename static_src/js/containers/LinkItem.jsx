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
		this.imgImports = {
			small: require(`../../images/${this.props.imgSrc}.png`)
		}
		if (this.props.lead) {
			this.imgImports.large = require(`../../images/${this.props.imgSrc}-400.png`)
		}
		this.state = {
			small: this.props.small || !this.props.lead || this.props.index
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (this.props.small !== nextProps.small) {
			this.setState({
				small: nextProps.small || !nextProps.lead || nextProps.index
			})
		}
	}
	render() {
		return (
			<div style={{textAlign:'left', overflow:'hidden', marginBottom: 6}} onClick={this.props.onClick}>
				{
					this.state.small? 
					<span style={style.title}>{this.props.headline}</span>
					: null
				}
				{
					this.props.imgSrc ? 
						<img src={this.state.small? 
								this.imgImports.small
								: this.imgImports.large
						} style={{float:'right'}}/>
					: null
				}
				{
					!this.state.small? 
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
	small: React.PropTypes.bool,
	lead: React.PropTypes.bool,
	onClick: React.PropTypes.func,
	index: React.PropTypes.number
}

export default LinkItem
