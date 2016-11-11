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
        };
    }

    postEmail() {
        const emailData = {
            email: ReactDOM.findDOMNode(this.refs.emailInput).value,
        };
        axios.post('api/v1/newemail', emailData)
        .then(function(response){
            console.log(response);
        });
    }

    render() {
    	return(
			<div className="headerBox">
    			<div className="headerTitle">schemeBeam</div>
				<form>
					<input ref="emailInput" className="inputText" type="text" />
					<Link to='thanks'><button onClick={this.postEmail.bind(this)} ref="emailSubmit" className="inputButton">Submit</button></Link>
				</form>
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
			</div>
    	)
    }
}

class FrontPage extends React.Component {
    render() {
    	return(
    		<Lander />
    	)
    }
}


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={Lander}>
			<IndexRoute component={SubmitEmail}></IndexRoute>
			<Route path='thanks' component={Thanks}></Route>
		</Route>
	</Router>,
document.getElementById('content'));