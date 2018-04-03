/**
 * Created by hebao on 2017/10/21.
 */
import React, {Component, PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableHighlight,
  BackHandler,
  Easing,
  TouchableOpacity
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

import {observable, action} from 'mobx';
import {observer} from 'mobx-react/native';

import BXStandard from '../styles/standard';
import CommonSize from '../utility/size';
const {width, height} = CommonSize.screen;
const _transY = height * 2 / 3;

const TOAST_ANIMATION_DURATION = 250;
let siblingHandle = null;

let ActionSheetContent = observable({
  @observable data: {
    visible: false,//非配置属性

    //option
    hardwareBackPress: null,
    allowHardwareBackHideModal: true,
    tapBackToHide: true,

    //option
    buttons: [{title: '', callback: () => null}],
  },

  @action updateData(data) {
    ActionSheetContent.data = {
      ...ActionSheetContent.data,
      ...data
    };
  },

  @action showDone() {
    ActionSheetContent.data = {
      ...ActionSheetContent.data,
      visible: false,
    };
  },
});

@observer
class ActionSheetContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
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
      ActionSheet.instanceShow = false;
      ActionSheet.destroy(siblingHandle);
    });
  };

  _itemSelect = (s, i) => {
    ActionSheet.hide();
    s.callback();
  };

  render() {
    let {tapBackToHide, buttons} = ActionSheetContent.data;
    return (
      <Animated.View
        style={[
          Styles.wrap,
          {
            backgroundColor: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.65)']
            })
          }
        ]}>
        <TouchableOpacity
          style={{flex: 1, width}}
          activeOpacity={1}
          onPress={() => tapBackToHide && ActionSheet.hide()}/>
        <Animated.View
          style={[
            Styles.sheet,
            {
              transform: [{
                translateY: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [_transY, 0]
                })
              }]
            }
          ]}>
          {
            buttons.map((s, i) => {
              return (
                <TouchableHighlight
                  key={'sheet_' + i}
                  activeOpacity={1}
                  onPress={() => this._itemSelect(s, i)}
                  underlayColor={BXStandard.color.gray_press}
                  style={[Styles.item]}>
                  <Text style={Styles.font}>{s.title}</Text>
                </TouchableHighlight>
              )
            })
          }
          <TouchableHighlight
            activeOpacity={1}
            onPress={() => ActionSheet.hide()}
            underlayColor={BXStandard.color.gray_press}
            style={[Styles.cancel]}>
            <Text style={Styles.font}>{'取消'}</Text>
          </TouchableHighlight>
        </Animated.View>
      </Animated.View>
    )
  }
}

@observer
class ActionSheetMain extends Component {
  _hardwareBackPressHandle = null;//物理返回键监听句柄
  _hardwareBackPress = null;//安卓物理返回键案件回调函数

  componentDidMount() {
    let {hardwareBackPress} = ActionSheetContent.data;
    this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress;
    this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
  }

  componentWillUnmount() {
    this._hardwareBackPressHandle.remove();
  }

  hardwareBackPress = () => {
    let {allowHardwareBackHideModal, visible} = ActionSheetContent.data;
    if (visible) {
      if (allowHardwareBackHideModal) {
        ActionSheet.hide();
      }
      return true;
    }
    return false;
  };

  render() {
    let {visible} = ActionSheetContent.data;
    return (
      <ActionSheetContainer visible={visible}/>
    );
  }

}

export default class ActionSheet extends Component {
  static instanceShow = false;

  static show = (option) => {
    ActionSheetContent.updateData({
      ...option,
      visible: true,
    });
    if (!ActionSheet.instanceShow) {
      ActionSheet.instanceShow = true;
      siblingHandle = new RootSiblings(<ActionSheetMain />);
    }
  };

  static hide = () => {
    ActionSheetContent.showDone();
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
    ...BXStandard.layout.cfec,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    ...BXStandard.layout.cfsc,
    width,
    backgroundColor: BXStandard.color.wgray_sub,
    borderTopWidth: 0.5,
    borderTopColor: BXStandard.color.gray_line
  },
  item: {
    ...BXStandard.layout.rcc,
    width,
    height: 44,
    backgroundColor: BXStandard.color.white_bg,
    borderBottomWidth: 0.5,
    borderBottomColor: BXStandard.color.gray_line
  },
  cancel: {
    ...BXStandard.layout.rcc,
    width,
    height: 44,
    backgroundColor: BXStandard.color.white_bg,
    borderTopWidth: 0.5,
    borderTopColor: BXStandard.color.gray_line,
    borderBottomWidth: 0.5,
    borderBottomColor: BXStandard.color.gray_line,
    marginTop: 10
  },
  font: {
    color: BXStandard.color.wblack,
    fontSize: 14
  }
});