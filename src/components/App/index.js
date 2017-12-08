import React from 'react';
import Dialog from '../../ui/Dialog';
import AuthForm from '../../components/AuthForm';
import MainMenu from '../MainMenu';
import StartButton from '../StartButton';

import Users from '../Users';
import Projects from '../Projects';
import Account from '../Account';

import {dict} from '../../utils/Dictionary';
import {isAuthorized, auth, register, logout} from '../../utils/User';

import '../../index.scss';

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      active: false,
      isAuthorized: isAuthorized()
    };
  }

  render() {
    let {active} = this.state;
    if (!active) {
      return <StartButton onClick={this.handleStartClick}/> 
    }
    if (isAuthorized()) {
      return [
        <Dialog 
            title={this.title}
            titleContent={<MainMenu onNavigate={this.handleNavigate}/>}
            onClose={this.handleDialogClose}
            key="dialog"
            classes="x-task-large-dialog">   

            {this.content}
        </Dialog>
      ]
    }
    return (
      <AuthForm 
        onClose={this.handleDialogClose}
        onSubmit={this.handleSubmitAuthForm}/>
    )
  }

  get title() {
    switch (this.state.activeTab) {
      case 'users':
        return dict.users;
      
      case 'projects':
        return dict.projects;

      default: {
        return dict.my_account;
      }
    }
  }

  get content() {
    switch (this.state.activeTab) {
      case 'users':
        return <Users/>

      case 'projects':
        return <Projects/>

      default: {
        return <Account/>
      }
    }
  }

  handleStartClick = () => {
    this.setActive(true);
  }

  handleDialogClose = () => {
    this.setActive(false);
  }

  handleAuthStatusChanged = (isAuthorized) => {
    this.setState({isAuthorized});
  }

  handleSubmitAuthForm = (data) => {
    auth(data).then(this.handleAuthStatusChanged);
  }

  handleNavigate = ({target: {dataset: {name}}}) => {
    if (name == 'logout') {
      logout()
      .then((isAuthorized) => {
        alert('logout');
        console.log({isAuthorized})
        console.log(this.state)
        this.handleAuthStatusChanged(isAuthorized);
      });
    } else if (name) {
      this.setState({activeTab: name});
    }
  }

  setActive(active) {
    this.setState({active});
  }

}