import React from 'react';
import Dialog from '../../ui/Dialog';
import AuthForm from '../../components/AuthForm';
import MainMenu from '../MainMenu';
import StartButton from '../StartButton';
import CreateTaskButton from '../CreateTaskButton';
import Notifications from '../Notifications';

import Users from '../Users';
import Projects from '../Projects';
import Tasks from '../Tasks';
import Account from '../Account';

import {dict} from '../../utils/Dictionary';
import {isAuthorized, auth, register, logout} from '../../utils/User';

import '../../index.scss';

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      activeTab: 'my_account',
      active: false,
      isAuthorized: isAuthorized()
    };
  }

  render() {
    let {active} = this.state;
    let elements = [this.notifications];
    if (!active) {
      elements.push(
        this.startButton,
        this.createTaskButton
      );
    } else if (isAuthorized()) {
      elements.push(this.dialog);
    } else {
      elements.push(this.authForm);
    }
    return elements;
  }

  get notifications() {
    return <Notifications key="notifications"/>
  }

  get startButton() {
    return (
      <StartButton 
        key="startButton"
        onClick={this.handleStartClick}/>
    )
  }

  get createTaskButton() {
    return (
      <CreateTaskButton
        key="createTaskButton"/>
    )
  }

  get dialog() {
    return (
      <Dialog 
          title={this.title}
          titleContent={(
            <MainMenu 
              onNavigate={this.handleNavigate}
              active={this.state.activeTab}/>
          )}
          onClose={this.handleDialogClose}
          key="dialog"
          classes="x-task-large-dialog">   

          {this.content}
      </Dialog>
    )
  }

  get authForm() {
    return (
      <AuthForm 
        key="authForm"
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

      case 'tasks':
        return dict.tasks;

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

       case 'tasks':
        return <Tasks/>

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
        this.state.isAuthorized = false;
        this.forceUpdate();
      });
    } else if (name) {
      this.setState({activeTab: name});
    }
  }

  setActive(active) {
    this.setState({active});
  }

}