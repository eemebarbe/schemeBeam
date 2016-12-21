import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';

class Verify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hashCode : this.props.routeParams.hashCode,
            verified : false
        };
    }

    componentWillMount() {
        axios.get('api/v1/verifyhash/' + this.state.hashCode)
        .then((response) => {
            console.log(response.data);
            if(response.data === 200) {
                this.setState({
                    verified : true
                });
            }
        });
    }

    render() {
        if(this.state.verified === true) {
            var referralLink = window.location.hostname + "/#/" + this.state.hashCode;
            var referralLink = referralLink.toString();
            var verification = (
            <div className="headerBox">
                <div className="headerTitle">You're verified!</div>
                <div>You can now share your referral link!</div>
                <a href={"https://www.facebook.com/sharer/sharer.php?u=" + referralLink}><i className="fa fa-facebook-square fa-3x" aria-hidden="true"></i></a>
                <a href={"https://twitter.com/home?status=" + referralLink}><i className="fa fa-twitter-square fa-3x" aria-hidden="true"></i></a>
                <a href={"https://plus.google.com/share?url=" + referralLink}><i className="fa fa-google-plus-square fa-3x" aria-hidden="true"></i></a>
            </div>
            );          
        } else {
            var verification = (
            <div className="headerBox">
                <div className="headerTitle">Not a valid referral code!</div>
                <div>Check your link and try again.</div>
            </div> 
            );
        }
        return(
            <div>
                {verification}
            </div>
        )
    }
}

export default Verify;
