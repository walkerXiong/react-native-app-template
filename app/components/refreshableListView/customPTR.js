/**
 * Created by hebao on 2017/8/28.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  ListView,
  Dimensions,
  Animated,
  Text,
  PixelRatio,
  ScrollView,
  RefreshControl
} from 'react-native';

const {width, height} = Dimensions.get('window');
const
  G_STATUS_NONE = 0,// 正常手势，没有上拉或者下拉刷新
  G_STATUS_PULLING_UP = 1,// ListView 处于底部，上拉加载更多
  G_STATUS_PULLING_DOWN = 2,// ListView 处于顶部，下拉刷新
  G_STATUS_RELEASE_TO_REFRESH = 3,// 拉动距离处于可触发刷新或者加载状态
  G_STATUS_HEADER_REFRESHING = 4,// 顶部正在刷新
  G_STATUS_FOOTER_REFRESHING = 5;// 底部正在加载更多

let
  G_PULL_UP_DISTANCE = 50,//上拉加载更多最大上拉距离
  G_PILL_UP_FIX_DISTANCE = 8,//上拉加载更多可上拉距离小于 8 时触发上拉加载
  G_PULL_DOWN_DISTANCE = 60,//下拉刷新最大下拉距离
  G_PILL_DOWN_FIX_DISTANCE = 20;//下拉刷新可下拉距离小于 20 时触发下拉刷新

const _renderHeaderRefresh = (gestureStatus) => {
  switch (gestureStatus) {
    case G_STATUS_PULLING_DOWN:
      return <Text>{'下拉刷新'}</Text>;
      break;
    case G_STATUS_RELEASE_TO_REFRESH:
      return <Text>{'松开即可刷新'}</Text>;
      break;
    case G_STATUS_HEADER_REFRESHING:
      setTimeout(() => {
        RefresherListView.headerRefreshDone();
      }, 2000);
      return <Text>{'正在刷新...'}</Text>;
      break;
    default:
      return <Text>{'下拉刷新'}</Text>;
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
    let {gestureStatus} = this.state;
    return (
      <View
        style={[Styles.refresh, {height: gestureStatus !== G_STATUS_NONE ? G_PULL_DOWN_DISTANCE : 0}]}>
        {this.props.renderHeaderRefresh(gestureStatus)}
      </View>
    )
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
  constructor(props) {
    super(props)
    this.state = {
      //当前手势状态
      gestureStatus: G_STATUS_NONE,

      startPageY: 0,
      movePageY: 0
    }
  }

  onScroll = (e) => {
    console.log('xq debug===onScroll')

  }

  onTouchStart = (e) => {
    this.state.startPageY = e.nativeEvent.pageY
  }

  onTouchMove = (e) => {
    this.state.movePageY = e.nativeEvent.pageY
  }

  onScrollBeginDrag = (e) => {
    let {startPageY, movePageY} = this.state
    let {y} = e.nativeEvent.contentOffset
    console.log('xq debug===onScrollBeginDrag===startPageY:' + startPageY + ';movePageY:' + movePageY + ';contentOffset:' + y)
    if (movePageY > startPageY && y === 0) {
      //开始下拉刷新
      HeaderRefresh.setGestureStatus(G_STATUS_PULLING_DOWN, () => {
        this._scrollView.scrollTo({x: 0, y: G_PULL_DOWN_DISTANCE, animated: false})
        this.state.gestureStatus = G_STATUS_PULLING_DOWN
      })
    }
  }

  onScrollEndDrag = (e) => {
    console.log('xq debug===onScrollEndDrag')
    let {y} = e.nativeEvent.contentOffset
  }

  onMomentumScrollBegin = () => {
    console.log('xq debug===onMomentumScrollBegin')
  }

  onMomentumScrollEnd = (e) => {
    console.log('xq debug===onMomentumScrollEnd')
    let {y} = e.nativeEvent.contentOffset
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={ref => this._scrollView = ref}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onScroll={this.onScroll}
        onScrollBeginDrag={this.onScrollBeginDrag}
        onScrollEndDrag={this.onScrollEndDrag}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}>
        <HeaderRefresh {...this.props}/>
        {this.props.children}
      </ScrollView>
    )
  }
}

export default class RefresherListView extends Component {
  static propTypes = {
    enableHeaderRefresh: PropTypes.bool,
    renderHeaderRefresh: PropTypes.func,
    setHeaderHeight: PropTypes.number,
    setHeaderGapToRefresh: PropTypes.number,

    enableFooterInfinite: PropTypes.bool,
    renderFooterInfinite: PropTypes.func,
    setFooterHeight: PropTypes.number,
    setFooterGapToInfinite: PropTypes.number
  }

  static defaultProps = {
    enableHeaderRefresh: true,
    renderHeaderRefresh: _renderHeaderRefresh,
    setHeaderHeight: G_PULL_DOWN_DISTANCE,
    setHeaderGapToRefresh: G_PILL_DOWN_FIX_DISTANCE,

    enableFooterInfinite: false,
    renderFooterInfinite: _renderFooterInfinite,
    setFooterHeight: G_PULL_UP_DISTANCE,
    setFooterGapToInfinite: G_PILL_UP_FIX_DISTANCE
  }

  constructor(props) {
    super(props)
    G_PULL_DOWN_DISTANCE = props.setHeaderHeight
    G_PILL_DOWN_FIX_DISTANCE = props.setHeaderGapToRefresh
    G_PULL_UP_DISTANCE = props.setFooterHeight
    G_PILL_UP_FIX_DISTANCE = props.setFooterGapToInfinite
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
    justifyContent: 'center',
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