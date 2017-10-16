import React, { Component } from "react";
import { Grid, Row } from "react-bootstrap";
import { EditorState, Modifier, ContentState, RichUtils } from "draft-js";
import _ from "lodash";
import axios from "axios";

import { ErrorPanel } from "./utils/error-panel";
import Layout from "./layout/layout";
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
    this.setState({ loadingUser: true }, () => axios.get("user", { params: _.merge({ email: search, events: true }, this.state.config) })
      .then(({ data = {}, error }) => {
        if (error) {
          return this.setState({ loadingUser: false, error });
        }

        const { user, events, segments } = data;
        // TODO MAKE USE OF EVENTS AND SEGMENTS
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
          <Row className="flexRow">
            <Layout
              currentUser={this.state.currentUser}
              onUserAttributeClick={this.onUserAttributeClick.bind(this)}
              clickedAtLeastOnce={this.state.clickedAtLeastOnce}
              currentTab={this.state.currentTab}
              onUserSearch={this.searchUser.bind(this)}
              loadingUser={this.state.loadingUser}
              state={this.state.currentTab === "message-preview" ? this.state.previewState : this.state.editorState}
              onMessageChange={this.onChange.bind(this)}
              handleTabChange={this.handleTabChange.bind(this)}
              editorState={this.state.editorState}
              previewState={this.state.previewState}
            />
          </Row>
        </Grid>
      );
    }
    return <div className="text-center pt-2"><h4>Loading Editor...</h4></div>;
  }
}
