import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { hashHistory } from 'react-router';
import rd3 from 'rd3';

export class Pie extends React.Component {


    render() {
    const PieChart = rd3.PieChart
    const verifiedPercentage = ((this.props.numberOfVerified / this.props.totalCollected)*100).toFixed(1);
    const unverifiedPercentage = ((this.props.numberOfUnverified / this.props.totalCollected)*100).toFixed(1);
    const pieData = [{value: verifiedPercentage}, {value: unverifiedPercentage}];
        return(
            <div className="pieChart">
                <PieChart
                  data={pieData}
                  width={220}
                  height={220} 
                  radius={110}
                  showOuterLabels={false}
                  showInnerLabels={true}
                  hoverAnimation={false}
                  innerRadius={0}
                  sectorBorderColor="white"/>
            </div>
        )
    }
}


export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCollected : 0,
            numberOfVerified : null,
            numberOfUnverified : null
        };
    }

    componentDidMount() {
        axios.get('/api/v1/count/')
        .then((response) => {
            this.setState({
                totalCollected : response.data[0].count
            });
        });
        axios.get('/api/v1/countverified/')
        .then((response) => {
            const unverified = this.state.totalCollected - response.data[0].count;
            this.setState({
                numberOfVerified : response.data[0].count,
                numberOfUnverified : unverified
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
                <div className="csvButtons">
                    <button className="button leftButton" onClick={() => this.downloadCsv('fullList')}>Download Full CSV</button>
                    <button className="button" onClick={() => this.downloadCsv('winnersList')}>Download Winners CSV</button>
                </div>
                <div className="totalEmails">Total email addresses collected: {this.state.totalCollected}</div>
                <Pie totalCollected={this.state.totalCollected}
                    numberOfVerified={this.state.numberOfVerified}
                    numberOfUnverified={this.state.numberOfUnverified} />
                <div className="dataContainer">
                    <div className="pieDataLine">
                        <div className="pieDataBox pieDataBoxVerified"></div>
                        <div className="pieTitle">{this.state.numberOfVerified} verified emails</div>
                    </div>
                    <div className="pieDataLine">
                        <div className="pieDataBox pieDataBoxUnverified"></div>
                        <div className="pieTitle">{this.state.numberOfUnverified} unverified emails</div>
                    </div>
                </div>
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
                    <input ref="passwordInput" className="inputText" type="password" placeholder="password"/>
                    <button onClick={this.logIn.bind(this)} ref="adminSubmit" className="inputButton button">Submit</button>
                    <div className="warningBox" style={{display: this.state.showWarning}}>{this.state.warningMessage}</div>
                </form>
            </div>
        )
    }
}

