import React, { Component } from 'react';
import Container from './ScreenContainer';
import { registerRootComponent } from 'expo';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
// import { Font } from 'expo';


class App extends Component {
  state = {
    fontLoaded: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }
  
  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      'ProximaNova-Regular' : require('../assets/fonts/ProximaNova-Regular.otf'),
      'ProximaNova-Semibold' : require('../assets/fonts/ProximaNova-Semibold.otf'),
    });
    this.setState({ fontLoaded: true });
  };

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    return <Container />
  }
}


registerRootComponent(App);