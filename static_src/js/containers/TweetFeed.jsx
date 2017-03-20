import React from 'react';
import Tweet from './Tweet'
import axios from 'axios'
import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

export default class TweetFeed extends React.Component {

  constructor() {
  	super()
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

  render() {
    return (
        <div>
            {this.props.tweets.map((x,k)=>
            	<Card key={k} style={{margin:'0 24 12'}}>
			        <CardTitle title={x.text || x.title} />
			        <CardText><a href={x.url} target="_blank">{x.url}</a></CardText>
			        <CardActions>
			          <FlatButton label="Images" onTouchTap={() => this.props.onSurf(x)} />
			          {this.props.delete ?
			          		<FlatButton label="Delete" onTouchTap={() => this.props.delete(x)} />
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
	delete: React.PropTypes.func
}