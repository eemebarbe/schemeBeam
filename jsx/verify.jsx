import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

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
            var verfication = (
            <div className="headerBox">
                <div className="headerTitle">You're verified!</div>
                <div>You can now share your referral link!</div>
            </div> 
            );          
        } else {
            var verfication = (
            <div className="headerBox">
                <div className="headerTitle">Not a valid referral code!</div>
                <div>Check your link and try again.</div>
            </div> 
            );
        }
        return(
            <div>
                {verfication}
            </div>
        )
    }
}
