/**
 * Created by hebao on 2017/10/11.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  BackHandler,
  ActivityIndicator,
  Text,
  Easing
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import {observable, action} from 'mobx';
import {observer} from 'mobx-react/native';

import FrameAnimation from './C_FrameAnimation';

const TOAST_ANIMATION_DURATION = 100;
let siblingHandle = null;
let siblingHandleArr = [];

let LoadingContent = observable({
  @observable data: {
    visible: false,//非配置属性

    //option
    hardwareBackPress: null,
    allowHardwareBackHideModal: true,
    tapBackToHide: false,

    //option
    detail: '加载中...',
  },

  @action updateData(data) {
    LoadingContent.data = {
      ...LoadingContent.data,
      ...data
    };
  },

  @action loadingDone() {
    siblingHandleArr = [];
    LoadingContent.data = {
      ...LoadingContent.data,
      visible: false,
    };
  },
});

@observer
class AniLoadingContainer extends Component {
  _sprite = [
    require('../res/test/animation_loading00.png'),
    require('../res/test/animation_loading01.png'),
    require('../res/test/animation_loading02.png'),
    require('../res/test/animation_loading03.png'),
    require('../res/test/animation_loading04.png'),
    require('../res/test/animation_loading05.png'),
    require('../res/test/animation_loading06.png'),
    require('../res/test/animation_loading07.png'),
    require('../res/test/animation_loading08.png'),
    require('../res/test/animation_loading09.png'),
    require('../res/test/animation_loading10.png'),
    require('../res/test/animation_loading11.png'),
    require('../res/test/animation_loading12.png'),
    require('../res/test/animation_loading13.png'),
    require('../res/test/animation_loading14.png'),
    require('../res/test/animation_loading15.png'),
  ];

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this._show();
  }

  componentWillReceiveProps(nextProps, nextState) {
    nextProps.visible === false && this._hide();
  }

  _show = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start();
  };

  _hide = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start(() => {
      Loading.instanceShow = false;
      Loading.destroy(siblingHandle);
    });
  };

  _tapBackToHide = () => {
    LoadingContent.loadingDone();
  };

  render() {
    let {tapBackToHide, detail} = LoadingContent.data;
    return (
      <TouchableWithoutFeedback onPress={() => tapBackToHide && this._tapBackToHide()}>
        <Animated.View style={[Styles.wrap, {opacity: this.state.opacity}]}>
          <View style={[Styles.centering]}>
            <FrameAnimation
              fps={20}
              sprite={this._sprite}
              width={112}
              height={56}/>
            <Text style={Styles.font}>{detail}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

@observer
class LoadingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this._show();
  }

  componentWillReceiveProps(nextProps, nextState) {
    nextProps.visible === false && this._hide();
  }

  _show = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start();
  };

  _hide = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start(() => {
      Loading.instanceShow = false;
      Loading.destroy(siblingHandle);
    });
  };

  _tapBackToHide = () => {
    LoadingContent.loadingDone();
  };

  render() {
    let {tapBackToHide, detail} = LoadingContent.data;
    return (
      <TouchableWithoutFeedback onPress={() => tapBackToHide && this._tapBackToHide()}>
        <Animated.View style={[Styles.wrap, {opacity: this.state.opacity}]}>
          <View style={[Styles.centering]}>
            <ActivityIndicator size="large"/>
            <Text style={Styles.font}>{detail}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

@observer
class LoadingMain extends Component {
  _hardwareBackPressHandle = null;//物理返回键监听句柄
  _hardwareBackPress = null;//安卓物理返回键案件回调函数

  componentDidMount() {
    let {hardwareBackPress} = LoadingContent.data;
    this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress;
    this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
  }

  componentWillUnmount() {
    this._hardwareBackPressHandle.remove();
  }

  hardwareBackPress = () => {
    let {allowHardwareBackHideModal, visible} = LoadingContent.data;
    if (visible) {
      if (allowHardwareBackHideModal) {
        LoadingContent.loadingDone();
      }
      return true;
    }
    return false;
  };

  render() {
    let {visible} = LoadingContent.data;
    return (
      <LoadingContainer visible={visible}/>
    );
  }
}

export default class Loading extends Component {
  static instanceShow = false;

  static show = (option) => {
    if (!option) option = {};
    LoadingContent.updateData({
      detail: '加载中...',
      ...option,
      visible: true,
    });

    siblingHandleArr.push(true);
    if (!Loading.instanceShow) {
      Loading.instanceShow = true;
      siblingHandle = new RootSiblings(<LoadingMain/>);
    }
  };

  static hide = () => {
    siblingHandleArr.pop();
    if (siblingHandleArr.length <= 0) {
      LoadingContent.loadingDone();
    }
  };

  static destroy = (siblingHandle) => {
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
  centering: {
    width: 171,
    height: 171,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  font: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 5
  }
});