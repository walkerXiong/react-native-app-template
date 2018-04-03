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

import BXStandard from '../styles/standard';
import CommonSize from '../utility/size';
const {width, height} = CommonSize.screen;
const _transY = height * 2 / 3;

const TOAST_ANIMATION_DURATION = 250;
let siblingHandle = null;

class ActionSheetContainer extends Component {
  static defaultProps = {
    tapBackToHide: true,
    onShow: null,
    onHide: null,

    buttons: [],
  }

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

  _show = (onShow) => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start(() => {
      onShow instanceof Function && onShow();
      this.props.onShow instanceof Function && this.props.onShow();
    });
  };

  _hide = (onHide) => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: TOAST_ANIMATION_DURATION,
      easing: Easing.in(Easing.ease)
    }).start(() => {
      onHide instanceof Function && onHide();
      this.props.onHide instanceof Function && this.props.onHide();

      ActionSheet.instanceShow = false;
      ActionSheet.destroy(siblingHandle);
    });
  };

  _itemSelect = (s, i) => {
    this._hide(s.callback);
  };

  render() {
    let {tapBackToHide, buttons} = this.props;
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
          onPress={() => tapBackToHide && this._hide()}/>
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
            onPress={() => this._hide()}
            underlayColor={BXStandard.color.gray_press}
            style={[Styles.cancel]}>
            <Text style={Styles.font}>{'取消'}</Text>
          </TouchableHighlight>
        </Animated.View>
      </Animated.View>
    )
  }
}

class ActionSheetMain extends Component {
  _hardwareBackPressHandle = null;//物理返回键监听句柄
  _hardwareBackPress = null;//安卓物理返回键案件回调函数

  static defaultProps = {
    hardwareBackPress: null,
    allowHardwareBackHideModal: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  componentDidMount() {
    let {hardwareBackPress} = this.props;
    this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress;
    this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
  }

  componentWillUnmount() {
    this._hardwareBackPressHandle.remove();
  }

  hardwareBackPress = () => {
    let {allowHardwareBackHideModal} = this.props;
    if (allowHardwareBackHideModal) {
      this.setState({visible: false})
      return true;
    }
    return false;
  };

  render() {
    let {visible} = this.state;
    return (
      <ActionSheetContainer visible={visible} {...this.props}/>
    );
  }

}

export default class ActionSheet extends Component {
  static instanceShow = false;

  static show = (option) => {
    if (!ActionSheet.instanceShow) {
      ActionSheet.instanceShow = true;
      siblingHandle = new RootSiblings(<ActionSheetMain {...option}/>);
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