import React from 'react';
import { purple800 } from 'material-ui/styles/colors'
import FontIcon from 'material-ui/FontIcon';
import {Card, CardActions, CardHeader, CardTitle, CardText, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class Tweet extends React.Component {
  constructor() {
    super()
    this.state = {
      imageClicked: false,
      linkClicked: false
    }
  }

  clickImage() {
    this.setState({imageClicked: true})
  }

  clickLink() {
    this.setState({linkClicked: true})
  }

  render() {
    const SvgIcon = this.props.icon;
    return (
            <Card style={{marginTop:6}} href={this.props.tweet.url}>
              <a href={this.props.tweet.tweet || null} target="_blank" style={{textDecoration: 'none'}}>
                <CardTitle title={
                  <div>
                    <SvgIcon style={{color: this.props.color, float: 'left', marginRight: 6}}/>
                    <div><span style={{fontWeight: 'bold', color: this.props.color}}>{this.props.tweet.user_name} </span> 
                    {this.props.tweet.text || this.props.tweet.title} 
                  </div></div>} titleStyle={{fontSize:14,lineHeight:1}} style={{padding:"16 16 8"}}>  
                </CardTitle>
              </a>
              <CardActions>
                <FlatButton 
                  label="Images" 
                  onTouchTap={() => {this.clickImage(); this.props.onSurf(this.props.tweet);}} 
                  primary={!this.state.imageClicked} 
                  secondary={this.state.imageClicked}/>
                <FlatButton 
                  label="Link" 
                  onTouchTap={this.clickLink}
                  href={this.props.tweet.url} 
                  target="_blank" 
                  primary={!this.state.linkClicked} 
                  secondary={this.state.linkClicked}/>
                {this.props.chosen === this.props.tweet.url && this.props.delete && !this.props.confirmDelete ?
                    <FlatButton label="Delete" onTouchTap={() => this.toDelete(this.props.tweet)} />
                    : null
                }
                {this.props.chosen === this.props.tweet.url && this.props.confirmDelete && this.props.delete ?
                    <FlatButton label="Confirm" onTouchTap={() => this.props.delete(this.props.tweet)} />
                    : null
                }
              </CardActions>
            </Card>
      )}
     
}

Tweet.propTypes = {
  tweet: React.PropTypes.object,
  onSurf: React.PropTypes.func,
  delete: React.PropTypes.func,
  chosen: React.PropTypes.string,
  confirmDelete: React.PropTypes.bool,
  color: React.PropTypes.string,
  icon: React.PropTypes.symbol
}