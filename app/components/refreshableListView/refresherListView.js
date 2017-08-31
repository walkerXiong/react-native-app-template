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
    PixelRatio
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEVICE_PIXEL_RATIO = PixelRatio.get();

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
    static defaultProps = {
        renderHeaderRefresh: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            gestureStatus: G_STATUS_NONE,
            aniTranslateY: new Animated.Value(-G_PULL_DOWN_DISTANCE)
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.gestureStatus !== this.state.gestureStatus;
    }

    _setGestureStatus(gestureStatus) {
        this.setState({gestureStatus});
    }

    _setAniTranslateY(translateY) {
        this.state.aniTranslateY.setValue(translateY - G_PULL_DOWN_DISTANCE);
    }

    _getAniTranslateY() {
        return this.state.aniTranslateY;
    }

    render() {
        let {gestureStatus} = this.state;
        return (
            <Animated.View
                style={[Styles.refresh, {
                    height: G_PULL_DOWN_DISTANCE,
                    transform: [{translateY: this.state.aniTranslateY}]
                }]}>
                {this.props.renderHeaderRefresh(gestureStatus)}
            </Animated.View>
        );
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

export default class RefresherListView extends Component {
    _panResponder = null;//触摸响应句柄
    _listView = null;// ListView 实例
    _headerRefresh = null;//顶部刷新组件实例
    _footerInfinite = null;//上拉加载更多组件实例


    static propTypes = {
        enableHeaderRefresh: PropTypes.bool,
        renderHeaderRefresh: PropTypes.func,
        setHeaderHeight: PropTypes.number,
        setHeaderGapToRefresh: PropTypes.number,

        enableFooterInfinite: PropTypes.bool,
        renderFooterInfinite: PropTypes.func,
        setFooterHeight: PropTypes.number,
        setFooterGapToInfinite: PropTypes.number
    };

    static defaultProps = {
        enableHeaderRefresh: false,
        renderHeaderRefresh: _renderHeaderRefresh,
        setHeaderHeight: G_PULL_DOWN_DISTANCE,
        setHeaderGapToRefresh: G_PILL_DOWN_FIX_DISTANCE,

        enableFooterInfinite: true,
        renderFooterInfinite: _renderFooterInfinite,
        setFooterHeight: G_PULL_UP_DISTANCE,
        setFooterGapToInfinite: G_PILL_UP_FIX_DISTANCE
    };

    static headerRefreshDone = () => null;
    static footerInfiniteDone = () => null;

    _headerRefreshDone = () => {
        let _headerAniTranslateY = this._headerRefresh._getAniTranslateY();
        Animated.parallel([
            Animated.timing(this.state.p_translateY, {
                toValue: 0,
                duration: 100
            }),
            Animated.timing(_headerAniTranslateY, {
                toValue: -G_PULL_DOWN_DISTANCE,
                duration: 100
            }),
        ]).start(() => {
            this.state.p_currPullDistance = 0;
            if (this.state.gestureStatus !== G_STATUS_NONE) {
                this.state.gestureStatus = G_STATUS_NONE;
                this._headerRefresh._setGestureStatus(this.state.gestureStatus);
            }
        });
    };

    _footerInfiniteDone = () => {
        let _footerAniTranslateY = this._footerInfinite._getAniTranslateY();
        Animated.parallel([
            Animated.timing(this.state.p_translateY, {
                toValue: 0,
                duration: 100
            }),
            Animated.timing(_footerAniTranslateY, {
                toValue: G_PULL_UP_DISTANCE,
                duration: 100
            }),
        ]).start(() => {
            this.state.p_currPullDistance = 0;
            let {offset} = this._listView.scrollProperties;
            this._listView.scrollTo({x: 0, y: offset + G_PULL_UP_DISTANCE, animated: false});
            if (this.state.gestureStatus !== G_STATUS_NONE) {
                this.state.gestureStatus = G_STATUS_NONE;
                this._footerInfinite._setGestureStatus(this.state.gestureStatus);
            }
        });
    };

    constructor(props) {
        super(props);
        G_PULL_DOWN_DISTANCE = props.setHeaderHeight;
        G_PILL_DOWN_FIX_DISTANCE = props.setHeaderGapToRefresh;
        G_PULL_UP_DISTANCE = props.setFooterHeight;
        G_PILL_UP_FIX_DISTANCE = props.setFooterGapToInfinite;
        this.state = {
            //当前手势状态
            gestureStatus: G_STATUS_NONE,
            //以下为处理 ListView 所需参数
            l_onTopReached_down: false,// 滚动到顶部向下拉
            l_onTopReached_up: false,// 滚动到顶部向上拉

            l_onEndReached_up: false,// 滚动到底部向上拉
            l_onEndReached_down: false,// 滚动到底部向下拉

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
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderEnd: this.onPanResponderEnd,
        });
    }

    onMoveShouldSetPanResponderCapture = (evt, gestureState) => {
        this.state.l_onTopReached_down = this.state.l_onTopReached_up = this.state.l_onEndReached_up = this.state.l_onEndReached_down = false;

        let {offset, contentLength, visibleLength} = this._listView.scrollProperties;
        let {gestureStatus} = this.state;
        let _pullDown = gestureState.dy > 0 && gestureState.vy > 0;
        let _pullUp = gestureState.dy < 0 && gestureState.vy < 0;

        if (contentLength <= visibleLength) {
            //到顶部以及底部
            if (_pullDown) {//下拉
                this.state.l_onTopReached_down = this.state.p_currPullDistance === 0 && gestureStatus !== G_STATUS_FOOTER_REFRESHING;
                this.state.l_onEndReached_down = this.state.p_currPullDistance !== 0 && gestureStatus !== G_STATUS_HEADER_REFRESHING;
            }
            else if (_pullUp) {//上拉
                this.state.l_onTopReached_up = this.state.p_currPullDistance !== 0 && gestureStatus !== G_STATUS_FOOTER_REFRESHING;
                this.state.l_onEndReached_up = this.state.p_currPullDistance === 0 && gestureStatus !== G_STATUS_HEADER_REFRESHING;
            }
        }
        else {
            //到顶部
            if (offset <= 1 / DEVICE_PIXEL_RATIO) {
                if (_pullDown) {//下拉
                    this.state.l_onTopReached_down = this.state.p_currPullDistance === 0 && gestureStatus !== G_STATUS_FOOTER_REFRESHING;
                }
                else if (_pullUp) {//上拉
                    this.state.l_onTopReached_up = this.state.p_currPullDistance !== 0 && gestureStatus !== G_STATUS_FOOTER_REFRESHING;
                }
            }
            //到底部
            else if (Math.ceil(offset) >= Math.floor(contentLength) - Math.ceil(visibleLength)) {
                if (_pullDown) {//下拉
                    this.state.l_onEndReached_down = this.state.p_currPullDistance !== 0 && gestureStatus !== G_STATUS_HEADER_REFRESHING;
                }
                else if (_pullUp) {//上拉
                    this.state.l_onEndReached_up = this.state.p_currPullDistance === 0 && gestureStatus !== G_STATUS_HEADER_REFRESHING;
                }
            }
        }

        return (this.props.enableHeaderRefresh && (this.state.l_onTopReached_down || this.state.l_onTopReached_up)) || (this.props.enableFooterInfinite && (this.state.l_onEndReached_up || this.state.l_onEndReached_down));
    };
    onPanResponderMove = (evt, gestureState) => {
        let _translateY = Math.ceil(Math.abs(gestureState.dy));
        //下拉刷新
        if (this.state.l_onTopReached_down && gestureState.dy > 0) {
            this.state.p_currPullDistance = _translateY >= G_PULL_DOWN_DISTANCE ? G_PULL_DOWN_DISTANCE : _translateY;
            this.state.p_translateY.setValue(this.state.p_currPullDistance);
            this._headerRefresh._setAniTranslateY(this.state.p_currPullDistance);

            if (this.state.gestureStatus !== G_STATUS_HEADER_REFRESHING) {
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
        }
        //上拉隐藏刷新面板
        else if (this.state.l_onTopReached_up && gestureState.dy < 0) {
            let _headerAniTranslateY = this._headerRefresh._getAniTranslateY();
            Animated.parallel([
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }),
                Animated.timing(_headerAniTranslateY, {
                    toValue: -G_PULL_DOWN_DISTANCE,
                    duration: 100
                }),
            ]).start(() => this.state.p_currPullDistance = 0);
        }
        //上拉加载更多
        else if (this.state.l_onEndReached_up && gestureState.dy < 0) {
            this.state.p_currPullDistance = _translateY >= G_PULL_UP_DISTANCE ? G_PULL_UP_DISTANCE : _translateY;
            this.state.p_translateY.setValue(-this.state.p_currPullDistance);
            this._footerInfinite._setAniTranslateY(this.state.p_currPullDistance);

            if (this.state.gestureStatus !== G_STATUS_FOOTER_REFRESHING) {
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
        }
        //下拉隐藏加载更多面板
        else if (this.state.l_onEndReached_down && gestureState.dy > 0) {
            let _footerAniTranslateY = this._footerInfinite._getAniTranslateY();
            Animated.parallel([
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }),
                Animated.timing(_footerAniTranslateY, {
                    toValue: G_PULL_UP_DISTANCE,
                    duration: 100
                }),
            ]).start(() => this.state.p_currPullDistance = 0);
        }
    };
    onPanResponderEnd = () => {
        //下拉刷新
        if (this.state.l_onTopReached_down) {
            if (this.state.p_currPullDistance < G_PULL_DOWN_DISTANCE - G_PILL_DOWN_FIX_DISTANCE) {
                let _headerAniTranslateY = this._headerRefresh._getAniTranslateY();
                Animated.parallel([
                    Animated.timing(this.state.p_translateY, {
                        toValue: 0,
                        duration: 100
                    }),
                    Animated.timing(_headerAniTranslateY, {
                        toValue: -G_PULL_DOWN_DISTANCE,
                        duration: 100
                    }),
                ]).start(() => this.state.p_currPullDistance = 0);
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_HEADER_REFRESHING) {
                    this.state.gestureStatus = G_STATUS_HEADER_REFRESHING;
                    this._headerRefresh._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
        //上拉隐藏刷新面板
        else if (this.state.l_onTopReached_up) {
            let _headerAniTranslateY = this._headerRefresh._getAniTranslateY();
            Animated.parallel([
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }),
                Animated.timing(_headerAniTranslateY, {
                    toValue: -G_PULL_DOWN_DISTANCE,
                    duration: 100
                }),
            ]).start(() => this.state.p_currPullDistance = 0);
        }
        //上拉加载更多
        else if (this.state.l_onEndReached_up) {
            if (this.state.p_currPullDistance < G_PULL_UP_DISTANCE - G_PILL_UP_FIX_DISTANCE) {
                let _footerAniTranslateY = this._footerInfinite._getAniTranslateY();
                Animated.parallel([
                    Animated.timing(this.state.p_translateY, {
                        toValue: 0,
                        duration: 100
                    }),
                    Animated.timing(_footerAniTranslateY, {
                        toValue: G_PULL_UP_DISTANCE,
                        duration: 100
                    }),
                ]).start(() => this.state.p_currPullDistance = 0);
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_FOOTER_REFRESHING) {
                    this.state.gestureStatus = G_STATUS_FOOTER_REFRESHING;
                    this._footerInfinite._setGestureStatus(this.state.gestureStatus);
                }
            }
        }
        //下拉隐藏加载更多面板
        else if (this.state.l_onEndReached_down) {
            let _footerAniTranslateY = this._footerInfinite._getAniTranslateY();
            Animated.parallel([
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }),
                Animated.timing(_footerAniTranslateY, {
                    toValue: G_PULL_UP_DISTANCE,
                    duration: 100
                }),
            ]).start(() => this.state.p_currPullDistance = 0);
        }
    };

    render() {
        return (
            <View style={Styles.wrap}>
                <HeaderRefresh ref={(ref) => this._headerRefresh = ref} {...this.props}/>
                <FooterInfinite ref={(ref) => this._footerInfinite = ref} {...this.props}/>
                <Animated.View
                    style={[Styles.wrap, {transform: [{translateY: this.state.p_translateY}]}]} {...this._panResponder.panHandlers}>
                    <ListView
                        style={{flex: 1}}
                        ref={(ref) => this._listView = ref}
                        {...this.props}/>
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