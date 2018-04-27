import React from 'react';
import { AppContainer } from 'react-hot-loader'
import { render } from 'proton-native';
import App from './app.js';

const update = Component => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>
  );
}

update(App)


if (module.hot) {
  module.hot.accept('./app.js', () => {
    // if you are using harmony modules ({modules:false})
    update(App);
    // in all other cases - re-require App manually
    // update(require('./containers/App'))
  })
}