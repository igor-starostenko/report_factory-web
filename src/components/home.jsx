import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to ReportFactory</h1>
        <div>
          See <a href="https://github.com/igor-starostenko/report_factory-web">github</a> for more info.
        </div>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }
}
