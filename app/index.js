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

import TabBarComponent from './testView/tabBarComponent'

import Login from './testView/login'
import Tab1 from './testView/tab1'
import Tab2 from './testView/tab2'
import Tab3 from './testView/tab3'
import Tab4 from './testView/tab4'
import Page1 from './testView/page1'
import Page2 from './testView/page2'
import Page3 from './testView/page3'
import Page4 from './testView/page4'

const Tab = TabNavigator({
  Tab1: {screen: Tab1},
  Tab2: {screen: Tab2},
  Tab3: {screen: Tab3},
  Tab4: {screen: Tab4},
}, {
  tabBarComponent: TabBarComponent,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false
})

/**
 * StackNavigator 路由区域
 */
const Stack = StackNavigator({
  Tab: {screen: Tab},
  Page1: {screen: Page1},
  Page2: {screen: Page2},
  Page3: {screen: Page3},
  Page4: {screen: Page4},
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