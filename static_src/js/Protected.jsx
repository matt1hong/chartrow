import React from 'react'
import axios from 'axios';
import {hashHistory} from 'react-router';

class Protected extends React.Component {
	
	componentDidmount() {
		this.getUser()
	}

	getUser() {
		axios.get('/api/get_user').then(response => {
	        if (!response.data.success) {
	        	hashHistory.push('/login')
	        } else {

	        }
	    }).catch(e => console.log(e))
	}

	render() {
		return (
			this.props.children
		)
	}
}

Protected.propTypes = {
	children: React.PropTypes.node
}

export default Protected