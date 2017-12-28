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
      );
      break;
    case G_STATUS_RELEASE_TO_REFRESH:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'松开即可刷新'}</Text>
        </View>
      );
      break;
    case G_STATUS_HEADER_REFRESHING:
      setTimeout(() => {
        RefresherListView.headerRefreshDone();
      }, 2000);
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'正在刷新...'}</Text>
        </View>
      );
      break;
    default:
      return (
        <View style={{width, height: 60, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{'下拉刷新'}</Text>
        </View>
      );
  }
};

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
    return nextState.gestureStatus !== this.state.gestureStatus;
  }

  _setGestureStatus = (gestureStatus, callback) => {
    this.setState({gestureStatus}, () => callback instanceof Function && callback())
  }

  render() {
    return this.props.renderHeaderRefresh(this.state.gestureStatus)
  }
}

const _renderFooterInfinite = (gestureStatus) => {
  switch (gestureStatus) {
    case G_STATUS_PULLING_UP:
      return <Text>{'上拉即可加载更多...'}</Text>;
      break;
    case G_STATUS_RELEASE_TO_REFRESH:
      return <Text>{'松开即可加载更多...'}</Text>;
      break;
    case G_STATUS_FOOTER_REFRESHING:
      setTimeout(() => {
        RefresherListView.footerInfiniteDone();
      }, 2000);
      return <Text>{'正在加载...'}</Text>;
      break;
    default:
      return <Text>{'上拉即可加载更多...'}</Text>;
  }
};

class FooterInfinite extends Component {
  static defaultProps = {
    renderFooterInfinite: () => null
  };

  constructor(props) {
    super(props);
    this.state = {
      gestureStatus: G_STATUS_NONE,
      aniTranslateY: new Animated.Value(G_PULL_UP_DISTANCE)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.gestureStatus !== this.state.gestureStatus;
  }

  _setGestureStatus(gestureStatus) {
    this.setState({gestureStatus});
  }

  _setAniTranslateY(translateY) {
    this.state.aniTranslateY.setValue(G_PULL_UP_DISTANCE - translateY);
  }

  _getAniTranslateY() {
    return this.state.aniTranslateY;
  }

  render() {
    let {gestureStatus} = this.state;
    return (
      <Animated.View
        style={[Styles.loadMore, {
          height: G_PULL_UP_DISTANCE,
          transform: [{translateY: this.state.aniTranslateY}]
        }]}>
        {this.props.renderFooterInfinite(gestureStatus)}
      </Animated.View>
    );
  }
}

class MyScrollComponent extends Component {
  static headerRefreshDone = () => null

  static footerInfiniteDone = () => null

  constructor(props) {
    super(props)
    this.state = {
      //当前手势状态
      gestureStatus: G_STATUS_NONE,
      //当前拖动状态
      onDrag: false,
      //当前是否惯性滚动状态
      onScrollWithoutDrag: false,
      offset: 0,

      startPageY: 0,
      movePageY: 0,
      getDirection: false
    }
    MyScrollComponent.headerRefreshDone = this._headerRefreshDone
    MyScrollComponent.footerInfiniteDone = this._footerInfiniteDone
  }

  componentDidMount() {
    //this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true)
  }

  _headerRefreshDone = () => {
    this._setGestureStatus(G_STATUS_NONE, null, false)
    this._scrollView.scrollTo({x: 0, y: G_MAX_PULL_DISTANCE, animated: true})
  }

  _footerInfiniteDone = () => {

  }

  _setGestureStatus = (status, callback, refresh) => {
    if (this.state.gestureStatus !== status || refresh === true) {
      this.state.gestureStatus = status
      refresh === true ? HeaderRefresh.setGestureStatus(status, callback) : null
    }
  }

  onScroll = (e) => {
    console.log('xq debug===onScroll')
    let {y} = e.nativeEvent.contentOffset
    this.state.offset = y

    let {gestureStatus, onDrag, onScrollWithoutDrag} = this.state
    if (gestureStatus === G_STATUS_NONE) {
      if (onDrag) {
        //开始下拉
        if (y <= 1) {
          this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
          this._headerRefreshWrap.setNativeProps({style: {height: G_MAX_PULL_DISTANCE}})
          this._scrollView.scrollTo({x: 0, y: G_MAX_PULL_DISTANCE, animated: false})
        }
      }
      else {
        if (onScrollWithoutDrag) {
          //当前状态为正在惯性滚动
        }
        else {
          //scrollTo 设置 animated 为 true 时，不会触发 onMomentumScrollBegin
          if (y === G_MAX_PULL_DISTANCE) {
            //刷新完毕归位
            this._setGestureStatus(G_STATUS_NONE, null, true)
            this._headerRefreshWrap.setNativeProps({style: {height: 0}})
            this._scrollView.scrollTo({x: 0, y: 0, animated: false})
          }
        }
      }
    }
    else if (gestureStatus === G_STATUS_PULLING_DOWN) {
      //下拉刷新
      if (y <= G_MAX_PULL_DISTANCE - G_PULL_DOWN_DISTANCE) {
        this._setGestureStatus(G_STATUS_RELEASE_TO_REFRESH, null, true)
      }
    }
    else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
      //释放刷新
      if (y > G_MAX_PULL_DISTANCE - G_PULL_DOWN_DISTANCE) {
        this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
      }
    }
  }

