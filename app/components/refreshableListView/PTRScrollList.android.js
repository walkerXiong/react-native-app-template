/**
 * Created by hebao on 2017/8/28.
 */
'use strict'
import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  ScrollView,
  ListView,
  FlatList,
  VirtualizedList
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

const _onHeaderRefreshing = () => {
  setTimeout(() => {
    PTRScrollComponent.headerRefreshDone();
  }, 2000)
}

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

class PTRScrollComponent extends Component {
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
      dragDirection: 0,//-1上拉 0无 1下拉

      headerHeight: new Animated.Value(G_PULL_DOWN_DISTANCE)
    }
    PTRScrollComponent.headerRefreshDone = this._headerRefreshDone
  }

  componentDidMount() {
    this.props.onHeaderRefreshing instanceof Function && this.props.onHeaderRefreshing()
    this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true, true)
  }

  _headerRefreshDone = () => {
    this._setGestureStatus(G_STATUS_NONE, null, false)
    this._scrollToPos(0, G_PULL_DOWN_DISTANCE, true)
  }

  _setGestureStatus = (status, callback, refresh) => {
    this.state.gestureStatus = status
    if (refresh) {
      HeaderRefresh.setGestureStatus(status, callback)
    }
  }

  _scrollToPos = (x, y, animated) => {
    this._scrollView.scrollTo({x, y, animated})
  }

  onScroll = (e) => {
    console.log('xq debug===onScroll')
    let {y} = e.nativeEvent.contentOffset
    let {gestureStatus, onDrag, onScrollWithoutDrag, dragDirection} = this.state

    //下拉
    if (dragDirection === 1) {
      if (gestureStatus === G_STATUS_NONE) {
        if (onDrag) {
          //开始下拉
          if (y <= G_PULL_DOWN_DISTANCE) {
            this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
          }
        }
        else {
          if (onScrollWithoutDrag) {
            //当前状态为正在惯性滚动
          }
          else {
            //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
            if (y === G_PULL_DOWN_DISTANCE) {
              //刷新完毕归位
              this._setGestureStatus(G_STATUS_NONE, null, true, true)
            }
          }
        }
      }
      else if (gestureStatus === G_STATUS_PULLING_DOWN) {
        //下拉刷新
        if (y === 0) {
          this._setGestureStatus(G_STATUS_RELEASE_TO_REFRESH, null, true, true)
        }
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        //释放刷新
        if (y > 0) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
        }
      }
    }
    //上拉
    else if (dragDirection === -1) {
    }
    else {
      if (gestureStatus === G_STATUS_NONE) {
        if (onDrag) {
          //开始下拉
          if (y <= G_PULL_DOWN_DISTANCE) {
            this.state.dragDirection = 1
            this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
          }
        }
        else {
          if (onScrollWithoutDrag) {
            //当前状态为正在惯性滚动
          }
          else {
            //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
            if (y === 0) {
              this._setGestureStatus(G_STATUS_NONE, null, true, true)
              this._scrollToPos(0, G_PULL_DOWN_DISTANCE, true)
            }
            else if (y === G_PULL_DOWN_DISTANCE) {
              //刷新完毕归位
              this._setGestureStatus(G_STATUS_NONE, null, true, true)
            }
          }
        }
      }
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
    this.state.dragDirection = 0

    let {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent
    let {gestureStatus, startPageY, movePageY} = this.state
    if (contentOffset.y <= G_PULL_DOWN_DISTANCE) {
      //到顶部
      if (movePageY > startPageY) {
        //下拉
        this.state.dragDirection = 1
        if (gestureStatus !== G_STATUS_HEADER_REFRESHING) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
        }
      }
    }
    else if (contentOffset.y >= contentSize.height - layoutMeasurement.height) {
      //到底部
      if (movePageY < startPageY) {
        //上拉
        this.state.dragDirection = -1
        if (gestureStatus !== G_STATUS_FOOTER_REFRESHING) {
          this._setGestureStatus(G_STATUS_PULLING_UP, null, true, false)
        }
      }
    }
  }

  onScrollEndDrag = (e) => {
    console.log('xq debug===onScrollEndDrag')
    this.state.onDrag = false
    this.state.startPageY = this.state.movePageY = 0

    let {gestureStatus, dragDirection} = this.state
    let {contentSize, layoutMeasurement} = e.nativeEvent
    let _maxOffsetY = contentSize.height - layoutMeasurement.height
    //下拉
    if (dragDirection === 1) {
      if (gestureStatus === G_STATUS_PULLING_DOWN) {
        this._setGestureStatus(G_STATUS_NONE, null, false, true)
        this._scrollToPos(0, G_PULL_DOWN_DISTANCE, true)
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        this.props.onHeaderRefreshing instanceof Function && this.props.onHeaderRefreshing()
        this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true, true)
      }
    }
    //上拉
    else if (dragDirection === -1) {
      if (gestureStatus === G_STATUS_PULLING_UP) {
        this._setGestureStatus(G_STATUS_NONE, null, false, false)
        this._scrollToPos(0, _maxOffsetY, true)
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        this.props.onFooterInfiniting instanceof Function && this.props.onFooterInfiniting()
        this._setGestureStatus(G_STATUS_FOOTER_REFRESHING, null, true, false)
      }
    }
  }

  onMomentumScrollBegin = (e) => {
    //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
    console.log('xq debug===onMomentumScrollBegin')
    this.state.onScrollWithoutDrag = true
  }

  onMomentumScrollEnd = (e) => {
    console.log('xq debug===onMomentumScrollEnd')
    this.state.onScrollWithoutDrag = false

    let {contentOffset} = e.nativeEvent
    let {gestureStatus, dragDirection} = this.state
    if (dragDirection === 0) {
      if (gestureStatus === G_STATUS_NONE) {
        if (contentOffset.y < G_PULL_DOWN_DISTANCE) {
          this._scrollToPos(0, G_PULL_DOWN_DISTANCE, true)
        }
      }
    }
  }

  scrollViewLayout = (e) => {
    console.log('===xq debug===scrollViewLayout')
    console.log(e.nativeEvent)
    this.scrollViewHeight = e.nativeEvent.layout.height
  }

  scrollContentLayout = (e) => {
    console.log('===xq debug===scrollContentLayout')
    console.log(e.nativeEvent)
    this.scrollContentHeight = e.nativeEvent.layout.height
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={ref => this._scrollView = ref}
        onLayout={this.scrollViewLayout}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        scrollEventThrottle={16}
        onScroll={this.onScroll}
        onScrollBeginDrag={this.onScrollBeginDrag}
        onScrollEndDrag={this.onScrollEndDrag}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}>
        <View onLayout={this.scrollContentLayout}>
          <Animated.View style={{height: this.state.headerHeight}}>
            <HeaderRefresh {...this.props}/>
          </Animated.View>
          {this.props.children}
        </View>
      </ScrollView>
    )
  }
}

