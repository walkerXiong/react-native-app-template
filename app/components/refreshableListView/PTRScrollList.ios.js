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
  G_PULL_DOWN_DISTANCE = 60;//下拉刷新下拉距离大于 60 时触发下拉刷新

const _onHeaderRefreshing = () => {
  setTimeout(() => {
    RefresherListView.headerRefreshDone();
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

const _onFooterInfiniting = () => {
  setTimeout(() => {
    RefresherListView.footerInfiniteDone()
  }, 2000)
}

const _renderFooterInfinite = (gestureStatus) => {
  switch (gestureStatus) {
    case G_STATUS_PULLING_UP:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'上拉即可加载更多...'}</Text>
        </View>
      )
      break
    case G_STATUS_RELEASE_TO_REFRESH:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'松开即可加载更多...'}</Text>
        </View>
      )
      break
    case G_STATUS_FOOTER_REFRESHING:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'正在加载...'}</Text>
        </View>
      )
      break;
    default:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'上拉即可加载更多...'}</Text>
        </View>
      )
  }
}

class FooterInfinite extends Component {
  static setGestureStatus = (gestureStatus, callback) => null

  static defaultProps = {
    renderFooterInfinite: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      gestureStatus: G_STATUS_NONE,
    }
    FooterInfinite.setGestureStatus = this._setGestureStatus
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
    return this.props.renderFooterInfinite(this.state.gestureStatus)
  }
}

export default class PTRScrollComponent extends Component {
  static headerRefreshDone = () => null
  static footerInfiniteDone = () => null

  static propTypes = {
    scrollComponent: PropTypes.oneOf(['ScrollView', 'ListView', 'FlatList', 'VirtualizedList']).isRequired,

    enableHeaderRefresh: PropTypes.bool,
    renderHeaderRefresh: PropTypes.func,
    onHeaderRefreshing: PropTypes.func,

    enableFooterInfinite: PropTypes.bool,
    renderFooterInfinite: PropTypes.func,
    onFooterInfiniting: PropTypes.func,
  }

