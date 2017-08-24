/**
 * Created by hebao on 2017/8/24.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    Image,
    View,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
    ActivityIndicator,
    PanResponder,
    Animated,
} from 'react-native';

/* list status change graph
 *
 * STATUS_NONE->[STATUS_REFRESH_IDLE, STATUS_INFINITE_IDLE, STATUS_INFINITE_LOADED_ALL]
 * STATUS_REFRESH_IDLE->[STATUS_NONE, STATUS_WILL_REFRESH]
 * STATUS_WILL_REFRESH->[STATUS_REFRESH_IDLE, STATUS_REFRESHING]
 * STATUS_REFRESHING->[STATUS_NONE]
 * STATUS_INFINITE_IDLE->[STATUS_NONE, STATUS_WILL_INFINITE]
 * STATUS_WILL_INFINITE->[STATUS_INFINITE_IDLE, STATUS_INFINITING]
 * STATUS_INFINITING->[STATUS_NONE]
 * STATUS_INFINITE_LOADED_ALL->[STATUS_NONE]
 *
 */
const
    STATUS_NONE = 0,
    STATUS_REFRESH_IDLE = 1,//pull down header, show introduction
    STATUS_WILL_REFRESH = 2,//when pull down can release to refresh, show introduction
    STATUS_REFRESHING = 3,//refreshing
    STATUS_INFINITE_IDLE = 4,
    STATUS_WILL_INFINITE = 5,
    STATUS_INFINITING = 6,
    STATUS_INFINITE_LOADED_ALL = 7;

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_PULL_DISTANCE = 60;
const DEFAULT_HF_HEIGHT = 50;

export default class RefreshList extends Component {
    _panResponder = null;//触摸响应句柄
    _listView = null;//ListView 实例

    scrollFromTop = true;//标记当前滑动方向

    contentHeight = 0;//标记加载完毕数据之后的ListView的长度
    height = 0;//标记加载数据之前的ListView的长度
    maxScrollY = 0;//标记刷新前后可供继续滚动的距离，计算为 contentHeight - height

    scrollY = 0;//用于标记下拉刷新，如果此值为0，则表明listView上滑到顶，继续下拉则触发下拉刷新
    isCanScroll = false;//用于标记是否整个ListView已经超出屏幕高度，如果超出屏幕高度，则isCanScroll为true，表明可以滚动

    footerIsRender = false;

    static propTypes = {
        footerHeight: PropTypes.number,
        pullDistance: PropTypes.number,
        renderEmptyRow: PropTypes.func,
        renderHeaderWaitToRefresh: PropTypes.func,
        renderHeaderWillRefresh: PropTypes.func,
        renderHeaderRefreshing: PropTypes.func,
        renderFooterWaitToInfinite: PropTypes.func,
        renderFooterWillInfinite: PropTypes.func,
        renderFooterInfiniting: PropTypes.func,
        renderFooterInfiniteAllDone: PropTypes.func,
        onRefresh: PropTypes.func,
        onInfinite: PropTypes.func,
    };

