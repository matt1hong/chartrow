import React from 'react';
import Tweet from './Tweet'
import axios from 'axios'
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class TweetFeed extends React.Component {

  constructor() {
  	super()
    this.state={
      confirmDelete: false
    }
  }

  handleExpandChange (expanded) {
    this.setState({expanded: expanded});
  };

  handleToggle (event, toggle) {
    this.setState({expanded: toggle});
  };

  handleExpand () {
    this.setState({expanded: true});
  };

  handleReduce () {
    this.setState({expanded: false});
  };

  toDelete() {
    this.setState({
      confirmDelete: true
    })
  }

  render() {
    return (
        <div>
            {this.props.tweets.map((x,k)=>
            	<Card key={k} style={{marginTop:6}} href={x.url}>
              <a href={x.tweet || null} target="_blank" style={{textDecoration: 'none'}}>
  			        <CardTitle title={x.text || x.title} titleStyle={{fontSize:14,lineHeight:1}} style={{padding:"16 16 8"}}>  
                </CardTitle>
              </a>
			        <CardActions>
			          <FlatButton label="Images" onTouchTap={() => this.props.onSurf(x)} />
                <FlatButton label="Link" href={x.url} target="_blank" />
			          {this.props.chosen === x.url && this.props.delete && !this.state.confirmDelete ?
			          		<FlatButton label="Delete" onTouchTap={() => this.toDelete(x)} />
			          		: null
			          }
                {this.props.chosen === x.url && this.state.confirmDelete && this.props.delete ?
                    <FlatButton label="Confirm" onTouchTap={() => this.props.delete(x)} />
                    : null
                }
			        </CardActions>
			      </Card>
			)}
        </div>
     
      )
	}
}

TweetFeed.propTypes = {
	tweets: React.PropTypes.array,
	onSurf: React.PropTypes.func,
	delete: React.PropTypes.func,
  chosen: React.PropTypes.string
}