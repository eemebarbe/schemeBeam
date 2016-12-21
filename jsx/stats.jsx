import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as settings from '../settingsconfig.js';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hashCode : this.props.routeParams.hashCode,
            rank : 0
        };
    }

    componentWillMount() {
        axios.get('api/v1/getrank/' + this.state.hashCode)
        .then((response) => {
            this.setState({
                rank : response.data[0].row_number
            });
        });
    }

    prizeRange() {
        if( this.state.rank <= settings.prizeRange){
            return (
                 <div>Congratulations, you're in the top {settings.prizeRange}! Other participants can still push you out of your rank, so keep referring friends to secure your spot!</div>
            )
        } else {
            return (
            <div>You're not in the top {settings.prizeRange}! Get more referrals to improve your ranking!</div>
            )
        }
    };

    render() {
        return(
            <div className="headerBox">
                <div className="headerTitle">Your rank is #{this.state.rank}</div>
                {this.prizeRange()}
            </div>
        )
    }
}

export default Stats;