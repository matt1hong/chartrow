import React from 'react';
import axios from 'axios';
import BurgerMenu from 'react-burger-menu';
import $ from 'jquery';
const Menu = BurgerMenu['slide']

const styles = {
    bmBurgerButton: {
        width: '36px',
        height: '30px',
        position: 'relative'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px',
        color: 'black'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: 'white',
        padding: '2.5em 1.5em 0',
        fontSize: '1.08em',
        zIndex: 100,
        textAlign: 'left'
    },
    bmMenuWrap: {
        zIndex: 99
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: 'black',
        padding: '0.8em'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
};

class Sidebar extends React.Component {
    constructor(){
        super()
        this.state = {
            buttonText: 'Send',
            disableButton: false
        }
        this.subscribeDone = this.subscribeDone.bind(this)
        this.subscribeFail = this.subscribeFail.bind(this)
    }
    componentDidMount() {
        // Variable to hold request
        var request;
        let done = this.subscribeDone
        let fail = this.subscribeFail
        // Bind to the submit event of our form
        $("#subscribe").submit(function(event){
            // Prevent default posting of form
            event.preventDefault();

            // Abort any pending request
            if (request) {
                request.abort();
            }
            // setup some local variables
            var $form = $(this);

            // Let's select and cache all the fields
            var $inputs = $form.find("input, select, button, textarea");

            // Serialize the data in the form
            var serializedData = $form.serialize();

            // Let's disable the inputs for the duration of the Ajax request.
            // Note: we disable elements AFTER the form data has been serialized.
            // Disabled form elements will not be serialized.
            $inputs.prop("disabled", true);

            // Fire off the request to /form.php
            request = $.ajax({
                url: "https://script.google.com/macros/s/AKfycbwwoDDHUAn5YTbiwIiY1dUdldEVsdqanVV34zEwoe9RVwvuz4Za/exec",
                type: "post",
                data: serializedData
            });

            // Callback handler that will be called on success
            request.done(done);

            // Callback handler that will be called on failure
            request.fail(fail);

            // Callback handler that will be called regardless
            // if the request failed or succeeded
            request.always(function () {
                // Reenable the inputs
                $inputs.prop("disabled", false);
            });

        });
    }
    subscribeDone(response, textStatus, jqXHR){
        this.setState({
            disableButton: true,
            buttonText: 'Success!'
        })
    }
    subscribeFail(response, textStatus, jqXHR){
        this.setState({
            buttonText: 'Try again'
        })
    }
	render(){
		return (
            <div id='outer-container' style={{position: 'absolute', top: 0, left: 0}}>
    			<Menu 
                    customBurgerIcon={false}
                    isOpen={this.props.isOpen}
                    pageWrapId={'home'} 
                    outerContainerId={'container'}
                    styles={styles} 
                    onStateChange={this.props.isMenuOpen}>
                    <span style={{fontFamily: 'VT323', fontSize: 36, fontWeight: 'bold'}}>FILTERS</span>
                    <br/>
                    <span style={{fontWeight: 'bold'}}>Themes</span>
                    {
                        this.props.themes
                            .map((tag,key)=>{
                                return (<a 
                                    className="menu-item button"
                                    id={tag}
                                	key={key}
                                    style={{cursor: 'pointer'}}
                                	onClick={()=>this.props.onFilterClick(tag)}>
                                	{tag}</a>)
                            })
                    } 
                    <br/>
                    <span style={{fontWeight: 'bold'}}>Genres</span>
                    {
                        this.props.genres
                            .map((tag,key)=>{
                                return (<a 
                                    className="menu-item button"
                                    id={tag}
                                	key={key}
                                    style={{cursor: 'pointer'}}
                                	onClick={()=>this.props.onFilterClick(tag)}>
                                	{tag}</a>)
                            })
                    }
                    <br/><hr /><br/>
                    <div style={{fontSize: '0.8em'}}>
                    <form id='subscribe'>
                        <p>
                            <label>Subscribe to our weekly digest!</label><br/>
                            <input id='email' name='email' type='email' placeholder='Email'/>
                            &nbsp;&nbsp;
                            <button type='submit' disabled={this.state.disableButton}>{this.state.buttonText}</button>
                        </p>
                        
                    </form>
                    <span>
                        For submissions, contact the creator <a href="https://twitter.com/ChartrowCOM">@ChartrowCOM</a>. Personal blog posts are welcome!
                    </span>
                    <br/>
                    <br/>
                    <span>
                        We will not link to content behind paywalls. For NYT content, visit <a href="collection.marijerooze.nl">collection.marijerooze.nl</a>.
                    </span>
                    </div>
    			</Menu>
            </div>)
	}
}

Sidebar.propTypes = {
	tags: React.PropTypes.array,
	onFilterClick: React.PropTypes.func,
    isOpen: React.PropTypes.bool,
    isMenuOpen: React.PropTypes.func,
    genres: React.PropTypes.array,
    themes: React.PropTypes.array
}

export default Sidebar;