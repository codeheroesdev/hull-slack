import React, { Component } from "react";
import { Col, Nav, NavItem } from "react-bootstrap";
import { Editor } from "draft-js";

export default class MessagePanel extends Component {
  render() {
    const { xs, sm, md, lg, onChange, state, currentTab, handleTabSelect } = this.props;

    return (
      <Col xs={xs} sm={sm} md={md} lg={lg}>
        <Nav bsStyle="pills" activeKey={currentTab} onSelect={handleTabSelect}>
          <NavItem eventKey={"custom-message-editor"} >NavItem 1 content</NavItem>
          <NavItem eventKey={"message-preview"} >NavItem 2 content</NavItem>
        </Nav>
        <Editor blockStyleFn={() => "custom-editor"} editorState={state} onChange={onChange} />
      </Col>
    );
  }
}
