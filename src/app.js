import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import { EditorState, Modifier, ContentState } from "draft-js";
import _ from "lodash";

import UserPanel from "./user/user-panel";
import MessagePanel from "./message/message-panel";


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      previewState: EditorState.createEmpty(),
      clickedAtLeastOnce: false,
      currentTab: "custom-message-editor",
      currentUser: {}
    };
  }

  onChange = editorState => {
    this.setState({ editorState, clickedAtLeastOnce: true });
  };

  insertText = text => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const modified = Modifier.insertText(contentState, selection, text);
    return EditorState.push(editorState, modified, "insert-fragment");
  };

  setText = text => {
    return EditorState.createWithContent(ContentState.createFromText(text));
  };

  onUserAttributeClick = key => () => {
    if (this.state.clickedAtLeastOnce) {
      const newEditorState = this.insertText(`{{${key}}}`);
      this.setState({ editorState: newEditorState });
    }
  };

  handleTabChange = tab => {
    const newState = {
      currentTab: tab
    };

    if (tab === "message-preview") {
      _.merge(newState, { previewState: this.setText(this.replaceMarks(this.state.editorState.getCurrentContent().getPlainText())) });
    }

    this.setState({ ...newState });
  };

  searchUser = () => this.setState({ loadingUser: true }, () => setTimeout(() =>
    this.setState({ currentUser: { email: "sdfghjk@gmail.com", firstName: "michelle", lastName: "piece" }, loadingUser: false })
      , 2000));

  replaceMarks = message => {
    let result = message;
    _.forEach(this.state.currentUser, (value, key) => {
      result = result.split(`{{${key}}}`).join(value);
    });
    return result;
  };

  render() {
    return (
      <Grid fluid className="pt-1">
        <Row className="flexRow">
          <UserPanel
            user={this.state.currentUser}
            onClick={this.onUserAttributeClick.bind(this)}
            disabled={!this.state.clickedAtLeastOnce}
            currentTab={this.state.currentTab}
            onSearch={this.searchUser.bind(this)}
            loadingUser={this.state.loadingUser}
            xs={3}
            sm={3}
            md={3}
            lg={3}
          />

          <MessagePanel
            state={this.state.currentTab === "message-preview" ? this.state.previewState : this.state.editorState}
            onChange={this.onChange.bind(this)}
            currentTab={this.state.currentTab}
            handleTabSelect={this.handleTabChange.bind(this)}
            changeFocus={this.changeFocus}
            xs={9}
            sm={9}
            md={9}
            lg={9}
          />
        </Row>
      </Grid>
    );
  }
}
