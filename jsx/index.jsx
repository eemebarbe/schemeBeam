import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';


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
    render() {
    	return(
			<div className="headerBox">
    			<div className="headerTitle">schemeBeam</div>
				<form>
					<input className="inputText" type="text" name="email" />
					<Link to='thanks'><button className="inputButton">Submit</button></Link>
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
				<div>Thanks!</div>
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