export default class PTRScrollList extends Component {
  static headerRefreshDone = () => PTRScrollComponent.headerRefreshDone()

  static propTypes = {
    scrollComponent: PropTypes.oneOf(['ScrollView', 'ListView', 'FlatList', 'VirtualizedList']).isRequired,

    enableHeaderRefresh: PropTypes.bool,
    renderHeaderRefresh: PropTypes.func,
    setHeaderHeight: PropTypes.number,
    onHeaderRefreshing: PropTypes.func,
  }

  static defaultProps = {
    scrollComponent: 'FlatList',

    enableHeaderRefresh: false,
    renderHeaderRefresh: _renderHeaderRefresh,
    setHeaderHeight: G_PULL_DOWN_DISTANCE,
    onHeaderRefreshing: _onHeaderRefreshing,
  }

  constructor(props) {
    super(props)
    G_PULL_DOWN_DISTANCE = props.setHeaderHeight
  }

  render() {
    let {scrollComponent} = this.props
    let ScrollComponent = null
    switch (scrollComponent) {
      case 'ScrollView':
        ScrollComponent = <ScrollView {...this.props}/>
        break
      case 'ListView':
        ScrollComponent = <ListView {...this.props}/>
        break
      case 'FlatList':
        ScrollComponent = <FlatList {...this.props}/>
        break
      case 'VirtualizedList':
        ScrollComponent = <VirtualizedList {...this.props}/>
        break
      default:
        ScrollComponent = <FlatList {...this.props}/>
        break
    }
    return (
      React.cloneElement(ScrollComponent, {
        renderScrollComponent: props => <PTRScrollComponent {...props}/>
      })
    )
  }
}

const Styles = StyleSheet.create({});