import React, { Component } from "react";
import { Button } from "react-bootstrap";

import Icon from "../icon/icon";

export default class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { userSearch: props.userSearch, dirty: false };
  }

  handleEmailChange(e) {
    if (e && e.target) {
      this.setState({ userSearch: e.target.value, dirty: true });
    }
  }

  handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.props.onSubmit(this.state.userSearch);
  }

  componentWillReceiveProps(nextProps) {
    const { userSearch } = nextProps;
    const state = { dirty: false };
    if (userSearch && userSearch !== this.props.userSearch) {
      state.userSearch = userSearch;
    }
    this.setState(state);
  }

  getIcon() {
    const { loading, error } = this.props;
    const { dirty } = this.state;
    if (loading) return "spinner";
    if (!dirty && error && error.reason === "user_not_found") return "cross";
    if (!dirty) return "valid";
    return "search";
  }

  render() {
    const { loading } = this.props;

    return (
      <form className="form form-light mt-05 mb-05" onSubmit={this.handleSubmit.bind(this)}>
        <div className="search-panel">
          <input type="text" placeholder="Name or Email" value={this.state.userSearch}
                 onChange={this.handleEmailChange.bind(this)} className="form-control form-control-sm"/>
          <Button bsStyle={loading ? "warning" : "default"} bsSize="sm" clasName='btn-pill btn-rounded'
                  onClick={this.handleSubmit.bind(this)}> <Icon className="icon"
                                                                name={this.getIcon()}/> {loading ? "Loading" : "Search"}
          </Button>
        </div>
      </form>
    );
  }
}
