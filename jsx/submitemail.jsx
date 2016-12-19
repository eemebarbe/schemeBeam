import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';

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
        var self = this;
        const emailData = {
            email: ReactDOM.findDOMNode(this.refs.emailInput).value,
            hashCode: this.state.hashCode,
            domain: window.location.host
        };
        axios.post('api/v1/newemail', emailData)
        .then(function(response){
            //in the case that the email address is already in the system, redirect to stats page
            if(response.data === 401) {
                axios.get('api/v1/gethashbyemail?email=' + encodeURIComponent(emailData.email))
                .then((response) => {
                    //in the case that they're not yet verified, do not supply them with their referral code or stats page
                    if(response.data === 402) {
                        alert("your account isn't verified yet!");
                    } else {
                        var redirectHash = response.data[0].referralcode;
                        hashHistory.push('/stats/' + redirectHash);
                    }
                });
            } else {
                hashHistory.push('/thanks');
            }
        });
    }

    render() {
            if(this.state.realHash === true || this.state.hashCode === undefined){
                var checkHash = (
                    <div>
                        <div className="headerTitle">schemeBeam</div>
                        <form>
                            <input ref="emailInput" className="inputText" type="text" />
                            <button onClick={this.postEmail.bind(this)} ref="emailSubmit" className="inputButton">Submit</button>
                        </form>
                    </div>
                );
            } else {
                var checkHash = (
                    <div>Not a valid referral link!</div>
                );
            }

        return(
            <div className="headerBox">
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
            <div className="headerBox">
                <div className="headerTitle">Thanks!</div>
                <div>Check your email for your referral link!</div>
            </div>
        )
    }
}
