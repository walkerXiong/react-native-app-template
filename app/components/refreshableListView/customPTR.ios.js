/**
 * Created by hebao on 2017/8/28.
 */
'use strict'
import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  ListView,
  Dimensions,
  Animated,
  Text,
  ScrollView,
} from 'react-native'

const {width, height} = Dimensions.get('window')
const
  G_STATUS_NONE = 0,// 正常手势，没有上拉或者下拉刷新
  G_STATUS_PULLING_UP = 1,// ListView 处于底部，上拉加载更多
  G_STATUS_PULLING_DOWN = 2,// ListView 处于顶部，下拉刷新
  G_STATUS_RELEASE_TO_REFRESH = 3,// 拉动距离处于可触发刷新或者加载状态
  G_STATUS_HEADER_REFRESHING = 4,// 顶部正在刷新
  G_STATUS_FOOTER_REFRESHING = 5;// 底部正在加载更多

let
  G_PULL_UP_DISTANCE = 50,//上拉加载更多最大上拉距离
  G_PULL_DOWN_DISTANCE = 60,//下拉刷新下拉距离大于 60 时触发下拉刷新
  G_MAX_PULL_DISTANCE = 70;//下拉刷新最大下拉距离

const _renderHeaderRefresh = (gestureStatus) => {
  switch (gestureStatus) {
    case G_STATUS_PULLING_DOWN:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'下拉刷新'}</Text>
        </View>
      )
      break
    case G_STATUS_RELEASE_TO_REFRESH:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'松开即可刷新'}</Text>
        </View>
      )
      break
    case G_STATUS_HEADER_REFRESHING:
      setTimeout(() => {
        RefresherListView.headerRefreshDone();
      }, 2000)
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'正在刷新...'}</Text>
        </View>
      )
      break
    default:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'下拉刷新'}</Text>
        </View>
      )
  }
}

class HeaderRefresh extends Component {
  static setGestureStatus = (gestureStatus, callback) => null

  static defaultProps = {
    renderHeaderRefresh: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      gestureStatus: G_STATUS_NONE,
    }
    HeaderRefresh.setGestureStatus = this._setGestureStatus
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.gestureStatus !== this.state.gestureStatus
  }

  _setGestureStatus = (gestureStatus, callback) => {
    if (gestureStatus !== this.state.gestureStatus) {
      this.setState({gestureStatus}, () => callback instanceof Function && callback())
    }
  }

  render() {
    return this.props.renderHeaderRefresh(this.state.gestureStatus)
  }
}

class MyScrollComponent extends Component {
  static headerRefreshDone = () => null

  constructor(props) {
    super(props)
    this.state = {
      //当前手势状态
      gestureStatus: G_STATUS_NONE,
      //当前拖动状态
      onDrag: false,
      //当前是否惯性滚动状态
      onScrollWithoutDrag: false,

      startPageY: 0,
      movePageY: 0,
    }
    MyScrollComponent.headerRefreshDone = this._headerRefreshDone
  }

  _headerRefreshDone = () => {
    this._setGestureStatus(G_STATUS_NONE, null, false)
    this._scrollView.scrollTo({x: 0, y: 0, animated: true})
  }

  _setGestureStatus = (status, callback, refresh) => {
    this.state.gestureStatus = status
    refresh && HeaderRefresh.setGestureStatus(status, callback)
  }

