import React, { Component } from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import base64 from 'base-64';

const localStorageAuthToken = localStorage.getItem('auth_token');
const AUTH_TOKEN = 'Token ' + localStorageAuthToken;
const apiBaseURL = 'http://localhost:8000/';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      app_name: 'ACxAC',
      isLoggedIn: localStorageAuthToken === null ? false : true,
    }
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    if (isLoggedIn) {
      return (
        <div>
          {isLoggedIn ? 'Welcome!' : <Login/>}
          <hr></hr>
          <h6>Search Client</h6>
          <FilterableClientTable />
          <hr></hr>
          <h6>Add Client</h6>
          <NewClientForm />
          <hr></hr>
          <h6>New Appointment</h6>
          <NewAppointmentForm />
        </div>
      )
    } else {
      return (
        <Login />
      )
    } 
  }
}




class ClientRow extends React.Component {
  render() {
    const client = this.props.client;

    return (
      <tr>
        <td>{client.first_name}</td>
        <td>{client.contact_number}</td>
      </tr>
    );
  }
}


class ClientTable extends React.Component {
  render() {
    const filterText = this.props.filterText;
    const rows = [];

    this.props.clients.forEach((client) => {
      if (client.first_name.toLowerCase().indexOf(filterText) === -1) {
        return;
      }
      rows.push(
        <ClientRow
          client={client}
          key={client.uuid}
        />
      );
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact No.</th>
          </tr>
        </thead>
        <tbody>{filterText ? rows: false}</tbody>
      </table>
    );
  }
}



class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }
  
  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }
  
  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
      </form>
    );
  }
}


class FilterableClientTable extends Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      filterText: '',
    }

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  componentDidMount() {
    const clientList = 'http://localhost:8000/appointment/api/clients/';
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    }
    fetch(clientList, headers)
      .then(response => response.json())
      .then(response => {
        this.setState({
          clients: response,
        });
      })
  }

  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }
  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          onFilterTextChange={this.handleFilterTextChange}
        />
        <ClientTable
          clients={this.state.clients}
          filterText={this.state.filterText}
        />
      </div>
    )
  }
}

export default App;


function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}


class NewAppointmentForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        startDate: moment().add(1, 'days'),
        client: '',
        notes: '',
        selectedServices: [],
        clientOptions: [],
        serviceOptions: [],
        tagOptions: [],
        error: false,
        appointmentCreated: false,
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClientChange = this.handleClientChange.bind(this);
      this.handleSelectedServicesChange = this.handleSelectedServicesChange.bind(this);
      this.handleSelectedTagsChange = this.handleSelectedTagsChange.bind(this);
    }

    componentDidMount() {
      const clientList = 'http://localhost:8000/appointment/api/clients/';
      const headers = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        }
      }

      fetch(clientList, headers)
        .then(response => response.json())
        .then(response => {
          let clientOptions = response.map(client => {
            return {
              value: client.id,
              label: client.first_name,
            };
          });
          this.setState({
            'clientOptions': clientOptions,
          });
        })

      const serviceList = 'http://localhost:8000/appointment/api/services/';

      fetch(serviceList, headers)
        .then(response => response.json())
        .then(response => {
          let serviceOptions = response.map(service => {
            return {
              value: service.uuid,
              label: service.name,
            }
          });
          this.setState({
            serviceOptions: serviceOptions,
          })
        })

      const tagList = 'http://localhost:8000/appointment/api/tags/';

      fetch(tagList, headers)
        .then(response => response.json())
        .then(response => {
          let tagOptions = response.map(tag => {
            return {
              value: tag.id,
              label: tag.name,
            }
          });
          this.setState({
            tagOptions: tagOptions,
          });
        })
    }

    handleSubmit(event) {
      event.preventDefault();
      let postData = {
        client: this.state.client,
        datetime: this.state.startDate,
        notes: this.state.notes,
        tags: this.state.tags,
        services: this.state.selectedServices,
      }
      let headers = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        },
        body: JSON.stringify(postData),
      }

      const createAppointmentEndpoint = 'http://localhost:8000/appointment/api/appointments/';
      fetch(createAppointmentEndpoint, headers)
        .then(handleErrors)
        .then(response => {
          console.log('app created');
          this.setState({
            error: false,
            appointmentCreated: true,
            startDate: moment().add(1, 'days'),
            // client: '',
            // selectedServices: [],
            // selectedTags: [],
            notes: '',
          });
        })
        .catch(error => {
          this.setState({
            error: true,
          })
        })
      }

    handleInputChange(event) {
      if (event._isAMomentObject) {
        this.setState({
          startDate: event,
        });
        return;
      } 
      const target = event.target;
      const value = target.value;
      const name = target.name

      this.setState({
        [name]: value,
      });
    }

    handleClientChange(selectedOption) {
      const value = selectedOption === null ? '' : selectedOption.value;

      this.setState({
        client: value,
      });
    }

    handleSelectedServicesChange(selectedOptions, k) {
      const selectedServicesIDs = selectedOptions.map(option => {
        return option.value;
      });
      this.setState({
        'selectedServices': selectedServicesIDs,
      });
    }

    handleSelectedTagsChange(selectedOptions){
      const selectedTags = selectedOptions.map(option =>{
        return option.value;
      });
      this.setState({
        'tags': selectedTags,
      })
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit} id="appointmentForm">
          {this.state.appointmentCreated && 
            <div className="alert alert-success" role="alert">
              Appointment created!
            </div>
          }
          {this.state.error && 
            <div className="alert alert-danger" role="alert">
              Please review errors below.
            </div>
          }
          <div className="form-group">
            <label htmlFor="client">Client:</label>
            <Select
              isClearable={true}
              onChange={this.handleClientChange}
              options={this.state.clientOptions}
              name="client"
              inputProps={{id: "client"}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date & Time:</label>
            <DatePicker
                id="date"
                selected={this.state.startDate}
                onChange={this.handleInputChange}
                showTimeSelect
                timeIntervals={30}
                dateFormat="LLL"
                timeCaption="time"
                className="form-control"
                minDate={moment()}
                minTime={moment().hours(7).minutes(0)}
                maxTime={moment().hours(21).minutes(0)}
                monthsShown={2}
            />
          </div>
            <div className="form-group">
              <label htmlFor="service">Services:</label>
              <Select
                options={this.state.serviceOptions}
                onChange={this.handleSelectedServicesChange}
                name="service"
                isMulti={true}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags:</label>
                <CreatableSelect
                  isMulti={true}
                  options={this.state.tagOptions}
                  onChange={this.handleSelectedTagsChange}
                  inputProps={{id: "tags"}}
                />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes:</label>
                <textarea
                  name="notes"
                  id="notes"
                  value={this.state.notes}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Notes"
                >
                </textarea>
            </div>
          <input className="btn btn-primary" type="submit" value="Submit" />
        </form>
      )
    }
}


class NewClientForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        first_name: '',
        last_name: '',
        contact_number: '',
        clientCreated: false,
        error: false,
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name

      this.setState({
        [name]: value,
      })
    }

    handleSubmit(event) {
      event.preventDefault();
      const postData = JSON.stringify(this.state);
      const createClient = 'http://localhost:8000/appointment/api/clients/';
      const headers = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        },
        body: postData,
      }
      fetch(createClient, headers)
        .then(handleErrors)
        .then(response => {
          this.setState({
            clientCreated: true,
            error: false,
            first_name: '',
            last_name: '',
            contact_number: '',
          });
        })
        .catch(error => {
          this.setState({
            error: true,
          });
        });
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          {this.state.clientCreated && 
            <div className="alert alert-success" role="alert">
              Client created!
            </div>
          }
          {this.state.error && 
            <div className="alert alert-danger" role="alert">
              Please review errors below.
            </div>
          }
          <div className="form-group">
            <label htmlFor="first_name">First Name:</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={this.state.first_name}
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="Enter first name"
              />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={this.state.last_name}
              onChange={this.handleInputChange}
              className="form-control"
              placeholder="Enter last name"
            />
          </div>
          <div className="form-group">
          <label htmlFor="contact_number">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={this.state.contact_number}
              onChange={this.handleInputChange}
              id="contact_number"
              className="form-control"
              placeholder="Enter contact number"
            />
          </div>
          <input className="btn btn-primary" type="submit" value="Submit" />
        </form>
      )
    }
}


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loginResult: '',
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const credentials = {
      username: this.state.username,
      password: this.state.password,
    }

    const postData = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    }
    const obtainAuthTokenURL = apiBaseURL + 'auth/';

    fetch(obtainAuthTokenURL, postData)
      .then(response => response.json())
      .then(response => {
        if (response.non_field_errors) {
          this.setState({
            loginResult: response.non_field_errors[0],
          });
        } else {
          localStorage.setItem('auth_token', response.token);
          window.location.reload();
        }
      });
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username  }
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          {this.state.loginResult}
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}