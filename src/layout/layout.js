import React, { Component } from "react";

import UserPanel from "../user/user-panel";
import MessagePanel from "../message/message-panel";

export default class Layout extends Component {
  render() {
    const {
      currentUser, onUserAttributeClick, currentTab, onUserSearch,
      loadingUser, onMessageChange, handleTabChange, editorState, previewState
    } = this.props;

    return (
      <div>
        <UserPanel
          user={currentUser}
          onClick={onUserAttributeClick}
          onSearch={onUserSearch}
          loadingUser={loadingUser}
          xs={3}
          sm={3}
          md={3}
          lg={3}
        />

        <MessagePanel
          state={currentTab === "message-preview" ? previewState : editorState}
          onChange={onMessageChange}
          currentTab={currentTab}
          handleTabSelect={handleTabChange}
          xs={9}
          sm={9}
          md={9}
          lg={9}
        />
      </div>
    );
  }
}
