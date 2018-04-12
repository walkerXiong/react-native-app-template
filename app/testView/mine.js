import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {StackNavigator, NavigationActions} from 'react-navigation'
import {FadeToTheLeft} from '../utility/transitionConfig'

import Routers from '../stores/routers';

class Detail extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'detail!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            Routers.navStack.dispatch(
              NavigationActions.navigate({
                type: NavigationActions.NAVIGATE,
                routeName: 'Setting'
              })
            )
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Mine extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'mine!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            this.props.navigation.navigate('Detail')
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const MainPage = StackNavigator({
  Mine: {screen: Mine},
  Detail: {screen: Detail},
}, {
  headerMode: 'none',
  navigationOptions: {gesturesEnabled: true},
  transitionConfig: FadeToTheLeft
})

export default MainPage;

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  btn: {
    width: 200,
    height: 50,
    backgroundColor: '#ffe341',
    marginTop: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})