  onTouchStart = (e) => {
    this.state.getDirection = false
    this.state.startPageY = e.nativeEvent.pageY
  }

  onTouchMove = (e) => {
    this.state.movePageY = e.nativeEvent.pageY
    if (!this.state.getDirection && this.state.offset === 0 && this.state.movePageY > this.state.startPageY) {
      this.state.getDirection = true
      this._headerRefreshWrap.setNativeProps({style: {height: G_MAX_PULL_DISTANCE}})
      this._scrollView.scrollTo({x: 0, y: G_MAX_PULL_DISTANCE, animated: false})
    }
  }

  onScrollBeginDrag = (e) => {
    this.state.onDrag = true

    let {y} = e.nativeEvent.contentOffset
    let {startPageY, movePageY} = this.state
    console.log('xq debug===onScrollBeginDrag===startPageY:' + startPageY + ';movePageY:' + movePageY + ';contentOffset:' + y)
    if (movePageY > startPageY) {//下拉
      if (y <= 1) {
        this._setGestureStatus(G_STATUS_PULLING_DOWN, null, true)
      }
    }
    else if (movePageY < startPageY) {//上滑
    }
  }

  onScrollEndDrag = (e) => {
    console.log('xq debug===onScrollEndDrag')
    this.state.onDrag = false
    this.state.offset = e.nativeEvent.contentOffset.y

    let {gestureStatus} = this.state
    if (gestureStatus === G_STATUS_PULLING_DOWN) {
      this._setGestureStatus(G_STATUS_NONE, null, false)
      this._scrollView.scrollTo({x: 0, y: G_MAX_PULL_DISTANCE, animated: true})
    }
    else if (gestureStatus === G_STATUS_RELEASE_TO_REFRESH) {
      this._setGestureStatus(G_STATUS_HEADER_REFRESHING, null, true)
      this._scrollView.scrollTo({x: 0, y: G_MAX_PULL_DISTANCE - G_PULL_DOWN_DISTANCE, animated: true})
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
    this.state.offset = e.nativeEvent.contentOffset.y
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={ref => this._scrollView = ref}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        scrollEventThrottle={16}
        onScroll={this.onScroll}
        onScrollBeginDrag={this.onScrollBeginDrag}
        onScrollEndDrag={this.onScrollEndDrag}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}>
        <View ref={ref => this._headerRefreshWrap = ref} style={[Styles.refresh, {height: 0}]}>
          <HeaderRefresh {...this.props}/>
        </View>
        {this.props.children}
      </ScrollView>
    )
  }
}

export default class RefresherListView extends Component {
  static headerRefreshDone = () => MyScrollComponent.headerRefreshDone()

  static footerInfiniteDone = () => MyScrollComponent.footerInfiniteDone()

  static propTypes = {
    enableHeaderRefresh: PropTypes.bool,
    renderHeaderRefresh: PropTypes.func,
    setHeaderHeight: PropTypes.number,

    enableFooterInfinite: PropTypes.bool,
    renderFooterInfinite: PropTypes.func,
    setFooterHeight: PropTypes.number,

    setMaxPullDistance: PropTypes.number,
  }

  static defaultProps = {
    enableHeaderRefresh: true,
    renderHeaderRefresh: _renderHeaderRefresh,
    setHeaderHeight: G_PULL_DOWN_DISTANCE,

    enableFooterInfinite: false,
    renderFooterInfinite: _renderFooterInfinite,
    setFooterHeight: G_PULL_UP_DISTANCE,

    setMaxPullDistance: G_MAX_PULL_DISTANCE,
  }

  constructor(props) {
    super(props)
    G_PULL_DOWN_DISTANCE = props.setHeaderHeight
    G_PULL_UP_DISTANCE = props.setFooterHeight
    G_MAX_PULL_DISTANCE = props.setMaxPullDistance
  }

  render() {
    return (
      <ListView
        renderScrollComponent={props => <MyScrollComponent {...props}/>}
        {...this.props}/>
    );
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  refresh: {
    width,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#d6d6d6'
  },
  loadMore: {
    width,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#feafea'
  }
});