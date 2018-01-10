import React from 'react';
import Dialog from '../../ui/Dialog';
import AuthForm from '../../components/AuthForm';
import MainMenu from '../MainMenu';
import StartButton from '../StartButton';
import Notifications from '../Notifications';
import QuickTask from '../QuickTask';
import Mask from '../Mask';
import VisualElements from '../VisualElements';
import VisualElementPanel from '../VisualElementPanel';

import Users from '../Users';
import Projects from '../Projects';
import Tasks from '../Tasks';
import Account from '../Account';

import {dict} from '../../utils/Dictionary';
import {isAuthorized, auth, register, logout, hasRight} from '../../utils/User';
import Store from 'xstore';

class App extends React.PureComponent {
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
    let authorized = isAuthorized();

    let elements = [
      this.notifications
    ];
    
    if (!active) {
      elements.push(
        this.startButton,
      );
      if (this.taskMode && authorized) {
        elements.push(
          this.mask,
          this.quicktask,
          this.visualElements,
          this.visualElementPanel
        );
      }
    } else if (authorized) {
      elements.push(this.dialog);
    } else {
      elements.push(this.authForm);
    }
    return elements;
  }

  get taskMode() {
     return !!this.props.status || this.visualMode;
  }

  get visualMode() {
    return !!this.props.visualMode;
  }

  get visualElementPanel() {
    return <VisualElementPanel key="visualElementPanel"/>
  }

  get quicktask() {
    return <QuickTask key="quicktask"/>
  }

  get mask() {
    return (
      <Mask key="mask"/>
    )
  }

  get notifications() {
    return <Notifications key="notifications"/>
  }

  get visualElements() {
    return <VisualElements key="visualElements"/> 
  }

  get startButton() {
    return (
      <StartButton 
        key="startButton"
        createTaskShown={!this.taskMode && hasRight('add_dev_task')}
        maskButtonShown={this.taskMode && isAuthorized()}
        onClick={this.handleStartClick}
        onCreateTask={this.handleAddTaskClick}/>
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
          classes="~large ~no-overflow">
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

  handleAddTaskClick = (e) => {
    this.props.dispatch('QUICKTASK_ACTIVATED', 'active');
  }

  handleDialogClose = () => {
    this.setActive(false);
  }

  handleAuthStatusChanged = (isAuthorized) => {
    this.setState({isAuthorized});
  }

  handleSubmitAuthForm = (data, action) => {
    if (action == 'r') {
      register(data).then(this.handleAuthStatusChanged);  
    } else {
      auth(data).then(this.handleAuthStatusChanged);
    }
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

const params = {
  has: 'quicktask:status|visualMode',
  flat: true
}
export default Store.connect(App, params);