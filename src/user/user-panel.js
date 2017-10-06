import React, { Component } from "react";
import { Col, ButtonGroup, Button } from "react-bootstrap";
import _ from "lodash";

import Search from "./search-panel";

export default class UserPanel extends Component {
  render() {
    const { xs, sm, md, lg, user, onClick, disabled, currentTab, loadingUser, onSearch } = this.props;

    const userAttributes = _.map(user, (value, key) =>
      <Button
        bsClass="btn btn-default user-attribute-btn"
        disabled={disabled || currentTab === "message-preview"}
        onClick={onClick(key)}
      >
        <div>{key}</div>
        <small>{value}</small>
      </Button>
    );

    const search = user && user.user && user.user.email || "";

    return (
      <Col xs={xs} sm={sm} md={md} lg={lg}>
        <Search
          loading={loadingUser}
          userSearch={search}
          onSubmit={onSearch}
        />
        <ButtonGroup vertical block>
          {userAttributes}
        </ButtonGroup>
      </Col>
    );
  }
}
