import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div className="text-center">
        <h1>Welcome to ReportFactory</h1>
        <img src="/style/assets/img/rf-apple-icon.png" alt="Report Factory Gears" title="Report Factory Gears"></img>
        <p>
          See <a href="https://github.com/igor-starostenko/report_factory-web">github</a> for more info.
        </p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }
}
