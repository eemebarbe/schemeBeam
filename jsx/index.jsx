import React from 'react';
import ReactDOM from 'react-dom';

class SubmissionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            currentPage: 1,
            numberOfPages: null
        };
    }
    render() {
    	return(
    		<div>test 2</div>
    	)
    }

}

class FrontPage extends React.Component {
    render() {
    	return(
    		<SubmissionList />
    	)
    }
}

ReactDOM.render(<FrontPage />, document.getElementById('content'));