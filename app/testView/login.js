import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {StackNavigator, NavigationActions} from 'react-navigation'
import Routers from '../stores/routers'
import {FadeToTheLeft} from '../utility/transitionConfig'

class Logout extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'logout!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            Routers.navSwitch.dispatch(
              NavigationActions.navigate({
                type: NavigationActions.NAVIGATE,
                routeName: 'StackMain'
              })
            )
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Forget extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'forget!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            this.props.navigation.navigate('Logout')
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Register extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'register!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            this.props.navigation.navigate('Forget')
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Login extends Component {
  render() {
    return (
      <View style={Styles.wrap}>
        <Text>{'login!!!'}</Text>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => {
            this.props.navigation.navigate('Register')
          }}>
          <Text>{'路由'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const MainPage = StackNavigator({
  Login: {screen: Login},
  Register: {screen: Register},
  Forget: {screen: Forget},
  Logout: {screen: Logout},
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