import axios from 'axios';
import {hashHistory} from 'react-router';

export function getUser() {
	axios.get('/api/get_user').then(response => {
        if (response.data.success) {
            
        } else {
        	hashHistory.push('/login')
        }
    }).catch(e => console.log(e))
}