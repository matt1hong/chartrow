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
      linkClicked: false,
      expanded: false
    }
  }

  clickImage() {
    this.setState({imageClicked: true})
  }

  clickLink() {
    this.setState({linkClicked: true})
  }

  handleExpand () {
    this.setState({expanded: true})
  }
  handleExpandChange (expanded) {
    this.setState({expanded: expanded});
  };

  render() {
    const SvgIcon = this.props.icon;
    const lastSeen = this.props.lastSeen;
    const isNew = new Date(this.props.tweet.timestamp_ms * 1000) > new Date(lastSeen.substring(0, lastSeen.indexOf('.'))+'-04:00');
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={{marginTop:6}} href={this.props.tweet.url}>
        <a href={this.props.tweet.tweet || null} target="_blank" style={{textDecoration: 'none'}}>
          <CardTitle title={
            <div>
              <SvgIcon style={{color: this.props.color, float: 'left', marginRight: 6}}/>
              <div><span style={{fontWeight: isNew ? 'bold' : 'normal', color: this.props.color}}>{this.props.tweet.user_name} </span> 
              {this.props.tweet.title} 
            </div></div>} titleStyle={{fontSize:14,lineHeight:1}} style={{padding:"16 16 8"}}>  
          </CardTitle>
        </a>
        <CardActions>
          <FlatButton 
            label="Images" 
            onTouchTap={() => {this.clickImage(); this.props.onSurf(this.props.tweet); this.handleExpand;}} 
            primary={true}
            // primary={!this.state.imageClicked} 
            // secondary={this.state.imageClicked}/>
            />
          <FlatButton 
            label="Link" 
            onTouchTap={this.clickLink.bind(this)}
            href={this.props.tweet.url} 
            target="_blank" 
            primary={true}
            // primary={!this.state.linkClicked} 
            // secondary={this.state.linkClicked}/>
            />
          {this.props.chosen === this.props.tweet.url && this.props.delete && !this.props.confirmDelete ?
              <FlatButton label="Delete" onTouchTap={() => this.props.toDelete(this.props.tweet)} />
              : null
          }
          {this.props.chosen === this.props.tweet.url && this.props.confirmDelete && this.props.delete ?
              <FlatButton label="Confirm" onTouchTap={() => this.props.delete(this.props.tweet)} />
              : null
          }
          {this.props.unlike ?
              <FlatButton label="Unlike" onTouchTap={() => this.props.unlike(this.props.tweet)} />
              : null
          }
          {this.props.tweetOut ?
              <FlatButton label="Tweet" onTouchTap={() => this.props.tweetOut(this.props.tweet)} />
              : null
          }
        </CardActions>
        <CardMedia
          expandable={true}
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >
          <img src="https://pbs.twimg.com/profile_images/2037777108/TEMP-Image_1_6_normal.png" alt="" />
        </CardMedia>
      </Card>
      )}
     
}

Tweet.propTypes = {
  tweet: React.PropTypes.object,
  onSurf: React.PropTypes.func,
  delete: React.PropTypes.func,
  toDelete: React.PropTypes.func,
  chosen: React.PropTypes.string,
  confirmDelete: React.PropTypes.bool,
  color: React.PropTypes.string,
  icon: React.PropTypes.func,
  lastSeen: React.PropTypes.string,
  unlike: React.PropTypes.func,
  tweetOut: React.PropTypes.func
}