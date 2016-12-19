import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Router, Route, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';

import Stats from "./stats.jsx";
import Verify from "./verify.jsx";
import Admin from "./admin.jsx";
import { SubmitEmail, Thanks } from "./submitemail.jsx";


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


ReactDOM.render(
	<Router history={hashHistory}>
		<Route path='/' component={Lander}>
			<IndexRoute component={SubmitEmail}></IndexRoute>
			<Route path='thanks' component={Thanks}></Route>
            <Route path='admin' component={Admin}></Route>           
            <Route path='stats/:hashCode' component={Stats}></Route>
            <Route path=':hashCode' component={SubmitEmail}></Route>
            <Route path='verify/:hashCode' component={Verify}></Route>
		</Route>
	</Router>,
document.getElementById('content'));