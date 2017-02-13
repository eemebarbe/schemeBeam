import React from 'react';
import axios from 'axios';


export class Sharebox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verified : false
        };
    }
    render(){
        var referralLink = window.location.hostname + "/#/" + this.props.hashCode;
        var referralLink = referralLink.toString();
        var referralLinkEncoded = encodeURIComponent(referralLink);
        return(
            <div>
                <div className="referralLink">{referralLink}</div>
                <div className="shareCase">
                    <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + referralLink}><i className="fa fa-facebook-square fa-2x" aria-hidden="true"></i></a>
                    <a target="_blank" href={"https://twitter.com/home?status=" + referralLinkEncoded}><i className="fa fa-twitter-square fa-2x" aria-hidden="true"></i></a>
                    <a target="_blank" href={"https://www.linkedin.com/shareArticle?mini=true&url=" + referralLinkEncoded + "&title=&summary=&source="}><i className="fa fa-linkedin-square fa-2x" aria-hidden="true"></i></a>
                    <a target="_blank" href={"https://plus.google.com/share?url=" + referralLink}><i className="fa fa-google-plus-square fa-2x" aria-hidden="true"></i></a>
                </div>
            </div>
        )
    }
}

export class Verify extends React.Component {
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
            if(response.data === 200) {
                this.setState({
                    verified : true
                });
            }
        });
    }

    render() {
        if(this.state.verified === true) {
            var verification = (
            <div className="headerBox">
                <div className="headerTitle">You're verified!</div>
                <div className="secondaryHeader">You can now share your referral link!</div>
                <Sharebox hashCode={this.state.hashCode} />
            </div>
            );          
        } else {
            var verification = (
            <div className="headerBox">
                <div className="headerTitle">Not a valid referral code!</div>
                <div className="secondaryHeader">Check your link and try again.</div>
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
