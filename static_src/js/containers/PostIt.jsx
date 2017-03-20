import React from 'react'

import Toggle from 'material-ui/Toggle';
import ReactCrop from 'react-image-crop'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import InlineEdit from 'react-edit-inline'
import Chip from 'material-ui/Chip';
import axios from 'axios'
import 'react-image-crop/dist/ReactCrop.css';

class PostIt extends React.Component {

	constructor() {
		super()
		const dimensions = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}
		this.state = {
			cropRatio: Object.assign({}, dimensions),
			cropPixels: Object.assign({}, dimensions),
			date: null,
			lead: false,
			title: 'Enter title',
			tag: 'New tag',
			tags: [],
			timestamp: 0
		}
	}
	setCropSize(crop, pixelCrop) {
		this.setState({
			cropRatio: crop,
			cropPixels: pixelCrop
		})
	}

	customValidateText(text) {
      return (text.length > 0 && text.length < 64);
    }

   	titleChanged(data){
		this.setState(data)
	}

	tagChanged(data){
		this.setState(data)
	}

	tagSelected(event){
		this.setState({
			tag: event.target.innerText
		})
	}

	promoteLink(){
		axios
			.post('/api/promote', {
				url: this.state.linkUrl,
				imgSrc: this.state.cropImage,
				cropPixels: this.state.cropPixels,
				lead: this.state.lead,
				title: this.state.title,
				tag: this.state.tag,
				realTimestamp: +this.state.date || this.state.timestamp
			})
			.then((response) => {
				this.setState({
					alert: 'Success!'
				})
				if (!(this.state.tag in this.state.tags)) {
					this.setState({
						tags: [this.state.tag].concat(this.state.tags)
					})
				}
			})
			.catch((e) => {
				this.setState({
					alert: e
				})
			})
	}
	
	handleDateChange(event, date) {
		if (date === this.state.date) {
			this.setState({date:null})
		} else {
			this.setState({date});
		}
	};

 	render() {
 		return (<table>
				<tbody>
					<tr>
						<td rowSpan="7">
							<ReactCrop 
							src={this.props.imgSrc} 
							onComplete={this.setCropSize.bind(this)}
							/>
						</td>
						<td>
							<Checkbox
							      label="Lead article"
							      checked={this.state.lead}
							      onCheck={(event, checked) => {
							      	this.setState({
							      		lead: checked
							      	})
							      }}
							    />
						</td>
					</tr>
					<tr>
						<td>
							
								<InlineEdit
									validate={this.customValidateText}
									text={this.state.title}
									paramName="title"
									change={this.titleChanged.bind(this)}></InlineEdit>
						</td>
					</tr>
					<tr>
						<td>
							<InlineEdit
									validate={this.customValidateText}
									text={this.state.tag}
									paramName="tag"
									change={this.tagChanged.bind(this)}></InlineEdit>
						</td>
					</tr>
					<tr>
						<td>
							<div style={{
									flex:'wrap'
								}}>
									{this.state.tags.map((tag, key) => (
										<Chip key={key} onTouchTap={this.tagSelected.bind(this)}>{tag}</Chip>
									))}
								</div>
						</td>
					</tr>
					<tr>
						<td>
							<DatePicker 
								hintText="Custom publication date" 
								container="inline" 
								value={this.state.date}
    							onChange={this.handleDateChange.bind(this)}/>
						</td>
					</tr>
					<tr>
						<td>
							<RaisedButton
									label="Promote"
									onClick={this.promoteLink.bind(this)}></RaisedButton>
						</td>
					</tr>
					<tr>
						<td>
							<RaisedButton
								label="Close"
								onClick={this.props.onClose}></RaisedButton>
						</td>
					</tr>
				</tbody>
			</table>)
 	}
}

PostIt.propTypes ={
	imgSrc: React.PropTypes.string,
	onClose: React.PropTypes.func
}

export default PostIt