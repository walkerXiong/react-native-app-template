/**
 * Created by DELL on 2016/11/16.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import Util from '../utility/util';
import CommonSize from '../utility/size';
import HBStyle from '../styles/standard';

const debugKeyWord = '[NavActivity]';
const {width, height, pixel} = CommonSize.screen
const {color, nav, font, gap} = HBStyle;

class LeftButton extends Component {
  static defaultProps = {
    store: {}
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {leftButton, navigator, closeButton, navHeight, paddingSize} = this.props.store;
    if (leftButton.disabled) {
      return <View style={Styles.leftButton}/>
    }
    return (
      <View style={Styles.leftButton}>
        <TouchableOpacity
          style={[Styles.backZone, {height: navHeight, paddingLeft: paddingSize}]}
          activeOpacity={0.6}
          onPress={() => onBackPress(navigator, leftButton.handler)}>
          <Image
            fadeDuration={0}
            style={{width: leftButton.iconSize, height: leftButton.iconSize}}
            resizeMode={'cover'}
            source={leftButton.icon}/>
          <Text style={{color: leftButton.tintColor, fontSize: leftButton.fontSize}}>
            {leftButton.title}
          </Text>
        </TouchableOpacity>
        {!closeButton.disabled && closeButton.closeZone === 'left' ?
          <TouchableOpacity
            fadeDuration={0}
            style={[Styles.closeZone, {height: navHeight}]}
            activeOpacity={0.6}
            onPress={() => onClosePress(closeButton.handler)}>
            <Text style={{color: closeButton.tintColor, fontSize: closeButton.fontSize}}>
              {closeButton.title}
            </Text>
          </TouchableOpacity> : null}
      </View>
    );
  }
}

class TitleElement extends Component {
  _pressStartTime = -1;

  static defaultProps = {
    store: {}
  }

  shouldComponentUpdate() {
    return false;
  }

  _onPressOut() {
    const {title} = this.props.store;
    let _pressEndTime = Date.now();
    if (_pressEndTime - this._pressStartTime >= title.longPressTime) {
      title.onLongPressFunc instanceof Function && title.onLongPressFunc();
    }
    this._pressStartTime = _pressEndTime;
  }

  render() {
    const {title, navHeight} = this.props.store;
    return (
      <TouchableWithoutFeedback
        onPressIn={() => this._pressStartTime = Date.now()}
        onPressOut={() => this._onPressOut()}
        style={Styles.title}>
        <View style={[HBStyle.layout.rcc, {height: navHeight}]}>
          {title.animating ?
            <ActivityIndicator
              style={[Styles.loading, {height: navHeight}]}
              animating={title.animating}
              color={'#b3bbc0'}
              size={"small"}/> : null}
          <Text numberOfLines={1} style={{color: title.tintColor, fontSize: title.fontSize}}>
            {title.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class RightButton extends Component {
  static defaultProps = {
    store: {}
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {closeButton, customButton, navHeight, paddingSize} = this.props.store;
    if (closeButton.disabled && customButton.disabled) {
      return <View style={Styles.rightButton}/>;
    }
    return (
      <View style={Styles.rightButton}>
        {!closeButton.disabled && closeButton.closeZone === 'right' ?
          <TouchableOpacity
            fadeDuration={0}
            style={[Styles.closeZone, {height: navHeight, paddingRight: paddingSize}]}
            activeOpacity={0.6}
            onPress={() => onClosePress(closeButton.handler)}>
            <Text style={{color: closeButton.tintColor, fontSize: closeButton.fontSize}}>
              {closeButton.title}
            </Text>
          </TouchableOpacity> : null}
        {!customButton.disabled ?
          <TouchableOpacity
            fadeDuration={0}
            style={[Styles.closeZone, {height: navHeight, paddingRight: paddingSize}]}
            activeOpacity={0.6}
            onPress={() => customButton.customCallback && customButton.customCallback()}>
            <Image
              fadeDuration={0}
              style={{width: customButton.iconSize[0], height: customButton.iconSize[1]}}
              resizeMode={'contain'}
              source={customButton.icon}/>
          </TouchableOpacity> : null}
      </View>
    );
  }
}

export default class NavActivity extends Component {
  static propTypes = {
    navigator: PropTypes.any,
    statusBar: PropTypes.object,
    title: PropTypes.object,
    leftButton: PropTypes.object,
    closeButton: PropTypes.object,
    customButton: PropTypes.object,
    navStyle: View.propTypes.style,
    refFunc: PropTypes.func
  };

  constructor(props) {
    super(props);
    props.refFunc instanceof Function && props.refFunc(this);
    this.state = {
      navigator: props.navigator ? props.navigator : null,//路由
      statusBar: {//下拉状态栏的样式
        disableStatusBar: true,//在安卓上禁止使用statusBar的API
        animated: false,
        hidden: false,
        backgroundColor: '#000000',
        translucent: false,
        barStyle: 'default',
        networkActivityIndicatorVisible: false,
        showHideTransition: 'fade',
        ...props.statusBar
      },
      title: {
        title: '',//中间标题
        tintColor: color.wblack,//中间标题颜色
        fontSize: nav.fontSize,
        animating: false,//是否在title旁边显示加载动画
        longPressTime: 10000,//长按标题响应时间
        onLongPressFunc: null,//长按响应函数
        ...props.title
      },
      leftButton: {//左边返回按钮
        title: '',
        tintColor: color.wgray_main,
        fontSize: font.wbtn_l,
        iconSize: nav.nav_icon,//back图标的size
        icon: require('../res/default/navig_img_back_black.png'),//icon的图片路径
        handler: null,//leftButton按键按下时调用的回调函数
        disabled: false,//是否禁用左边返回按钮
        ...props.leftButton
      },
      closeButton: {//关闭按钮
        title: '关闭',
        tintColor: color.wgray_main,
        fontSize: font.wbtn_l,
        handler: null,//closeButton按键按下时调用的回调函数
        closeZone: 'right',//关闭按钮在leftButton区域还是rightButton区域
        disabled: true,
        ...props.closeButton
      },
      customButton: {//自定义右侧按钮
        disabled: true,
        customCallback: null,//按钮回调
        iconSize: [23, 23],//返回icon的宽高
        icon: '',//icon的图片路径
        ...props.customButton
      },
      navStyle: {
        borderBottomWidth: pixel,
        borderBottomColor: 'rgba(234,234,234,0)',//导航栏下边分割线的颜色 color.gray_line
        backgroundColor: color.white_bg,
        ...props.navStyle
      },
      navHeight: props.navHeight ? props.navHeight : nav.height,//导航栏的高度
      paddingSize: props.paddingSize ? props.paddingSize : gap.gap_edge,//导航栏的左右补白
    };
  }

  componentDidMount() {
    this.customizeStatusBar();
  }

  componentWillReceiveProps(nextProps, nextState) {
    let {statusBar, title, leftButton, closeButton, customButton, navStyle} = this.state;
    if (nextProps.navigator) this.state.navigator = nextProps.navigator;
    if (nextProps.statusBar) this.state.statusBar = {...statusBar, ...nextProps.statusBar};
    if (nextProps.title) this.state.title = {...title, ...nextProps.title};
    if (nextProps.leftButton) this.state.leftButton = {...leftButton, ...nextProps.leftButton};
    if (nextProps.closeButton) this.state.closeButton = {...closeButton, ...nextProps.closeButton};
    if (nextProps.customButton) this.state.customButton = {...customButton, ...nextProps.customButton};
    if (nextProps.navStyle) this.state.navStyle = {...navStyle, ...nextProps.navStyle};
    if (nextProps.navHeight) this.state.navHeight = nextProps.navHeight;
    if (nextProps.paddingSize) this.state.paddingSize = nextProps.paddingSize;
    this.customizeStatusBar();
  }

  customizeStatusBar = () => {
    const {statusBar} = this.state;
    if (statusBar.barStyle && statusBar.barStyle !== 'default') {
      Util.log(debugKeyWord + "customizeStatusBar:" + statusBar.barStyle);
    }
  };

  fadeInBottomLine = (offset, maxOffset) => {
    offset = Math.floor(offset);
    maxOffset || (maxOffset = height * 0.2)
    if (offset <= maxOffset) {
      this._navWrap.setNativeProps({style: {borderBottomColor: 'rgba(234,234,234,' + ((offset / maxOffset).toFixed(2)) + ')'}})
    }
    else {
      this._navWrap.setNativeProps({style: {borderBottomColor: color.gray_line}})
    }
  }

  render() {
    const {navStyle, navHeight} = this.state;
    return (
      <View
        ref={ref => this._navWrap = ref}
        style={[
          Styles.wrap,
          navStyle,
          {height: navHeight + (Util.platformAndroid ? 0 : CommonSize.phoneModel() === 'iPhone X' ? 44 : 20)}
        ]}>
        <View style={Styles.containerStyle}>
          <LeftButton store={this.state}/>
          <TitleElement store={this.state}/>
          <RightButton store={this.state}/>
        </View>
      </View>
    )
  }
}

let _routerHandle = null;//用于延迟切换场景，延时是为了让TouchableHighlight动画效果展示完毕
function navBack(navigator) {
  if (navigator) {
    clearTimeout(_routerHandle);
    _routerHandle = setTimeout(() => {
      _routerHandle = null;//用于GC回收
      navigator.pop();//销毁当前路由场景，返回之前的场景，此会调用 componentWillUnmount
    }, 100);//设置定时是为了TouchableHighlight按下效果能展示完毕
  }
}
function onBackPress(navigator, handler) {
  Keyboard.dismiss();
  let _handler = true;
  if (handler instanceof Function) {
    _handler = handler();//如果自定义back函数返回为true，则执行路由pop操作，如果返回为false，则表示当前路由目前状态不允许pop回上一个路由
  }
  _handler && navBack(navigator)
}
function onClosePress(handler) {
  handler instanceof Function ? handler() : null;//若配置回调函数，则执行该回调函数
}

const Styles = StyleSheet.create({
  wrap: {
    width,
    ...HBStyle.layout.rcfe
  },
  containerStyle: {
    flex: 1,
    ...HBStyle.layout.rsbc
  },
  //左边button区域
  leftButton: {
    flex: 2,
    ...HBStyle.layout.rfsc
  },
  backZone: {
    flex: 1,
    ...HBStyle.layout.rfsc
  },
  closeZone: {
    marginLeft: 3,
    ...HBStyle.layout.rcc
  },
  //中间标题区域
  title: {
    flex: 5,
    ...HBStyle.layout.rcc
  },
  loading: {
    width: width * 0.08,
    position: 'absolute',
    top: 0,
    left: -(width * 0.08),
    ...HBStyle.layout.rcc
  },
  //右边button区域
  rightButton: {
    flex: 2,
    ...HBStyle.layout.rfec
  },
});