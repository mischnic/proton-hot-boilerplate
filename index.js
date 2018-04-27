import React from 'react';
import { AppContainer } from 'react-hot-loader'
import { App, render } from 'proton-native';
import Notepad from './app.js';

const update = Component => {
  render(
    <AppContainer>
      <App>
        <Component />
      </App>
    </AppContainer>
  );
}

update(Notepad);

if (module.hot) {
  module.hot.accept('./app.js', () => {
    import("./app.js").then(x => {
      update(x.default);
    });
  })
}