import React from 'react'

const style= {
	largeTitle: {
		fontSize: 36,
		fontFamily: 'Garamond',
		display: 'inline-block',
		fontStyle: 'italic'
		// fontWeight: 'bold'
	},
	mediumTitle: {
		fontSize: 24,
		fontFamily: 'Garamond',
		fontStyle: 'italic'
		// fontWeight: 'bold'
	},
	smallTitle: {
		fontSize: 13,
		fontFamily: 'Helvetica Neue',
		fontWeight: 'bold'
	}
}

class LinkItem extends React.Component {
	constructor(props) {
		super(props)
		this.imgImports = {
			small: `https://s3.amazonaws.com/chartrow/${this.props.imgSrc}.png`
		}
		if (this.props.lead) {
			this.imgImports.large = `https://s3.amazonaws.com/chartrow/${this.props.imgSrc}-400.png`
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
			<div style={{textAlign:'left', overflow:'hidden', marginBottom: 12}}>
				{
					this.props.imgSrc ? 
						<img src={this.state.small? 
								this.imgImports.small
								: this.imgImports.large
						} style={{float:'left', marginRight: 6}}/>
					: null
				}
				{
					this.state.small ? 
					<span className="button" style={
						Object.assign(
							{maxWidth:this.props.width-76, display: "inline-block"}, 
							this.props.lead && !this.props.index ? style.mediumTitle : style.smallTitle
							)}>{this.props.headline}</span>
					: null
				}
				{
					!this.state.small? 
					<span className="button" style={style.largeTitle}>{this.props.headline}</span>
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
	index: React.PropTypes.number,
	width: React.PropTypes.number
}

export default LinkItem
