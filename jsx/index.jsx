import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';


class Lander extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
    	return(
    		<div>
    			<div className="tile">
    			{this.props.children}
				</div>
    		</div>
    	)
    }
}


class SubmitEmail extends React.Component {
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
            if(response.data === 401) {
                axios.get('api/v1/gethashbyemail?email=' + encodeURIComponent(emailData.email))
                .then((response) => {
                    var redirectHash = response.data[0].referralcode;
                    hashHistory.push('/stats/' + redirectHash);
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


class Thanks extends React.Component {
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

    render() {
        return(
            <div className="headerBox">
                <div className="headerTitle">Your rank is #{this.state.rank}</div>
                <div>Congratulations, you're in the top 50! Other participants can still push you out of your rank, so keep referring friends to secure your spot!</div>
            </div>
        )
    }
}


class Data extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    downloadCsv() {
        axios.get('/api/v1/data/')
        .then((response) => {
            var csvData = response.data;
            var csvList = csvData.map((thisEmail) => {
                return JSON.stringify(thisEmail.emailaddress);
            })
            .join()
            .replace(/(^\[)|(\]$)/mg, '');
            var filename = 'emaillist.csv';
            var data = encodeURI(csvList);

            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
            link.setAttribute('download', filename);
            link.click();
        });
    }

    render() {
        return(
            <div className="headerBox">
                <div className="headerTitle">Winners</div>
                <button onClick={this.downloadCsv.bind(this)}>Download CSV</button>
            </div>
        )
    }
}


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
            if(response.data === 200) {
                this.setState({
                    verified : true
                });
            }
        });
    }

    render() {
        return(
            <div className="headerBox">
                <div className="headerTitle">You're verified!</div>
                <div>You can now share your referral link!</div>
            </div>
        )
    }
}



ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={Lander}>
			<IndexRoute component={SubmitEmail}></IndexRoute>
			<Route path='thanks' component={Thanks}></Route>
            <Route path='data' component={Data}></Route>           
            <Route path='stats/:hashCode' component={Stats}></Route>
            <Route path=':hashCode' component={SubmitEmail}></Route>
            <Route path='verify/:hashCode' component={Verify}></Route>
		</Route>
	</Router>,
document.getElementById('content'));