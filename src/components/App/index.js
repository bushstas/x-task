import React from 'react';
import Dialog from '../../ui/Dialog';
import AuthForm from '../../components/AuthForm';
import MainMenu from '../MainMenu';
import StartButton from '../StartButton';
import Users from '../Users';
import {dict} from '../../utils/Dictionary';
import {isAuthorized, auth, register} from '../../utils/User';

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
        <Dialog title={(
              <div>
                {this.title}
                <MainMenu onNavigate={this.handleNavigate}/>
              </div>
            )}
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
      default: {
        return dict.users;
      }
    }
  }

  get content() {
    switch (this.state.activeTab) {
      default: {
        return <Users/> 
      }
    }
  }

  handleStartClick = () => {
    this.setActive(true);
  }

  handleDialogClose = () => {
    this.setActive(false);
  }

  handleSubmitAuthForm = (data) => {
    auth(data).then((isAuthorized) => {
      this.setState({isAuthorized});
    });
  }

  handleNavigate = (e) => {
    let activeTab = e.target.getAttribute('data-name');
    if (activeTab) {
      this.setState({activeTab});
    }
  }

  setActive(active) {
    this.setState({active});
  }

}