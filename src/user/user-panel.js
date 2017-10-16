import React, { Component } from "react";
import { Col, ButtonGroup, Button } from "react-bootstrap";
import _ from "lodash";
import flatObject from "flat";

import Search from "./search-panel";

function filterEmptyObjects(object) {
  return _.forEach(object, (value, key) => {
    if (_.isObject(value)) {
      filterEmptyObjects(value);
    }

    if (_.isEmpty(value)) {
      delete object[key];
    }
  });
}

function flatArrays(object) {
  return _.mapValues(object, value => {
    if (_.isArray(value)) {
      return value.join(", ");
    }
    if (_.isObject(value)) {
      return flatArrays(value);
    }
    return value;
  });
}

export default class UserPanel extends Component {
  render() {
    const { xs, sm, md, lg, user, onClick, loadingUser, onSearch } = this.props;

    const userAttributes = _.map(filterEmptyObjects(flatArrays(flatObject(user, { safe: true }))), (value, key) => {
      return <Button
        bsClass="btn btn-default user-attribute-btn"
        onClick={onClick(key)}
      >
        <div>{key.toString()}</div>
        <small>{value.toString()}</small>
      </Button>;
    });

    const search = user && user.user && user.user.email || "";
    return (
      <Col xs={xs} sm={sm} md={md} lg={lg}>
        <Search
          loading={loadingUser}
          userSearch={search}
          onSubmit={onSearch}
        />

        <ButtonGroup bsClass="btn-group-vertical btn-block user-properties-block" vertical block>
          {userAttributes}
        </ButtonGroup>
      </Col>
    );
  }
}
