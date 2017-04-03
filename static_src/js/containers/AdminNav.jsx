import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Snackbar from 'material-ui/Snackbar';

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class AdminNav extends Component {
  constructor() {
    super()
    this.state = {
      selectedIndex: 0,
      open: false
    };
  }
 
  componentDidUpdate() {
    if (!this.props.connected && this.state.selectedIndex === 1 && !this.state.open) {
      this.setState({open: true})
    } else if (this.props.connected && this.state.selectedIndex === 1 && this.state.open) {
      this.setState({open: false})
    }
  }

  select (index) {
    this.setState({selectedIndex: index});
  }

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Likes"
            icon={favoritesIcon}
            onTouchTap={() => {this.select(0); this.props.getTweets('Likes')}}
          />
          <BottomNavigationItem
            label="Recents"
            icon={recentsIcon}
            onTouchTap={() => {this.select(1); this.props.getTweets('Recents')}}
          />
        </BottomNavigation>
        <Snackbar
              open={this.state.open}
              message="Client disconnected"
              onRequestClose={this.handleRequestClose}
            />
      </Paper>
    );
  }
}

AdminNav.propTypes = {
  getTweets: React.PropTypes.func,
  connected: React.PropTypes.bool
}

export default AdminNav;