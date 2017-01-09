import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { hashHistory } from 'react-router';


export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCollected : 0
        };
    }

    componentWillMount() {
        axios.get('/api/v1/count/')
        .then((response) => {
            this.setState({
                totalCollected : response.data[0].count
            });
        });
    }

    downloadCsv(csvType) {
        if(csvType === 'fullList') {
            var ajax = '/api/v1/data';
        } else if (csvType === 'winnersList') {
            var ajax = '/api/v1/toprange';
        }
        axios.get(ajax)
        .then((response) => {
            const csvData = response.data;
            var csvList = csvData.map((thisEmail) => {
                return JSON.stringify(thisEmail.emailaddress);
            })
            .join("\r\n")
            .replace(/(^\[)|(\]$)/mg, '');
            var csvList = "Email Address" + "\r\n" + csvList;
            const filename = csvType + '.csv';
            const data = encodeURI(csvList);
            const link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
            link.setAttribute('download', filename);
            link.click();
        });
    }

    render() {
        return(
            <div>
                <div className="headerTitle">Admin Panel</div>
                <div className="adminContainer">
                <div>Total emails collected: {this.state.totalCollected}</div>
                <button className="button" onClick={() => this.downloadCsv('fullList')}>Download Full CSV</button>
                <button className="button" onClick={() => this.downloadCsv('winnersList')}>Download Winners CSV</button>
                </div>
            </div>
        )
    }
}


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    logIn(e){
        e.preventDefault();
        const logInData = {
            username : ReactDOM.findDOMNode(this.refs.usernameInput).value,
            password : ReactDOM.findDOMNode(this.refs.passwordInput).value
        }
        axios.post('/loginAuth', logInData)
        .then((response) => {
            console.log(response);
        })
    }

    render() {
        return(
            <div>
            <div className="headerTitle">Log In</div>
                <form className="logInBox">
                    <input ref="usernameInput" className="inputText" type="text" placeholder="username"/>
                    <input ref="passwordInput" className="inputText" type="text" placeholder="password"/>
                    <button onClick={this.logIn.bind(this)} ref="adminSubmit" className="inputButton button">Submit</button>
                </form>
            </div>
        )
    }
}

