import React, { Component } from "react";
import { Col, Nav, NavItem, Button } from "react-bootstrap";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";

export default class MessagePanel extends Component {
  constructor() {
    super();

    const mentions = [
      {
        name: "Matthew Russell",
        link: "https://twitter.com/nikgraf",
        avatar: "https://avatars0.githubusercontent.com/u/223045?v=3&s=40",
      }
    ];

    this.state = {
      mentions,
      suggestions: mentions
    };

    this.plugins = [createMentionPlugin({
      mentions: this.state.mentions
    })];
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.state.mentions)
    });
  };

  // TODO GET SUGGESTION NAME AND PUT IT INTO BRACKETS {{ <NAME> }}
  onAddMention = suggestions => console.log(suggestions._root.entries[0][1]);

  render() {
    const { MentionSuggestions } = this.plugins[0];
    const { xs, sm, md, lg, onChange, state, currentTab, handleTabSelect } = this.props;

    return (
      <Col xs={xs} sm={sm} md={md} lg={lg}>
        <Nav bsStyle="tabs" activeKey={currentTab} onSelect={handleTabSelect}>
          <NavItem eventKey={"custom-message-editor"}>Liquid Message</NavItem>
          <NavItem eventKey={"message-preview"}>Preview</NavItem>
          <Button bsStyle="success" bsClass="btn btn-success my-button">Save message</Button>
        </Nav>
        <Editor blockStyleFn={() => "custom-editor"} editorState={state} onChange={onChange} plugins={this.plugins}/>
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
        />
      </Col>
    );
  }
}
