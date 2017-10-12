import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import _ from "lodash";

export default class MultiSelectPanel extends Component {
  state = {
    selectedValues: []
  };

  handleChange = selectValue => {
    console.log(selectValue);
    this.setState({ selectedValues: selectValue });
  };

  render() {
    const { values, propertyValueName, propertyLabelName, placeholder } = this.props;
    const options = _.map(values, val => ({ value: val[propertyValueName], label: val[propertyLabelName] }));

    return (
      <div>
        <form>
          <Select
            multi={true}
            name="form-field-name"
            value={this.state.selectedValues.map(v => v.value).join(",")}
            options={options}
            onChange={this.handleChange}
            placeholder={placeholder}
          />
        </form>
      </div>
    );
  }
}
