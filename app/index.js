'use strict';
/**
 * Global Error Track
 */
import ErrorUtils from 'ErrorUtils';
const _ErrorDefaultHandle = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;

import stacktraceParser from 'stacktrace-parser';
const parseErrorStack = (error) => {//error track
  if (!error || !error.stack) return [];
  return Array.isArray(error.stack) ? error.stack : stacktraceParser.parse(error.stack);
};

async function wrapGlobalHandler(error, isFatal) {
  const stack = parseErrorStack(error);
  window.console.log(`__Global__Error:${error};stack:${JSON.stringify(stack)};isFatal:${isFatal}`);
  _ErrorDefaultHandle(error, isFatal);
}
ErrorUtils.setGlobalHandler(wrapGlobalHandler);

import React, {Component} from 'react';
import {SwitchNavigator, TabNavigator, StackNavigator} from 'react-navigation';
import {FadeToTheLeft} from './utility/transitionConfig';
import Routers from './stores/routers';

import Login from './testView/login'
import Home from './testView/home'
import Mine from './testView/mine'
import Setting from './testView/setting'

const Tab = TabNavigator({
  Home: {screen: Home},
  Mine: {screen: Mine}
})

/**
 * StackNavigator 路由区域
 */
const Stack = StackNavigator({
  Tab: {screen: Tab},
  Setting: {screen: Setting}
}, {
  headerMode: 'none',
  navigationOptions: {gesturesEnabled: true},
  transitionConfig: FadeToTheLeft
})

class StackMain extends Component {
  componentDidMount() {
    Routers.navStack = this._navStack;
  }

  render() {
    return <Stack ref={ref => this._navStack = ref}/>
  }
}

/**
 * SwitchNavigator 路由区域
 */
const Switch = SwitchNavigator({
  Login: {screen: Login},
  StackMain: {screen: StackMain}
}, {
  initialRouteName: 'Login',
  headerMode: 'none',
  navigationOptions: {gesturesEnabled: true},
  transitionConfig: FadeToTheLeft
});

export default class SwitchMain extends Component {
  componentDidMount() {
    Routers.navSwitch = this._navSwitch;
  }

  render() {
    return <Switch ref={ref => this._navSwitch = ref}/>
  }
}