  onScroll = (e) => {
    let {y} = e.nativeEvent.contentOffset
    let {gestureStatus, onDrag, onScrollWithoutDrag} = this.state
    if (gestureStatus === G_STATUS_NONE) {
      if (onDrag) {
        //开始下拉
        if (y <= 0) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
        }
      }
      else {
        if (onScrollWithoutDrag) {
          //当前状态为正在惯性滚动
        }
        else {
          //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
          if (y === 0) {
            //刷新完毕归位
            this._setGestureStatus(G_STATUS_NONE, null, true)
          }
        }
      }
    }
    else if (gestureStatus === G_STATUS_PULLING_DOWN) {
      //下拉刷新
      if (y <= 0 && Math.abs(y) >= G_PULL_DOWN_DISTANCE) {
        this._setGestureStatus(G_STATUS_RELEASE_TO_REFRESH, null, true)
      }
    }
    else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
      //释放刷新
      if (y <= 0 && Math.abs(y) < G_PULL_DOWN_DISTANCE) {
        this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
      }
    }

    //位移刷新头 刷新头位移固定位置之后，不再移动
    if (this.state.gestureStatus === G_STATUS_NONE) {
      this._headerRefresh.setNativeProps({style: {transform: [{translateY: -G_PULL_DOWN_DISTANCE}]}})
    }
    else if (this.state.gestureStatus === G_STATUS_PULLING_DOWN) {
      this._headerRefresh.setNativeProps({style: {transform: [{translateY: -G_PULL_DOWN_DISTANCE - y}]}})
    }
    else if (this.state.gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
      this._headerRefresh.setNativeProps({style: {transform: [{translateY: 0}]}})
    }
  }

  onTouchStart = (e) => {
    console.log('onTouchStart')
    this.state.startPageY = e.nativeEvent.pageY
  }

  onTouchMove = (e) => {
    console.log('onTouchMove')
    this.state.movePageY = e.nativeEvent.pageY
  }

  onScrollBeginDrag = (e) => {
    console.log('xq debug===onScrollBeginDrag')
    this.state.onDrag = true

    let {y} = e.nativeEvent.contentOffset
    let {startPageY, movePageY} = this.state
    if (y <= 0) {
      if (movePageY > startPageY) {
        //下拉
        this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
      }
      else {
        this._setGestureStatus(G_STATUS_NONE, null, true)
      }
    }
  }

  onScrollEndDrag = (e) => {
    console.log('xq debug===onScrollEndDrag')
    this.state.onDrag = false

    if (this.state.gestureStatus === G_STATUS_PULLING_DOWN) {
      this._setGestureStatus(G_STATUS_NONE, null, false)
    }
    else if (this.state.gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
      this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true)
      this._scrollView.scrollTo({x: 0, y: -G_PULL_DOWN_DISTANCE, animated: false})
    }
  }

  onMomentumScrollBegin = () => {
    //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
    console.log('xq debug===onMomentumScrollBegin')
    this.state.onScrollWithoutDrag = true
  }

  onMomentumScrollEnd = (e) => {
    console.log('xq debug===onMomentumScrollEnd')
    this.state.onScrollWithoutDrag = false
  }

  render() {
    return (
      <View style={Styles.wrap}>
        <ScrollView
          {...this.props}
          ref={ref => this._scrollView = ref}
          scrollEventThrottle={4}
          decelerationRate={0.998}
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onScroll={this.onScroll}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onScrollEndDrag={this.onScrollEndDrag}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}>
          {this.props.children}
        </ScrollView>
        <View
          ref={ref => this._headerRefresh = ref}
          style={[Styles.refresh, {
            transform: [{
              translateY: -G_PULL_DOWN_DISTANCE
            }]
          }]}>
          <HeaderRefresh {...this.props}/>
        </View>
      </View>
    )
  }
}

export default class RefresherListView extends Component {
  static headerRefreshDone = () => MyScrollComponent.headerRefreshDone()

  static propTypes = {
    enableHeaderRefresh: PropTypes.bool,
    renderHeaderRefresh: PropTypes.func,
    setHeaderHeight: PropTypes.number,
  }

  static defaultProps = {
    enableHeaderRefresh: true,
    renderHeaderRefresh: _renderHeaderRefresh,
    setHeaderHeight: G_PULL_DOWN_DISTANCE,
  }

  constructor(props) {
    super(props)
    G_PULL_DOWN_DISTANCE = props.setHeaderHeight
  }

  render() {
    return (
      <ListView
        renderScrollComponent={props => <MyScrollComponent {...props}/>}
        {...this.props}/>
    )
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden'
  },
  refresh: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});