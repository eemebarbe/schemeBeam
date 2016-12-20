import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topRange : 0,
            totalCollected : 0
        };
    }

    componentWillMount() {
        axios.get('/api/v1/config/')
        .then((response) => {
            this.setState({
                topRange : response.data[0].winnerRange
            });
        });
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
            var csvData = response.data;
            var csvList = csvData.map((thisEmail) => {
                return JSON.stringify(thisEmail.emailaddress);
            })
            .join("\r\n")
            .replace(/(^\[)|(\]$)/mg, '');
            var csvList = "Email Address" + "\r\n" + csvList;
            var filename = csvType + '.csv';
            var data = encodeURI(csvList);
            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
            link.setAttribute('download', filename);
            link.click();
        });
    }

    render() {
        return(
            <div>
                <div>Top range for winners: {this.state.topRange}<button>Change</button></div>
                <div>Total emails collected: {this.state.totalCollected}</div>
                <button onClick={() => this.downloadCsv('fullList')}>Download Full CSV</button>
                <button onClick={() => this.downloadCsv('winnersList')}>Download Winners CSV</button>
            </div>
        )
    }
}

export default Admin;
