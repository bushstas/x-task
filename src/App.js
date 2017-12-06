import React from 'react';
import Dialog from './ui/Dialog';
import StartButton from './components/StartButton';

import './index.scss';

export default class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      active: false
    };
  }

  render() {
    let {active} = this.state;
    if (!active) {
      return <StartButton onClick={this.handleStartClick}/>; 
    }
    return [
      <Dialog title   = "Title"
              onClose = {this.handleDialogClose}
              key     = "dialog"
              classes = "x-task-standart-dialog">
          23213213
      </Dialog>
    ]
  }

  handleStartClick = () => {
    this.setActive(true);
  }

  handleDialogClose = () => {
    this.setActive(false);
  }

  setActive(active) {
    this.setState({active});
  }

}