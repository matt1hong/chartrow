import React from 'react';
import Tweet from './Tweet'
import * as colors from 'material-ui/styles/colors'
import HotTub from 'material-ui/svg-icons/places/hot-tub';
import BusinessCenter from 'material-ui/svg-icons/places/business-center';
import BeachAccess from 'material-ui/svg-icons/places/beach-access';
import GolfCourse from 'material-ui/svg-icons/places/golf-course';
import Casino from 'material-ui/svg-icons/places/casino';
import Pool from 'material-ui/svg-icons/places/pool';
import FitnessCenter from 'material-ui/svg-icons/places/fitness-center';
import Spa from 'material-ui/svg-icons/places/spa'
import Infinite from 'react-infinite';

const icons = [HotTub, BusinessCenter, BeachAccess, GolfCourse, Casino, Pool, FitnessCenter, Spa]
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

export default class TweetFeed extends React.Component {

  constructor() {
  	super()
    this.state={
      confirmDelete: false,
      isInfiniteLoading: false
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

  onInfiniteLoad(){
    console.log('load')
    if (this.props.incrementPage) {
      this.props.incrementPage()
      this.props.loadTweets(null, this.stopSpinner.bind(this))
    }
  }

  stopSpinner(){
    this.setState({
      isInfiniteLoading: false
    })
  }

  render() {
    return (
        <Infinite 
          containerHeight={600} 
          elementHeight={100}
          // onInfiniteLoad={this.onInfiniteLoad.bind(this)}
          infiniteLoadBeginEdgeOffset={10}
          isInfiniteLoading={this.state.isInfiniteLoading}>
            {this.props.tweets.map((x,k)=> {
              let text = x.title;
              return (
                <Tweet
                  key={k} 
                  tweet={x} 
                  lastSeen={this.props.lastSeen}
                  color={colors[colorKeys[text.hashCode()%colorKeys.length]]}
                  icon={icons[text.hashCode()%icons.length]}
                  onSurf={this.props.onSurf} 
                  delete={this.props.delete}
                  toDelete={this.toDelete.bind(this)}
                  chosen={this.props.chosen}
                  confirmDelete={this.state.confirmDelete}
                  unlike={this.props.tweetType.toLowerCase() === 'likes' ? this.props.unlike : null}
                  tweetOut={this.props.tweet}
                  ></Tweet>
                  )
              })
            }
        </Infinite>
     
      )
	}
}

TweetFeed.propTypes = {
	tweets: React.PropTypes.array,
	onSurf: React.PropTypes.func,
	delete: React.PropTypes.func,
  chosen: React.PropTypes.string,
  lastSeen: React.PropTypes.string,
  loadTweets: React.PropTypes.func,
  incrementPage: React.PropTypes.func,
  tweetType: React.PropTypes.string,
  unlike: React.PropTypes.func,
  tweet: React.PropTypes.func
}