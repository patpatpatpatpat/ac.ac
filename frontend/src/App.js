import React, { Component } from 'react';
import './App.css';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

let AUTH_TOKEN;
const apiBaseURL = 'http://localhost:8000/';

function setToken(token) {
  localStorage.setItem('auth_token', token);
  AUTH_TOKEN = 'Token ' + token;
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      app_name: 'ACxAC',
      isLoggedIn: false,
    }

    this.makeLoggedIn = this.makeLoggedIn.bind(this);
  }

  componentDidMount() {
    let storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      this.setState({
        isLoggedIn: true,
      })
    }
  }

  makeLoggedIn(user) {
    this.setState({
      isLoggedIn: true,
    });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    if (isLoggedIn) {
      return (
        <div>
          Welcome!
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
        <Login
          makeLoggedIn={this.makeLoggedIn}
        />
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
    const clientList = apiBaseURL + 'appointment/api/clients/';
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
      this.defaultTime = moment().hours(7).minutes(0).toDate();
      this.defaultDate = moment().add(1, 'days').toDate();
      this.state = {
        startDate: this.defaultDate,
        time: this.defaultTime,
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
      this.handleDateChange = this.handleDateChange.bind(this);
      this.handleTimeChange = this.handleTimeChange.bind(this);
    }

    componentDidMount() {
      const clientList = apiBaseURL + 'appointment/api/clients/';
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

      const serviceList = apiBaseURL + 'appointment/api/services/';

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

      const tagList = apiBaseURL + 'appointment/api/tags/';

      fetch(tagList, headers)
        .then(response => response.json())
        .then(response => {
          let tagOptions = response.map(tag => {
            return {
              value: String(tag.id),
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

      let appointmentDateTime = new Date(this.state.startDate.toDateString() + ' ' + this.state.time.toTimeString());
      let postData = {
        client: this.state.client,
        datetime: appointmentDateTime,
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

      const createAppointmentEndpoint = apiBaseURL + 'appointment/api/appointments/';
      fetch(createAppointmentEndpoint, headers)
        .then(handleErrors)
        .then(response => {
          this.setState({
            startDate: this.defaultDate,
            time: this.defaultTime,
            error: false,
            appointmentCreated: true,
            notes: '',
          });

        })
        .catch(error => {
          this.setState({
            error: true,
          })
        });
      }

    handleDateChange(value) {
      this.setState({
        startDate: value,
      });
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name

      this.setState({
        [name]: value,
      });
    }

    handleTimeChange(value) {
      this.setState({
        time: value,
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
                onChange={this.handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="form-control"
                minDate={moment().toDate()}
            />
            <DatePicker
                id="time"
                onChange={this.handleTimeChange}
                selected={this.state.time}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="form-control"
                minTime={moment().hours(7).minutes(0).toDate()}
                maxTime={moment().hours(21).minutes(0).toDate()}
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
      const createClient = apiBaseURL +'appointment/api/clients/';
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
          setToken(response.token);
          this.props.makeLoggedIn();
        }
      })
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