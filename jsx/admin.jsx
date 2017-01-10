import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { hashHistory } from 'react-router';
import d3 from 'd3';


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

    logOut() {
        axios.post('/logout')
        .then((response) => {
            hashHistory.push('/login');
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
                <button className="button leftButton" onClick={() => this.downloadCsv('fullList')}>Download Full CSV</button>
                <button className="button" onClick={() => this.downloadCsv('winnersList')}>Download Winners CSV</button>
                <div className="dataContainer">Total email addresses collected: {this.state.totalCollected}</div>
                <button onClick={this.logOut.bind(this)} className="button">Log Out</button>
                </div>
            </div>
        )
    }
}


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showWarning : 'none',
            warningMessage : null
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
            hashHistory.push('/admin');
        })
        .catch(() => {
            this.setState({
                showWarning : 'block',
                warningMessage : 'Incorrect credentials'
            });
        });
    }

    render() {
        return(
            <div>
            <div className="headerTitle">Log In</div>
                <form className="logInBox">
                    <input ref="usernameInput" className="inputText" type="text" placeholder="username"/>
                    <input ref="passwordInput" className="inputText" type="text" placeholder="password"/>
                    <button onClick={this.logIn.bind(this)} ref="adminSubmit" className="inputButton button">Submit</button>
                    <div className="warningBox" style={{display: this.state.showWarning}}>{this.state.warningMessage}</div>
                </form>
            </div>
        )
    }
}

