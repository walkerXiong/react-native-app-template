/**
 * Created by hebao on 2017/10/11.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  BackHandler,
  Easing
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import {observable, action} from 'mobx';
import {observer} from 'mobx-react/native';

import NGradient from './C_Gradient';

import BXStandard from '../styles/standard';
import CommonSize from '../utility/size';
const {size} = CommonSize.screen;
const alertWidth = size > 3 ? 286 : 260;

const TOAST_ANIMATION_DURATION = 100;
let siblingHandle = null;

let AlertContent = observable({
  @observable data: {
    visible: false,//非配置属性

    //option
    hardwareBackPress: null,
    allowHardwareBackHideModal: true,
    tapBackToHide: false,

    //option
    content: '',//中间主体部分文字
    buttons: [{title: '', callback: () => null}],
  },

  @action updateData(data) {
    AlertContent.data = {
      ...AlertContent.data,
      ...data
    };
  },

  @action showDone() {
    AlertContent.data = {
      ...AlertContent.data,
      visible: false,
    };
  },
});

@observer
class AlertContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),

      buttonPressed: null
    }
  }

  componentDidMount() {
    this._show();
  };

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
      easing: Easing.in(Easing.ease)
    }).start(() => {
      setTimeout(() => this.state.buttonPressed instanceof Function && this.state.buttonPressed(), 50);//延迟为了UI效果
      Alert.instanceShow = false;
      Alert.destroy(siblingHandle);
    });
  };

  render() {
    let {tapBackToHide, content, buttons} = AlertContent.data;
    return (
      <TouchableWithoutFeedback onPress={() => tapBackToHide && Alert.hide()}>
        <Animated.View style={[Styles.wrap, {opacity: this.state.opacity}]}>
          <View style={[Styles.alertWrap]}>
            <View style={[Styles.alertMain]}>
              <Text style={[Styles.alertDetail]}>{content}</Text>
            </View>
            <View style={Styles.alertBtnWrap}>
              {
                buttons.map((s, i) => {
                  if (buttons.length === 1) {
                    return (
                      <NGradient
                        key={'alert_button_' + i}
                        wrapStyle={{flex: 1}}
                        contentText={buttons[0].title}
                        btnType={'btn_alert_full'}
                        onPress={() => {
                          this.state.buttonPressed = buttons[0].callback;
                          Alert.hide()
                        }}/>
                    )
                  }
                  if (i === 0) {
                    return (
                      <TouchableHighlight
                        key={'alert_button_' + i}
                        style={{flex: 1, borderBottomLeftRadius: 15}}
                        activeOpacity={1}
                        underlayColor={BXStandard.color.gray_press}
                        onPress={() => {
                          this.state.buttonPressed = buttons[0].callback;
                          Alert.hide()
                        }}>
                        <View style={Styles.btnCancel}>
                          <Text style={Styles.cancelFont}>
                            {buttons[0].title}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    )
                  }
                  else if (i === 1) {
                    return (
                      <NGradient
                        key={'alert_button_' + i}
                        wrapStyle={{flex: 1}}
                        contentText={buttons[1].title}
                        btnType={'btn_alert_half'}
                        onPress={() => {
                          this.state.buttonPressed = buttons[1].callback;
                          Alert.hide()
                        }}/>
                    )
                  }
                })
              }
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

@observer
class AlertMain extends Component {
  _hardwareBackPressHandle = null;//物理返回键监听句柄
  _hardwareBackPress = null;//安卓物理返回键案件回调函数

  componentDidMount() {
    let {hardwareBackPress} = AlertContent.data;
    this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress;
    this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
  }

  componentWillUnmount() {
    this._hardwareBackPressHandle.remove();
  }

  hardwareBackPress = () => {
    let {allowHardwareBackHideModal, visible} = AlertContent.data;
    if (visible) {
      if (allowHardwareBackHideModal) {
        Alert.hide();
      }
      return true;
    }
    return false;
  };

  render() {
    let {visible} = AlertContent.data;
    return (
      <AlertContainer visible={visible}/>
    );
  }

}

export default class Alert extends Component {
  static instanceShow = false;

  static show = (option) => {
    AlertContent.updateData({
      hardwareBackPress: null,
      allowHardwareBackHideModal: true,
      tapBackToHide: false,

      ...option,
      visible: true,
    });
    if (!Alert.instanceShow) {
      Alert.instanceShow = true;
      siblingHandle = new RootSiblings(<AlertMain />);
    }
  };

  static hide = () => {
    AlertContent.showDone();
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
    backgroundColor: 'rgba(0,0,0,0.75)'
  },
  alertWrap: {
    width: alertWidth,
    minHeight: 132,
    borderRadius: 15,
    backgroundColor: BXStandard.color.white_bg,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden'
  },
  alertMain: {
    width: alertWidth,
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...BXStandard.layout.ccc
  },
  alertDetail: {
    fontSize: 15,
    color: BXStandard.color.wgray_main,
    textAlign: 'center'
  },
  alertBtnWrap: {
    width: alertWidth,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  btnCancel: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: BXStandard.color.gray_line,
  },
  cancelFont: {
    fontSize: 15,
    color: BXStandard.color.wgold_main
  }
});