  static defaultProps = {
    scrollComponent: 'FlatList',

    enableHeaderRefresh: false,
    renderHeaderRefresh: _renderHeaderRefresh,
    onHeaderRefreshing: _onHeaderRefreshing,

    enableFooterInfinite: false,
    renderFooterInfinite: _renderFooterInfinite,
    onFooterInfiniting: _onFooterInfiniting,
  }

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
    }
    PTRScrollComponent.headerRefreshDone = this._headerRefreshDone
    PTRScrollComponent.footerInfiniteDone = this._footerInfiniteDone
  }

  _headerRefreshDone = () => {
    this._setGestureStatus(G_STATUS_NONE, null, false, true)
    this._scrollToPos(0, true)
  }

  _footerInfiniteDone = () => {
    this._setGestureStatus(G_STATUS_NONE, null, false, false)
    this._footerInfinite.setNativeProps({style: {transform: [{translateY: G_PULL_UP_DISTANCE}]}})
  }

  _setGestureStatus = (status, callback, refresh, updateHeader) => {
    this.state.gestureStatus = status
    if (refresh) {
      updateHeader ? HeaderRefresh.setGestureStatus(status, callback) : FooterInfinite.setGestureStatus(status, callback)
    }
  }

  _scrollToPos = (offset, animated) => {
    let {scrollComponent} = this.props
    switch (scrollComponent) {
      case 'ScrollView':
      case 'ListView':
        this._flatList.scrollTo({x: 0, y: offset, animated})
        break
      case 'FlatList':
      case 'VirtualizedList':
        this._flatList.scrollToOffset({offset, animated})
        break
    }
  }

  onScroll = (e) => {
    let {y} = e.nativeEvent.contentOffset
    let {contentSize, layoutMeasurement} = e.nativeEvent
    let {gestureStatus, onDrag, onScrollWithoutDrag, dragDirection} = this.state
    let _maxOffsetY = contentSize.height - layoutMeasurement.height

    //下拉
    if (dragDirection === 1) {
      if (gestureStatus === G_STATUS_NONE) {
        if (onDrag) {
          //开始下拉
          if (y <= 0) {
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
              //刷新完毕归位
              this._setGestureStatus(G_STATUS_NONE, null, true, true)
            }
          }
        }
      }
      else if (gestureStatus === G_STATUS_PULLING_DOWN) {
        //下拉刷新
        if (y <= 0 && Math.abs(y) >= G_PULL_DOWN_DISTANCE) {
          this._setGestureStatus(G_STATUS_RELEASE_TO_REFRESH, null, true, true)
        }
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        //释放刷新
        if (y <= 0 && Math.abs(y) < G_PULL_DOWN_DISTANCE) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
        }
      }

      //位移刷新头 刷新头位移固定位置之后，不再移动
      if (this.state.gestureStatus === G_STATUS_PULLING_DOWN || this.state.gestureStatus === G_STATUS_NONE) {
        this._headerRefresh.setNativeProps({style: {transform: [{translateY: -G_PULL_DOWN_DISTANCE - y}]}})
      }
      else if (this.state.gestureStatus === G_STATUS_RELEASE_TO_REFRESH || this.state.gestureStatus === G_STATUS_HEADER_REFRESHING) {
        this._headerRefresh.setNativeProps({style: {transform: [{translateY: 0}]}})
      }
    }
    //上拉
    else if (dragDirection === -1) {
      if (gestureStatus === G_STATUS_NONE) {
        if (onDrag) {
          //开始上拉
          if (y >= _maxOffsetY) {
            this._setGestureStatus(G_STATUS_PULLING_UP, null, true, false)
          }
        }
        else {
          if (onScrollWithoutDrag) {
            //当前状态为正在惯性滚动
          }
          else {
            //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
            if (y <= _maxOffsetY) {
              //刷新完毕归位
              this._setGestureStatus(G_STATUS_NONE, null, true, false)
            }
          }
        }
      }
      else if (gestureStatus === G_STATUS_PULLING_UP) {
        //上拉加载
        if (y - _maxOffsetY >= G_PULL_UP_DISTANCE) {
          this._setGestureStatus(G_STATUS_RELEASE_TO_REFRESH, null, true, false)
        }
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        //释放刷新
        if (y - _maxOffsetY < G_PULL_UP_DISTANCE) {
          this._setGestureStatus(G_STATUS_PULLING_UP, null, true, false)
        }
      }

      //位移加载头 加载头位移固定位置之后，不再移动
      if (this.state.gestureStatus === G_STATUS_PULLING_UP || this.state.gestureStatus === G_STATUS_NONE) {
        this._footerInfinite.setNativeProps({style: {transform: [{translateY: G_PULL_UP_DISTANCE - (y - (contentSize.height - layoutMeasurement.height))}]}})
      }
      else if (this.state.gestureStatus === G_STATUS_RELEASE_TO_REFRESH || this.state.gestureStatus === G_STATUS_FOOTER_REFRESHING) {
        this._footerInfinite.setNativeProps({style: {transform: [{translateY: 0}]}})
      }
    }
    else {
      if (gestureStatus === G_STATUS_NONE) {
        if (onDrag) {
          //开始下拉
          if (y <= 0) {
            this.state.dragDirection = 1
            this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
          }
          //开始上拉
          else if (y >= _maxOffsetY && layoutMeasurement.height < contentSize.height) {
            this.state.dragDirection = -1
            this._setGestureStatus(G_STATUS_PULLING_UP, null, true, false)
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
              this._setGestureStatus(G_STATUS_NONE, null, true, true)
            }
            else if (y <= _maxOffsetY) {
              //加载完毕归位
              this._setGestureStatus(G_STATUS_NONE, null, true, false)
            }
          }
        }
      }
    }

    this.props.onScroll instanceof Function && this.props.onScroll(e)
  }

  onTouchStart = (e) => {
    this.state.startPageY = e.nativeEvent.pageY
    this.props.onTouchStart instanceof Function && this.props.onTouchStart(e)
  }

  onTouchMove = (e) => {
    this.state.movePageY = e.nativeEvent.pageY
    this.props.onTouchMove instanceof Function && this.props.onTouchMove(e)
  }

  onScrollBeginDrag = (e) => {
    this.state.onDrag = true
    this.state.dragDirection = 0

    let {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent
    let {gestureStatus, startPageY, movePageY} = this.state

    if (layoutMeasurement.height >= contentSize.height) {
      //不足一屏
      if (movePageY > startPageY) {
        //下拉
        this.state.dragDirection = 1
        if (gestureStatus !== G_STATUS_HEADER_REFRESHING) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true, true)
        }
      }
      else {
        // 不足一屏不允许上拉
        // this.state.dragDirection = -1
        // if (gestureStatus !== G_STATUS_FOOTER_REFRESHING) {
        //   this._setGestureStatus(G_STATUS_PULLING_UP, null, true, false)
        // }
      }
    }
    else {
      if (contentOffset.y <= 0) {
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

    this.props.onScrollBeginDrag instanceof Function && this.props.onScrollBeginDrag(e)
  }

  onScrollEndDrag = (e) => {
    this.state.onDrag = false
    this.state.startPageY = this.state.movePageY = 0

    let {gestureStatus, dragDirection} = this.state
    let {contentSize, layoutMeasurement} = e.nativeEvent
    //下拉
    if (dragDirection === 1) {
      if (gestureStatus === G_STATUS_PULLING_DOWN) {
        this._setGestureStatus(G_STATUS_NONE, null, false, true)
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        this.props.onHeaderRefreshing instanceof Function && this.props.onHeaderRefreshing()
        this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true, true)
        this._scrollToPos(-G_PULL_DOWN_DISTANCE, false)
      }
    }
    //上拉
    else if (dragDirection === -1) {
      if (gestureStatus === G_STATUS_PULLING_UP) {
        this._setGestureStatus(G_STATUS_NONE, null, false, false)
      }
      else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
        this.props.onFooterInfiniting instanceof Function && this.props.onFooterInfiniting()
        this._setGestureStatus(G_STATUS_FOOTER_REFRESHING, null, true, false)
        this._scrollToPos(contentSize.height - layoutMeasurement.height + G_PULL_UP_DISTANCE, false)
      }
    }

    this.props.onScrollEndDrag instanceof Function && this.props.onScrollEndDrag(e)
  }

  onMomentumScrollBegin = (e) => {
    //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
    this.state.onScrollWithoutDrag = true
    this.props.onMomentumScrollBegin instanceof Function && this.props.onMomentumScrollBegin(e)
  }

  onMomentumScrollEnd = (e) => {
    this.state.onScrollWithoutDrag = false
    this.props.onMomentumScrollEnd instanceof Function && this.props.onMomentumScrollEnd(e)
  }

  render() {
    let {scrollComponent, enableHeaderRefresh, enableFooterInfinite} = this.props
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
      <View style={Styles.wrap}>
        <View
          ref={ref => this._headerRefresh = ref}
          onLayout={e => G_PULL_DOWN_DISTANCE = enableHeaderRefresh ? e.nativeEvent.layout.height : height}
          style={[Styles.refresh, {
            transform: [{
              translateY: -height
            }]
          }]}>
          {enableHeaderRefresh ? <HeaderRefresh {...this.props}/> : null}
        </View>
        <View
          ref={ref => this._footerInfinite = ref}
          onLayout={e => G_PULL_UP_DISTANCE = enableFooterInfinite ? e.nativeEvent.layout.height : height}
          style={[Styles.infinite, {
            transform: [{
              translateY: height
            }]
          }]}>
          {enableFooterInfinite ? <FooterInfinite {...this.props}/> : null}
        </View>
        {
          React.cloneElement(ScrollComponent, {
            ref: ref => {
              this._flatList = ref
              this.props.getRef instanceof Function && this.props.getRef(ref)
            },
            scrollEventThrottle: this.props.scrollEventThrottle || 4,
            onTouchStart: this.onTouchStart,
            onTouchMove: this.onTouchMove,
            onScroll: this.onScroll,
            onScrollBeginDrag: this.onScrollBeginDrag,
            onScrollEndDrag: this.onScrollEndDrag,
            onMomentumScrollBegin: this.onMomentumScrollBegin,
            onMomentumScrollEnd: this.onMomentumScrollEnd
          }, this.props.children)
        }
      </View>
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
  infinite: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }
});