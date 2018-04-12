'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import Util from '../utility/util'

import AniSvgAndD3 from '../components/gradientCircle/aniSvgAndD3';
import NavActivity from '../components/C_NavActivity';

const MyAniSvgAndD3 = Animated.createAnimatedComponent(AniSvgAndD3);

class AniLinearImg extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currAngle: new Animated.Value(0),
      currTickPos: new Animated.Value(0)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(this.state.currAngle, {
        easing: Easing.linear,
        toValue: 300,
        duration: 1600
      }).start(() => {
        Animated.timing(this.state.currTickPos, {
          easing: Easing.linear,
          toValue: 50,
          duration: 800
        }).start()
      });
    }, 2000)
  }

  render() {
    return (
      <MyAniSvgAndD3 currAngle={this.state.currAngle} currTickPos={this.state.currTickPos} endAngle={300}/>
    )
  }
}

export default class MainTestPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={Styles.wrap}>
        <NavActivity title={{title: '主页'}}/>
        <TouchableOpacity
          style={Styles.btn}
          onPress={() => Util.actionSheet.show({buttons: [{title: '12345', callback: ()=>this.props.navigation.navigator('NextPage')}, {title: '54321'}, {title: '13579'}]})}>
          <Text>{'显示 action sheet'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
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
});