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

    postEmail() {
        const emailData = {
            email: ReactDOM.findDOMNode(this.refs.emailInput).value,
            hashCode: this.state.hashCode,
            domain: window.location.host
        };
        axios.post('api/v1/newemail', emailData)
        .then(function(response){
            console.log(response);
        });
    }

    render() {
            if(this.state.realHash === true || this.state.hashCode === undefined){
                var checkHash = (
                    <div>
                        <div className="headerTitle">schemeBeam</div>
                        <form>
                            <input ref="emailInput" className="inputText" type="text" />
                            <Link to='thanks'><button onClick={this.postEmail.bind(this)} ref="emailSubmit" className="inputButton">Submit</button></Link>
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
            <Route path=':hashCode' component={SubmitEmail}></Route>
            <Route path='verify/:hashCode' component={Verify}></Route>
		</Route>
	</Router>,
document.getElementById('content'));