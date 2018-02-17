import React from 'react';
import _ from 'lodash';

export default class ConfirmModal extends React.Component {
  buttonColor() {
    return this.props.confirm === 'Delete' ? 'btn-danger' : 'btn-info';
  }

  renderLines() {
    return _.map(this.props.bodyLines, line => (<p key={line.key}>{line.text}</p>));
  }

  render() {
    return (
      <div
        className="modal fade in"
        id={this.props.id}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >×
              </button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.renderLines()}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default btn-simple"
                data-dismiss="modal"
              >Close
              </button>
              <div className="divider" />
              <button
                type="button"
                className={`btn ${this.buttonColor()} btn-simple`}
                data-dismiss="modal"
                onClick={this.props.action}
              >{this.props.confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
