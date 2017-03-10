import React from 'React'
import LinkItem from './LinkItem'
import axios from 'axios'

class Posts extends React.Component {
	constructor() {
		super()
		this.state = {
			links: []
		}
	}
	componentDidMount() {
		axios
			.get('/api/get_links')
			.then((response) => {
				this.setState({
					links: Array.concat(this.state.links, response.data.results)
				})
			})
	}
	deleteLink(key){
		axios
			.post('/api/delete', {
				url: this.links[key].url
			})
			.then((response) => {
				this.setState({
					alert: 'Success!'
				})
			})
			.catch((e) => {
				this.setState({
					alert: e
				})
			})
	}
	render() {
		return (
			<div>
			{
				this.state.links.map((link, key) => {
					<LinkItem
						key={key}
						url={link.url}
						headline={link.headline}
						imgSrc={link.id}
						large={false}
						onClick={() => this.deleteLink(key)}
					></LinkItem>
				})
			}
			</div>
		)
	}
}