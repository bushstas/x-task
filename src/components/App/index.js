import React from 'react';
import Dialog from '../../ui/Dialog';
import MainMenu from '../MainMenu';
import StartButton from '../StartButton';
import Users from '../Users';
import {dict} from '../../utils/Dictionary';

import '../../index.scss';

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  render() {
    let {active, title} = this.state;
    if (!active) {
      return <StartButton onClick={this.handleStartClick}/>; 
    }
    return [
      <Dialog title={(
            <div>
              {this.title}
              <MainMenu onNavigate={this.handleNavigate}/>
            </div>
          )}
          onClose={this.handleDialogClose}
          key="dialog"
          classes="x-task-standart-dialog">   

          {this.content}
      </Dialog>
    ]
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