import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export class Stats extends React.Component {
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

    render() {
        return(
            <div className="headerBox">
                <div className="headerTitle">Your rank is #{this.state.rank}</div>
                <div>Congratulations, you're in the top 50! Other participants can still push you out of your rank, so keep referring friends to secure your spot!</div>
            </div>
        )
    }
}