    static defaultProps = {
        footerHeight: DEFAULT_HF_HEIGHT,
        pullDistance: DEFAULT_PULL_DISTANCE,
        renderEmptyRow: () => null,
        //下拉刷新
        renderHeaderWaitToRefresh: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'下拉刷新'}</Text>
                </View>
            );
        },
        renderHeaderWillRefresh: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'释放以刷新'}</Text>
                </View>
            );
        },
        renderHeaderRefreshing: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'正在刷新...'}</Text>
                </View>
            );
        },

        //上拉加载更多
        renderFooterWaitToInfinite: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'上拉加载更多'}</Text>
                </View>
            );
        },
        renderFooterWillInfinite: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'释放以加载'}</Text>
                </View>
            );
        },
        renderFooterInfiniting: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'正在加载...'}</Text>
                </View>
            );
        },
        //上拉加载全部数据完毕
        renderFooterInfiniteAllDone: () => {
            return (
                <View style={Styles.refreshContainer}>
                    <Text style={Styles.refreshFont}>{'全部数据加载完毕'}</Text>
                </View>
            );
        },

        //数据加载标记位
        loadedAllData: () => false,
        onRefresh: () => null,
        onInfinite: () => null,
    };

    constructor(props) {
        super(props);
        this.state = {
            status: STATUS_NONE,
            translateY: new Animated.Value(0),//标记上下拉的拉动距离
            isScrollEnable: false,//ListView 是否正在滑动
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => !this.state.isScrollEnable,
            onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.isScrollEnable,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderRelease: this.handlePanResponderEnd,
            onPanResponderTerminate: this.handlePanResponderEnd,
        });
    }

    handlePanResponderMove = (e, gestureState) => {
        const offset = gestureState.dy;
        const {status} = this.state;
        let lastStatus = status;//记录最新状态值
        if (this.scrollY === 0) {//listView上滑到顶
            if (offset > 0 && status === STATUS_NONE) {//下拉刷新
                lastStatus = STATUS_REFRESH_IDLE;
                this.setState({status: STATUS_REFRESH_IDLE});
            }
            else if (offset < 0) {
                if (this.isCanScroll) {
                    this.scrollFromTop = true;
                }
                //todo:数据不满一页不需要上拉 这个 else if 可以全部删掉，目前仅用于测试
                else if (status === STATUS_NONE) {//数据未满一页，也允许上拉加载更多
                    if (!this.props.loadedAllData()) {//是否
                        lastStatus = STATUS_INFINITE_IDLE;
                        this.setState({status: STATUS_INFINITE_IDLE});
                    }
                    else {
                        lastStatus = STATUS_INFINITE_LOADED_ALL;
                        this.setState({status: STATUS_INFINITE_LOADED_ALL});
                    }
                }
            }
        }
        else if (this.isCanScroll && this.scrollY >= this.maxScrollY) {
            if (offset < 0 && status === STATUS_NONE) {
                if (!this.props.loadedAllData()) {
                    lastStatus = STATUS_INFINITE_IDLE;
                    this.setState({status: STATUS_INFINITE_IDLE});
                }
                else {
                    lastStatus = STATUS_INFINITE_LOADED_ALL;
                    this.setState({status: STATUS_INFINITE_LOADED_ALL});
                }
            }
            else if (offset > 0) {
                this.scrollFromTop = false;
            }
        }

        if (this.isCanScroll && lastStatus === STATUS_NONE) {
            if (this.scrollFromTop && offset < 0) {
                this._listView && this._listView.scrollTo({y: -offset, animated: true});
            }
            else if (!this.scrollFromTop && offset > 0) {
                this._listView && this._listView.scrollTo({y: this.maxScrollY - offset, animated: true});
            }
        }

        if (status === STATUS_REFRESH_IDLE || status === STATUS_WILL_REFRESH) {
            this.state.translateY.setValue(offset / 2);
            if (offset < this.props.pullDistance) {
                this.setState({status: STATUS_REFRESH_IDLE});
            }
            else if (offset > this.props.pullDistance) {
                this.setState({status: STATUS_WILL_REFRESH});
            }
        }
        else if (status === STATUS_INFINITE_IDLE || status === STATUS_WILL_INFINITE) {
            this.state.translateY.setValue(offset / 2);
            if (offset > -this.props.pullDistance - this.props.footerHeight) {
                this.setState({status: STATUS_INFINITE_IDLE});
            }
            else if (offset < -this.props.pullDistance - this.props.footerHeight) {
                this.setState({status: STATUS_WILL_INFINITE});
            }
        }
    };

    handlePanResponderEnd = (e, gestureState) => {
        const status = this.state.status;
        this.state.translateY.setValue(0);
        if (status === STATUS_REFRESH_IDLE) {
            this.setState({status: STATUS_NONE});
        }
        else if (status === STATUS_WILL_REFRESH) {
            this.setState({status: STATUS_REFRESHING}, () => {
                this.props.onRefresh instanceof Function && this.props.onRefresh();
            });
        }
        else if (status === STATUS_INFINITE_IDLE) {
            this.setState({status: STATUS_NONE});
        }
        else if (status === STATUS_WILL_INFINITE) {
            this.setState({status: STATUS_INFINITING}, () => {
                this.props.onInfinite instanceof Function && this.props.onInfinite();
            });
        }
        else if (status === STATUS_INFINITE_LOADED_ALL) {
            this.setState({status: STATUS_NONE});
        }
        if (this.scrollY > 0 && this.scrollY < (this.footerIsRender ? this.maxScrollY - this.props.footerHeight : this.maxScrollY)) {
            this.setState({isScrollEnable: true});
        }
    };

    renderRow = (rowData, sectionID, rowID) => {
        return this.props.renderRow(rowData, sectionID, rowID);
    };

    renderRefreshHeader() {
        const status = this.state.status;
        if (status === STATUS_REFRESH_IDLE) {
            return this.props.renderHeaderWaitToRefresh();
        }
        if (status === STATUS_WILL_REFRESH) {
            return this.props.renderHeaderWillRefresh();
        }
        if (status === STATUS_REFRESHING) {
            return this.props.renderHeaderRefreshing();
        }
        return null;
    }

    renderLoadMoreFooter() {
        if (this.isCanScroll) {
            const status = this.state.status;
            this.footerIsRender = true;
            if (status === STATUS_INFINITE_IDLE) {
                return this.props.renderFooterWaitToInfinite();
            }
            if (status === STATUS_WILL_INFINITE) {
                return this.props.renderFooterWillInfinite();
            }
            if (status === STATUS_INFINITING) {
                return this.props.renderFooterInfiniting();
            }
            if (status === STATUS_INFINITE_LOADED_ALL) {
                return this.props.renderFooterInfiniteAllDone();
            }
            this.footerIsRender = false;
        }
        return null;
    }

    hideHeader() {
        this.setState({status: STATUS_NONE});
    }

    hideFooter() {
        this.setState({status: STATUS_NONE});
    }

    onLayout = (e) => {
        this.height = e.nativeEvent.layout.height;
        this.isCanScroll = this.contentHeight > this.height;
        this.maxScrollY = Math.floor(this.contentHeight - this.height);
    };

    onContentSizeChange = (contentWidth, contentHeight) => {
        this.contentHeight = contentHeight;
        this.isCanScroll = this.contentHeight > this.height;
        this.maxScrollY = Math.floor(this.contentHeight - this.height);
    };

    isScrolledToTop = () => {
        if ((this.scrollY === 0 || this.scrollY === this.maxScrollY) && this.state.isScrollEnable) {
            this.setState({isScrollEnable: false});
        }
    };

    handleScroll = (event) => {
        this.scrollY = Math.floor(event.nativeEvent.contentOffset.y);
    };

    render() {
        const {translateY, isScrollEnable} = this.state;
        return (
            <Animated.View style={{flex: 1, transform: [{translateY}]}} {...this._panResponder.panHandlers}>
                {this.renderRefreshHeader()}
                <ListView
                    {...this.props}
                    ref={(ref) => this._listView = ref}
                    dataSource={this.props.dataSource}
                    renderRow={this.renderRow}
                    scrollEnabled={isScrollEnable}
                    onLayout={this.onLayout}
                    onContentSizeChange={this.onContentSizeChange}
                    onScroll={this.handleScroll}
                    onTouchEnd={() => this.isScrolledToTop()}
                    onScrollEndDrag={() => this.isScrolledToTop()}
                    onMomentumScrollEnd={() => this.isScrolledToTop()}
                    onResponderRelease={() => this.isScrolledToTop()}/>
                {this.renderLoadMoreFooter()}
            </Animated.View>
        );
    }
}

const Styles = StyleSheet.create({
    refreshContainer: {
        width: SCREEN_WIDTH,
        height: DEFAULT_HF_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshFont: {
        color: '#eaeaea',
        fontSize: 16
    },
});