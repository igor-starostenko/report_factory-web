import React from 'react';

export default class ConfirmModal extends React.Component {
  buttonColor() {
    return this.props.confirm === 'Delete' ? 'btn-danger' : 'btn-info';
  }

  renderDivider() {
    if (this.props.submit) {
      return (<div className="divider" />);
    }
    return (<div />);
  }

  renderSubmitButton() {
    if (this.props.submit) {
      return (
        <button
          className={`btn ${this.buttonColor()} btn-simple`}
          data-dismiss="modal"
          {...this.props.submit}
        >{this.props.confirm}
        </button>
      );
    }
    return (<div />);
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
              {this.props.content}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default btn-simple"
                data-dismiss="modal"
              >{this.props.close}
              </button>
              {this.renderDivider()}
              {this.renderSubmitButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
