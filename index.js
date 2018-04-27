import React, {Component} from 'react';
import { App, render } from 'proton-native';
import MyApp from './app.js';

class HotApp extends Component {
  constructor(props){
    super(props);

    this.state = {app: MyApp};

    if(module.hot) {
      module.hot.accept('./app.js', () => {
        import("./app.js").then(x => {
          this.setState({app: x.default})
        });
      })
    }
  }

  render() {
    const Component = this.state.app;
    return (
      <App>
        <Component/>
      </App>
    );
  }
}

render(<HotApp/>);
