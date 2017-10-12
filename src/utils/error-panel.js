import React from "react";

export const ErrorPanel = props => {
  const {
    primaryMessage = "We are having some issues with fetching slack data...",
    secondaryMessage = "Please try again in a minute"
  } = props;

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3 col-sm-offset-2 col-sm-8 col-xs-offset-1 col-xs-10 mt-2 panel">
        <div className="panel-body text-center">
          <div className="mb-1">
            <h1 className="mb-0 mt-05">
              <i className="icon icon-hull" style={{ "font-size": "64px;" }}/>
            </h1>
            <h5 className="uppercase text-accented underlined mb-1">{primaryMessage}</h5>
            <h6 className="uppercase text-accented mb-1">{secondaryMessage}</h6>
          </div>
        </div>
      </div>
    </div>
  );
};
