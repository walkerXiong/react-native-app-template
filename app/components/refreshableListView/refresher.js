/**
 * Created by hebao on 2017/8/25.
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
    Text
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const
    G_STATUS_NONE = 0,// 正常手势，没有上拉或者下拉刷新
    G_STATUS_PULLING_UP = 1,// ListView 处于底部，上拉加载更多
    G_STATUS_PULLING_DOWN = 2,// ListView 处于顶部，下拉刷新
    G_STATUS_RELEASE_TO_REFRESH = 3,// 拉动距离处于可触发刷新或者加载状态
    G_STATUS_HEADER_REFRESHING = 4,// 顶部正在刷新
    G_STATUS_FOOTER_REFRESHING = 5;// 底部正在加载更多

let
    G_PULL_UP_DISTANCE = 30,//上拉加载更多最大上拉距离
    G_PILL_UP_FIX_DISTANCE = 8,//上拉加载更多可上拉距离小于 8 时触发上拉加载
    G_PULL_DOWN_DISTANCE = 30,//下拉刷新最大下拉距离
    G_PILL_DOWN_FIX_DISTANCE = 8;//下拉刷新可下拉距离小于 20 时触发下拉刷新


let _renderHeaderRefresh = (gestureStatus) => {
    switch (gestureStatus) {
        case G_STATUS_PULLING_DOWN:
            return <Text>{'下拉刷新'}</Text>;
            break;
        case G_STATUS_RELEASE_TO_REFRESH:
            return <Text>{'松开即可刷新'}</Text>;
            break;
        case G_STATUS_HEADER_REFRESHING:
            return <Text>{'正在刷新...'}</Text>;
            break;
        default:
            return null;
    }
};

class HeaderRefresh extends Component {

    static defaultProps = {
        renderHeaderRefresh: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            gestureStatus: G_STATUS_NONE
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.gestureStatus !== this.state.gestureStatus;
    }

    _setGestureStatus(gestureStatus) {
        this.setState({gestureStatus});
    }

    onLayout = (evt) => {
        let _layoutHeight = Math.floor(evt.nativeEvent.layout.height);
        _layoutHeight > G_PULL_DOWN_DISTANCE ? G_PULL_DOWN_DISTANCE = _layoutHeight : null;
    };

    render() {
        let {gestureStatus} = this.state;
        return (
            <View style={Styles.refresh} onLayout={this.onLayout}>
                {this.props.renderHeaderRefresh(gestureStatus)}
            </View>
        );
    }
}

let _renderFooterInfinite = (gestureStatus) => {
    switch (gestureStatus) {
        case G_STATUS_PULLING_UP:
            return <Text>{'上拉即可加载更多...'}</Text>;
            break;
        case G_STATUS_RELEASE_TO_REFRESH:
            return <Text>{'松开即可加载更多...'}</Text>;
            break;
        case G_STATUS_FOOTER_REFRESHING:
            return <Text>{'正在加载...'}</Text>;
            break;
        default:
            return null;
    }
};

class FooterInfinite extends Component {

    static defaultProps = {
        renderFooterInfinite: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            gestureStatus: G_STATUS_NONE
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.gestureStatus !== this.state.gestureStatus;
    }

    _setGestureStatus(gestureStatus) {
        this.setState({gestureStatus});
    }

    onLayout = (evt) => {
        let _layoutHeight = Math.floor(evt.nativeEvent.layout.height);
        _layoutHeight > G_PULL_UP_DISTANCE ? G_PULL_UP_DISTANCE = _layoutHeight : null;
    };

    render() {
        let {gestureStatus} = this.state;
        return (
            <View style={Styles.loadMore} onLayout={this.onLayout}>
                {this.props.renderFooterInfinite(gestureStatus)}
            </View>
        );
    }
}

export default class RefresherListView extends Component {
    _panResponder = null;//触摸响应句柄
    _listView = null;// ListView 实例
    _headerRefresh = null;//顶部刷新组件实例
    _footerInfinite = null;//上拉加载更多组件实例


    static propTypes = {
        enableHeaderRefresh: PropTypes.bool,
        renderHeaderRefresh: PropTypes.func,

        enableFooterInfinite: PropTypes.bool,
        renderFooterInfinite: PropTypes.func,
    };

    static defaultProps = {
        enableHeaderRefresh: false,
        renderHeaderRefresh: _renderHeaderRefresh,

        enableFooterInfinite: true,
        renderFooterInfinite: _renderFooterInfinite,
    };

    static headerRefreshDone = () => null;
    static footerInfiniteDone = () => null;

    _headerRefreshDone = () => {
        this.state.p_currPullDistance = 0;
        Animated.timing(this.state.p_translateY, {
            toValue: 0,
            duration: 100
        }).start(() => {
            if (this.state.gestureStatus !== G_STATUS_NONE) {
                this.state.gestureStatus = G_STATUS_NONE;
                this._headerRefresh._setGestureStatus(this.state.gestureStatus);
            }
        });
    };

    _footerInfiniteDone = () => {
        this.state.p_currPullDistance = 0;
        Animated.timing(this.state.p_translateY, {
            toValue: 0,
            duration: 100
        }).start(() => {
            this._listView.scrollTo({x: 0, y: this.state.l_contentOffset_y + G_PULL_UP_DISTANCE, animated: false});
            if (this.state.gestureStatus !== G_STATUS_NONE) {
                this.state.gestureStatus = G_STATUS_NONE;
                this._footerInfinite._setGestureStatus(this.state.gestureStatus);
            }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            //当前手势状态
            gestureStatus: G_STATUS_NONE,
            //以下为处理 ListView 所需参数
            l_layout_height: 0,// ListView 的组件高度 避免精度问题，内容高度使用floor
            l_contentHeight: 0,// ListView 的内容高度 避免精度问题，内容高度使用floor
            l_contentOffset_y: 0,// ListView 的滚动高度 避免精度问题，滚动高度使用ceil
            l_onTopReached: false,// ListView 滚动到顶部
            l_onEndReached: false,// ListView 滚动到底部

            //以下为 PullUpDown 所需参数
            p_translateY: new Animated.Value(0),// ListView 上拉时候的位移距离，用于展现刷新指示组件
            p_currPullDistance: 0,// ListView 当前上拉或下拉的距离
        };
        RefresherListView.headerRefreshDone = this._headerRefreshDone;
        RefresherListView.footerInfiniteDone = this._footerInfiniteDone;
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderEnd: this.onPanResponderEnd,
            onPanResponderRelease: this.onPanResponderRelease,
        });
    }

    onMoveShouldSetPanResponderCapture = (evt, gestureState) => {
        let {l_layout_height, l_contentHeight, l_contentOffset_y} = this.state;

        if (l_contentHeight <= l_layout_height) {
            this.state.l_onTopReached = gestureState.dy > 0 && gestureState.vy > 0;
            this.state.l_onEndReached = gestureState.dy < 0 && gestureState.vy < 0;
        }
        else {
            this.state.l_onTopReached = l_contentOffset_y <= 0 && gestureState.dy > 0 && gestureState.vy > 0;
            this.state.l_onEndReached = l_contentOffset_y >= l_contentHeight - l_layout_height && gestureState.dy < 0 && gestureState.vy < 0;
        }

        return (this.state.l_onTopReached && this.props.enableHeaderRefresh) || (this.state.l_onEndReached && this.props.enableFooterInfinite);
    };
    handlePanResponderMove = (evt, gestureState) => {
        let _translateY = Math.ceil(Math.abs(gestureState.dy));
        //下拉刷新
        if (this.state.l_onTopReached && gestureState.dy > 0) {
            this.state.p_translateY.setValue(_translateY >= G_PULL_DOWN_DISTANCE ? G_PULL_DOWN_DISTANCE : _translateY);
            this.state.p_currPullDistance = _translateY >= G_PULL_DOWN_DISTANCE ? G_PULL_DOWN_DISTANCE : _translateY;

            if (this.state.p_currPullDistance >= G_PULL_DOWN_DISTANCE - G_PILL_DOWN_FIX_DISTANCE) {
                if (this.state.gestureStatus !== G_STATUS_RELEASE_TO_REFRESH) {
                    this.state.gestureStatus = G_STATUS_RELEASE_TO_REFRESH;
                    this._headerRefresh._setGestureStatus(this.state.gestureStatus);
                }
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_PULLING_DOWN) {
                    this.state.gestureStatus = G_STATUS_PULLING_DOWN;
                    this._headerRefresh._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
        //上拉加载更多
        else if (this.state.l_onEndReached && gestureState.dy < 0) {
            this.state.p_translateY.setValue(_translateY >= G_PULL_UP_DISTANCE ? -G_PULL_UP_DISTANCE : -_translateY);
            this.state.p_currPullDistance = _translateY >= G_PULL_UP_DISTANCE ? G_PULL_UP_DISTANCE : _translateY;
            if (this.state.p_currPullDistance >= G_PULL_UP_DISTANCE - G_PILL_UP_FIX_DISTANCE) {
                if (this.state.gestureStatus !== G_STATUS_RELEASE_TO_REFRESH) {
                    this.state.gestureStatus = G_STATUS_RELEASE_TO_REFRESH;
                    this._footerInfinite._setGestureStatus(this.state.gestureStatus);
                }
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_PULLING_UP) {
                    this.state.gestureStatus = G_STATUS_PULLING_UP;
                    this._footerInfinite._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
    };
    onPanResponderEnd = () => {
        //下拉刷新
        if (this.state.l_onTopReached) {
            if (this.state.p_currPullDistance < G_PULL_DOWN_DISTANCE - G_PILL_DOWN_FIX_DISTANCE) {
                this.state.p_currPullDistance = 0;
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }).start();
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_HEADER_REFRESHING) {
                    this.state.gestureStatus = G_STATUS_HEADER_REFRESHING;
                    this._headerRefresh._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
        //上拉加载更多
        else if (this.state.l_onEndReached) {
            if (this.state.p_currPullDistance < G_PULL_UP_DISTANCE - G_PILL_UP_FIX_DISTANCE) {
                this.state.p_currPullDistance = 0;
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }).start();
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_FOOTER_REFRESHING) {
                    this.state.gestureStatus = G_STATUS_FOOTER_REFRESHING;
                    this._footerInfinite._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
    };
    onPanResponderRelease = () => {
        if (this.state.p_currPullDistance !== 0) {
            this.onPanResponderEnd();
        }
    };

    //主要用于获取 ListView 的高度
    onLayout = (evt) => {
        let {onLayout} = this.props;
        this.state.l_layout_height = Math.floor(evt.nativeEvent.layout.height);
        onLayout && onLayout instanceof Function ? onLayout(evt) : null;
    };
    //主要获取 ListView 的内容高度
    onContentSizeChange = (contentWidth, contentHeight) => {
        let {onContentSizeChange} = this.props;
        this.state.l_contentHeight = Math.floor(contentHeight);
        onContentSizeChange && onContentSizeChange instanceof Function ? onContentSizeChange(contentWidth, contentHeight) : null;
    };
    //主要获取 ListView 内容的滚动高度
    onScroll = (evt) => {
        let {onScroll} = this.props;
        this.state.l_contentOffset_y = Math.ceil(evt.nativeEvent.contentOffset.y);
        onScroll && onScroll instanceof Function ? onScroll(evt) : null;
    };

    render() {
        return (
            <View style={Styles.wrap}>
                <HeaderRefresh ref={(ref) => this._headerRefresh = ref} {...this.props}/>
                <FooterInfinite ref={(ref) => this._footerInfinite = ref} {...this.props}/>
                <Animated.View
                    style={[Styles.wrap, {transform: [{translateY: this.state.p_translateY}]}]} {...this._panResponder.panHandlers}>
                    <ListView
                        ref={(ref) => this._listView = ref}
                        style={{flex: 1}}
                        {...this.props}
                        onLayout={this.onLayout}
                        onContentSizeChange={this.onContentSizeChange}
                        onScroll={this.onScroll}/>
                </Animated.View>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    refresh: {
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#fe9d30'
    },
    loadMore: {
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#feafea'
    }
});