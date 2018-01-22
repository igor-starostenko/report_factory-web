import React, { Component } from 'react';
import Navbar from './navbar';

class App extends Component {
  render() {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div className="container tim-container">
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default App;
