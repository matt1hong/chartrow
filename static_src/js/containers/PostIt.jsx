import React from 'react'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import Toggle from 'material-ui/Toggle';
import ReactCrop from 'react-image-crop'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import InlineEdit from 'react-edit-inline'
import Chip from 'material-ui/Chip';
import axios from 'axios'
import 'react-image-crop/dist/ReactCrop.css';

const style= {
	largeTitle: {
		fontSize: 36,
		fontFamily: 'Garamond',
		// fontWeight: 'bold'
	},
	mediumTitle: {
		fontSize: 24,
		fontFamily: 'Garamond',
		// fontWeight: 'bold'
	},
	smallTitle: {
		fontSize: 15,
		fontFamily: 'Helvetica Neue'
	}
}

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
			timestamp: 0,
			stepIndex: 0
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
				url: this.props.linkUrl,
				imgSrc: this.props.imgSrc,
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
				if (!(this.state.tag in this.props.tags)) {
					this.props.addTag(this.state.tag)
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

	handleNext () {
	    const {stepIndex} = this.state;
	    if (this.state.stepIndex < 3) {
	      this.setState({stepIndex: this.state.stepIndex + 1});
	    }
	  };

	handlePrev () {
	    const {stepIndex} = this.state;
	    if (this.state.stepIndex > 0) {
	      this.setState({stepIndex: this.state.stepIndex - 1});
	    }
	  };

	renderStepActions(step) {
	    const {stepIndex} = this.state;

	    return (
	      <div style={{margin: '12px 0'}}>
	        
	        {step > 0 && (
	          <FlatButton
	            label="Back"
	            disabled={this.state.stepIndex === 0}
	            disableTouchRipple={true}
	            disableFocusRipple={true}
	            onTouchTap={this.handlePrev.bind(this)}
	          />
	        )}
	        <RaisedButton
	          label={'Next'}
	          disableTouchRipple={true}
	          disableFocusRipple={true}
	          primary={true}
	          onTouchTap={this.handleNext.bind(this)}
	          style={{marginRight: 12}}
	        />
	      </div>
	    );
	  }

 	render() {
 		return (<table style={{fontFamily: 'Helvetica Neue'}}>
				<tbody>
					<tr>
						<td>
							<ReactCrop 
							src={this.props.imgSrc} 
							onComplete={this.setCropSize.bind(this)}
							/>
						</td>
						<td>
						    <Stepper 
						    	activeStep={this.state.stepIndex} orientation="vertical"
						    	style={{width:500}}>
					          <Step>
					            <StepLabel>Headline</StepLabel>
					            <StepContent>
					            <div>
					            	<Checkbox
									      label="Lead article"
									      checked={this.state.lead}
									      style={{margin: "12 0"}}
									      onCheck={(event, checked) => {
									      	this.setState({
									      		lead: checked
									      	})
									      }}
								    />
					              	<InlineEdit
										validate={this.customValidateText}
										text={this.state.title}
										style={
											Object.assign(
												this.state.lead ? {width:400, margin: "12 0"} : {width:330, margin: "12 0"},
												this.state.lead ? style.largeTitle : style.smallTitle)}
										paramName="title"
										change={this.titleChanged.bind(this)}></InlineEdit>
									
					              {this.renderStepActions(0)}
					            </div></StepContent>
					          </Step>
					          <Step>
					            <StepLabel>Tag</StepLabel>
					            <StepContent>
					            <div>
								  	<div style={{
										display: 'flex',flexWrap: 'wrap',margin: "12 0", height:80, overflow:"auto"}}>
										{this.props.tags.map((tag, key) => (
											<Chip key={key} onTouchTap={this.tagSelected.bind(this)}>{tag}</Chip>
										))}
									</div>
									<InlineEdit
										validate={this.customValidateText}
										text={this.state.tag}
										style={{margin: "12 0"}}
										paramName="tag"
										change={this.tagChanged.bind(this)}></InlineEdit>
								  	{this.renderStepActions(1)}
					            </div></StepContent>
					          </Step>
					          <Step>
					            <StepLabel>Publication date</StepLabel>
					            <StepContent>
					            <div>
					              <DatePicker 
								hintText="Custom publication date" 
								container="inline" 
								value={this.state.date}
    							onChange={this.handleDateChange.bind(this)}/>
    							{this.renderStepActions(2)}
    							
					            </div></StepContent>
					          </Step>
					          <Step>
					            <StepLabel>Finish</StepLabel>
					            <StepContent>
					              <div style={{margin: '12px 0'}}>
					              <FlatButton
						            label="Back"
						            disableTouchRipple={true}
						            disableFocusRipple={true}
						            onTouchTap={this.handlePrev.bind(this)}
						          />
					              <RaisedButton
									label="Promote"
									onClick={this.promoteLink.bind(this)}
									secondary={true}></RaisedButton>
								</div>
    							
					            </StepContent>
					          </Step>

					         
					        </Stepper>
							
						</td>
					</tr>
				</tbody>
			</table>)
 	}
}

PostIt.propTypes ={
	linkUrl: React.PropTypes.string,
	imgSrc: React.PropTypes.string,
	tags: React.PropTypes.array
}

export default PostIt