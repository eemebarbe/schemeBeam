import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import * as settings from '../config/settingsconfig.js';


export class SubmitEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hashCode : this.props.routeParams.hashCode,
            realHash : false
        };
    }

    componentWillMount() {
        axios.get('api/v1/checkhash/' + this.state.hashCode)
        .then((response) => {
            if(response.data === 200) {
                this.setState({
                    realHash : true
                });
            }
        });
    }

    postEmail(e) {
        e.preventDefault();

        const self = this;
        const emailData = {
            email: ReactDOM.findDOMNode(this.refs.emailInput).value,
            hashCode: this.state.hashCode,
            domain: window.location.host
        };
        //if email form is blank when submission button is clicked
        if (!emailData.email) {
            alert('Please enter your email address!');
        //if form is not blank, do a regex check
        } else if (emailData.email !== null || emailData.email !== '') {
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(emailData.email)) {
                alert('Not a valid email address!');
            //if it passes, log new email
            } else {
                axios.post('api/v1/newemail', emailData)
                .then((response) => {
                    //in the case that the email address is already in the system, redirect to stats page
                    if(response.data === 401) {
                        axios.get('api/v1/gethashbyemail?email=' + encodeURIComponent(emailData.email))
                        .then((response) => {
                            //in the case that they're not yet verified, do not supply them with their referral code or stats page
                            if(response.data === 402) {
                                alert("your account isn't verified yet!");
                            } else {
                                const redirectHash = response.data[0].referralcode;
                                hashHistory.push('/stats/' + redirectHash);
                            }
                        });
                    } else {
                        hashHistory.push('/thanks');
                    }
                });
            }
        }
    }

    render() {
            if(this.state.realHash === true || this.state.hashCode === undefined){
                var checkHash = (
                    <div>
                        <div className="headerTitle">schemeBeam</div>
                        <div className="landerPageMessage">{settings.landerPageMessage}</div>
                        <form>
                            <input ref="emailInput" className="inputText" type="text" placeholder="Enter your email here." />
                        </form>
                        <button onClick={this.postEmail.bind(this)} ref="emailSubmit" className="inputButton button">Submit</button>
                    </div>
                );
            } else {
                var checkHash = (
                    <div>Not a valid referral link!</div>
                );
            }

        return(
            <div>
                {checkHash}
            </div>
        )
    }
}

export class Thanks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return(
            <div>
                <div className="headerTitle">Thanks!</div>
                <div className="secondaryHeader">Check your email for your referral link, and make sure you verify the link before you start sharing!</div>
            </div>
        )
    }
}
