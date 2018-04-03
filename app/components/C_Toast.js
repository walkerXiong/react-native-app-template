/**
 * Created by hebao on 2018/4/2.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Easing
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import {observable} from 'mobx';
import {observer} from 'mobx-react/native';

let ToastContent = observable({
  @observable data: {//服务端数据
    content: '',
  },
});

const TOAST_ANIMATION_DURATION = 200;
const durations = {
  LONG: 3500,
  SHORT: 2000
};
let siblingHandle = null;

@observer
class ToastContainer extends Component {
  _showHandle = -1;

  static clearAndReHide = () => null;

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
    ToastContainer.clearAndReHide = this._clearAndReHide;
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.in(Easing.ease)
    }).start(() => {
      clearTimeout(this._showHandle);
      this._showHandle = setTimeout(() => {
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: TOAST_ANIMATION_DURATION,
          easing: Easing.in(Easing.ease)
        }).start(() => {
          SiblingToast.instanceShow = false;
          SiblingToast.hide(siblingHandle);
        });
      }, durations.SHORT);
    });
  }

  componentWillUnmount() {
    clearTimeout(this._showHandle);
  }

  _clearAndReHide = () => {
    clearTimeout(this._showHandle);
    this._showHandle = setTimeout(() => {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: TOAST_ANIMATION_DURATION,
        easing: Easing.in(Easing.ease)
      }).start(() => {
        SiblingToast.instanceShow = false;
        SiblingToast.hide(siblingHandle);
      });
    }, durations.SHORT);
  };

  render() {
    return (
      <Animated.View
        pointerEvents={'box-none'}
        style={[Styles.wrap, {opacity: this.state.opacity}]}>
        <View style={Styles.container}>
          <Text numberOfLines={2} style={Styles.font}>{ToastContent.data.content}</Text>
        </View>
      </Animated.View>
    )
  }
}

export default class SiblingToast extends Component {
  static instanceShow = false;

  static show = (content) => {
    let _currContent = ToastContent.data.content;
    ToastContent.data.content = content;

    if (!SiblingToast.instanceShow) {
      SiblingToast.instanceShow = true;
      siblingHandle = new RootSiblings(<ToastContainer />);
    }
    else {
      if (_currContent !== content) {
        ToastContainer.clearAndReHide();
      }
    }
  };

  static hide = (siblingHandle) => {
    if (siblingHandle instanceof RootSiblings) {
      siblingHandle.destroy();
    }
    else {
      console.warn(`Sibling.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof siblingHandle}\` instead.`);
    }
  };

  render() {
    return null;
  }
}

const Styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#000',
    opacity: 0.8,
    borderRadius: 5,
  },
  font: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});