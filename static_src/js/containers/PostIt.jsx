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
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import axios from 'axios'
import 'react-image-crop/dist/ReactCrop.css';
import * as colors from 'material-ui/styles/colors'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'

const colorKeys = Object.keys(colors).filter((v) => v.indexOf('400') > -1);

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

function arrEquals( one, two )
{
    if( one.length != two.length )
    {
        return false;
    }
    for( var i = 0; i < one.length; i++ )
    {
        if( one[i] != two[i] )
        {
            return false;
        }
    }
    return true;
}

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

	constructor(props) {
		super(props)
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
			title: this.props.headline,
			tag: 'New tag',
			workingTags: [],
			timestamp: 0,
			stepIndex: 0,
			alert: 'Promote',
			disablePromoteButton: false
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

	tagSelected(event){
		let tag = event.target.innerText
		tag = tag.split(': ')
		if (tag in this.state.workingTags) {
			const index = this.state.workingTags.indexOf(tag);
			this.setState({
				workingTags: this.state.workingTags.splice(index, 1)
			})
		} else {
			this.setState({
				workingTags: this.state.workingTags.concat([tag])
			})
		}
	}

	promoteLink(){
		this.setState({
			disablePromoteButton: true
		})
		axios
			.post('/api/links/promote', {
				url: this.props.linkUrl,
				imgSrc: this.props.imgSrc,
				cropPixels: this.state.cropPixels,
				lead: this.state.lead,
				title: this.state.title,
				tags: this.state.workingTags,
				realTimestamp: +this.state.date || this.state.timestamp
			})
			.then((response) => {
				this.setState({
					alert: 'Success!'
				})
			})
			.catch((e) => {
				this.setState({
					disablePromoteButton: false
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

	addNewTag(){
		if (!(this.state.tag in this.state.workingTags) && this.state.tag in this.props.tags) {
			this.setState({
				workingTags: this.state.workingTags.concat([['Topic',event.target.innerText]])
			})
		} else if (!(this.state.tag in this.props.tags)) {
			this.props.addTag(['Topic', this.state.tag])
			this.setState({
				workingTags: this.state.workingTags.concat([['Topic', this.state.tag]])
			})
		}
	}

	onChange(v, name) {
		let nextState = {}
		nextState[name] = v
		this.setState(nextState)
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
					            <StepContent >
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
					              	<TextField
					              		multiLine={true}
					              		rows={2}
					              		name="title"
					              	 	onChange={(e) => this.onChange(e.target.value, 'title')}
					              	 	value={this.state.title}
					              	 	textareaStyle={{lineHeight: 'normal'}}
										style={Object.assign(
											this.state.lead ? style.largeTitle : style.smallTitle,
											this.state.lead ? {width:400} : {width:330})}
									></TextField>
									
					              {this.renderStepActions(0)}
					            </div></StepContent>
					          </Step>
					          <Step>
					            <StepLabel>Tag</StepLabel>
					            <StepContent>
					            <div>
								  	<div style={{
										display: 'flex',flexWrap: 'wrap',margin: "12 0", height:120, overflow:"auto"}}>
										{this.props.tags.map((tag, key) => (
											<Chip 
												key={key} 
												className={tag[0]}
												backgroundColor={colors[colorKeys[tag[0].hashCode()%colorKeys.length]]}
												onTouchTap={this.tagSelected.bind(this)}>
													{ this.state.workingTags.filter((el)=>arrEquals(el, tag)).length > 0 ? 
														<Avatar icon={<CheckCircle />} />
														: null }
													{`${tag[0]}: ${tag[1]}`}
											</Chip>
										))}
									</div>
									<TextField
										style={{margin: "12 0"}}
										name="tag"
										onChange={(e) => this.onChange(e.target.value, 'tag')}>
									</TextField>
									<FlatButton
							            label="Add tag"
							            disableTouchRipple={true}
							            disableFocusRipple={true}
							            onTouchTap={this.addNewTag.bind(this)}
							          />
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
									label={this.state.alert}
									onClick={this.promoteLink.bind(this)}
									secondary={true}
									disabled={this.state.disablePromoteButton}></RaisedButton>
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
	tags: React.PropTypes.array,
	headline: React.PropTypes.string,
	addTag: React.PropTypes.func
}

export default PostIt