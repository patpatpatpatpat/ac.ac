import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

const AUTH_TOKEN = 'Token 2bfe8ad54fe5f59e12f84391b69cc80fd30b577c';

export default class AppointmentTagOption extends Component {
    constructor(props) {
      super(props);
      this.state = {
          tagOptions: [],
          value: undefined,
      };
    }

    componentDidMount() {
      const headers = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        }
      }

    }

    render() {
        return (
            <CreatableSelect
                isMulti
                options={this.state.tagOptions}
            />
        )
    }
}