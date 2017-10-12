import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import { EditorState, Modifier, ContentState, RichUtils } from "draft-js";
import _ from "lodash";
import axios from "axios";

import UserPanel from "./user/user-panel";
import MessagePanel from "./message/message-panel";
import { ErrorPanel } from "./utils/error-panel";

export default class App extends Component {
  constructor(props) {
    super(props);

    const editorState = _.reduce(_.range(10), (state) => {
      return RichUtils.insertSoftNewline(state);
    }, EditorState.createEmpty());

    this.state = {
      editorState,
      previewState: EditorState.createEmpty(),
      clickedAtLeastOnce: false,
      currentTab: "custom-message-editor",
      currentUser: {},
      config: props.config,
      slackMembers: [],
      slackChannels: []
    };
  }

  componentDidMount() {
    this.setState({ loadingSlackMembers: true }, () => this.getSlackMembers());
    this.setState({ loadingSlackChannels: true }, () => this.getSlackChannels());
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

  searchUser = search =>
    this.setState({ loadingUser: true }, () => axios.get("user", { params: _.merge({ email: search }, this.state.config) })
      .then(({ data = {}, error }) => {
        if (error) {
          return this.setState({ loadingUser: false, error });
        }

        const { user } = data;
        return this.setState({ loadingUser: false, currentUser: user || {} });
      })
      .catch(error => this.setState({ error }))
    );

  getSlackMembers = () => axios.get("slack-utils", { params: this.state.config })
    .then(({ data = {}, error }) => {
      if (error) {
        return this.setState({ loadingSlackMembers: false, error });
      }
      return this.setState({ loadingSlackMembers: false, slackMembers: data });
    });

  getSlackChannels = () => axios.get("slack-channels", { params: this.state.config })
    .then(({ data = {}, error }) => {
      if (error) {
        return this.setState({ loadingSlackChannels: false, error });
      }
      return this.setState({ loadingSlackChannels: false, slackChannels: data });
    });

  replaceMarks = message => {
    const regex = /{{(([a-z]*[A-Z]*\.*_*-*)*)}}/g;
    return message.replace(regex, (match, userProperty) => _.get(this.state.currentUser, userProperty));
  };

  render() {
    const { loadingSlackMembers, loadingSlackChannels, error } = this.state;

    if (error) {
      return <ErrorPanel/>;
    }

    if (!loadingSlackMembers && !loadingSlackChannels) {
      return (
        <Grid fluid className="pt-1">
          {/* <MultiSelectPanel*/}
            {/* values={this.state.slackMembers}*/}
            {/* propertyValueName={"id"}*/}
            {/* propertyLabelName={"name"}*/}
            {/* placeholder="Select users to whom we will send messages"*/}
          {/* />*/}

           {/* <MultiSelectPanel*/}
            {/* values={this.state.slackChannels}*/}
            {/* propertyValueName={"id"}*/}
            {/* propertyLabelName={"name"}*/}
            {/* placeholder="Select channels to which we will send messages"*/}
          {/* />*/}

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
              xs={9}
              sm={9}
              md={9}
              lg={9}
            />
          </Row>
        </Grid>
      );
    }
    return <div className="text-center pt-2"><h4>Loading Editor...</h4></div>;
  }
}
