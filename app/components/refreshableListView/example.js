/**
 * Created by hebao on 2017/8/24.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
    TouchableHighlight,
    ActivityIndicator
}  from 'react-native';
import RefresherListView from './refresherListView';
import LinearGradient from 'react-native-linear-gradient';
import HBStyle from '../../styles/standard';
import Util from '../../utility/util';

class FooterInfinite extends Component {
    static defaultProps = {
        gestureStatus: 1
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {gestureStatus} = this.props, _refreshFont = '';
        switch (gestureStatus) {
            case 1:
                _refreshFont = '上拉加载更多...';
                break;
            case 3:
                _refreshFont = '松开加载更多...';
                break;
            case 5:
                _refreshFont = '加载中...';
                break;
            default:
                _refreshFont = '上拉加载更多...';
        }
        return (
            <View style={Styles.footerInfinite}>
                {gestureStatus === 5 ?
                    <ActivityIndicator
                        size={'large'}
                        animating={true}
                        color={'#75c5fe'}
                        style={{marginRight: 20}}/> : null}
                <Text style={Styles.refreshFont}>{_refreshFont}</Text>
            </View>
        );
    }
}

class HeaderRefresh extends Component {
    static defaultProps = {
        gestureStatus: 2
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {gestureStatus} = this.props, _refreshFont = '';
        switch (gestureStatus) {
            case 2:
                _refreshFont = '下拉刷新...';
                break;
            case 3:
                _refreshFont = '释放刷新...';
                break;
            case 4:
                _refreshFont = '正在刷新...';
                break;
            default:
                _refreshFont = '下拉刷新...';
        }
        return (
            <View style={Styles.headerRefresh}>
                {gestureStatus === 4 ?
                    <ActivityIndicator
                        size={'large'}
                        animating={true}
                        color={'#75c5fe'}
                        style={{marginRight: 20}}/> : null}
                <Text style={Styles.refreshFont}>{_refreshFont}</Text>
            </View>
        );
    }
}

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class Example extends Component {
    _timer = -1;
    data = ['row1', 'row2', 'row3', 'row1', 'row2', 'row3', 'row1', 'row2', 'row3', 'row1', 'row2', 'row3'];

    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows(this.data),
        }
    }

    getData(init) {
        let total = 15;
        if (init) {
            this.data = [];
            total = Math.ceil(Math.random() * 10);
        }
        for (let i = 0; i < total; i++) {
            this.data.push('row' + Math.ceil(Math.random() * 5));
        }
    }

    renderRow = (rowData, sectionID, rowID) => {
        let {dataSource, isShow} = this.state;
        let _length = dataSource.getRowCount();
        return (
            <View style={Styles.commonColumnSS}>
                <View style={Styles.listItem}>
                    <View style={Styles.commonColumnSS}>
                        <View style={Styles.itemWrap}>
                            <Text style={Styles.font_3}>{'name'}</Text>
                            <Text style={Styles.font_2}>{'融资金额(元)'}</Text>
                        </View>
                        <View style={[Styles.itemWrap, {marginTop: 11}]}>
                            <LinearGradient
                                start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                                colors={[HBStyle.color.common_green_status, HBStyle.color.common_green_item_bg, HBStyle.color.common_green_item_bg]}
                                locations={[0.3, 0.3 + 0.001, 1]}
                                style={Styles.itemProgressWrap}>
                                <Text style={Styles.font_5}>
                                    {'正常还款中'}
                                </Text>
                            </LinearGradient>
                            <Text style={Styles.font_4}>{'1000'}</Text>
                        </View>
                    </View>
                </View>
                {rowID < _length - 1 ? <View style={[Styles.divideLine, {marginLeft: 16}]}/> : null}
            </View>
        );
    };

    renderHeaderRefresh = (gestureStatus) => {
        window.console.log('xq debug===renderHeaderRefresh===gestureStatus:' + gestureStatus);
        if (gestureStatus === 4) {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this.getData(true);
                this.setState({
                    dataSource: ds.cloneWithRows(this.data)
                }, () => {
                    RefresherListView.headerRefreshDone();
                });
            }, 1000);
        }
        return <HeaderRefresh gestureStatus={gestureStatus}/>;
    };

    renderFooterInfinite = (gestureStatus) => {
        window.console.log('xq debug===renderFooterInfinite===gestureStatus:' + gestureStatus);
        if (gestureStatus === 5) {
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this.getData();
                this.setState({
                    dataSource: ds.cloneWithRows(this.data)
                }, () => {
                    RefresherListView.footerInfiniteDone();
                });
            }, 1000);
        }
        return <FooterInfinite gestureStatus={gestureStatus}/>
    };

    render() {
        return (
            <View style={Styles.wrap}>
                <View style={{height: 44, width: Dimensions.get('window').width, backgroundColor: '#142124'}}/>
                <RefresherListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    showsVerticalScrollIndicator={false}
                    enableHeaderRefresh={true}
                    setHeaderHeight={80}
                    setHeaderGapToRefresh={8}
                    renderHeaderRefresh={this.renderHeaderRefresh}
                    enableFooterInfinite={true}
                    setFooterHeight={60}
                    setfootergaptoinfinite={8}
                    renderFooterInfinite={this.renderFooterInfinite}/>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: HBStyle.color.gray_bg
    },
    commonRowSC: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commonColumnSS: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    protocolWrap: {
        width: Util.size.screen.width,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: HBStyle.color.wwhite,
        marginTop: 15,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: HBStyle.color.common_gray_line
    },
    protocol: {
        width: Util.size.screen.width,
        height: 44,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    font_1: {
        fontSize: 16,
        color: HBStyle.color.text_black_w
    },
    font_2: {
        fontSize: 14,
        color: HBStyle.color.text_gray_w_main
    },
    font_3: {
        fontSize: 15,
        color: HBStyle.color.text_black_w
    },
    font_4: {
        fontSize: 14,
        color: HBStyle.color.text_red_w
    },
    font_5: {
        fontSize: 12,
        color: HBStyle.color.text_white_w
    },
    font_creditor: {
        fontSize: 16,
        color: HBStyle.color.text_black_w,
        marginTop: 15,
    },
    font_creditorDetail: {
        fontSize: 15,
        color: HBStyle.color.text_gray_w_main,
        marginTop: 20,
    },
    retractFont: {
        fontSize: 15,
        color: HBStyle.color.text_white_w,
    },
    divideLine: {
        width: Util.size.screen.width,
        height: 0.5,
        backgroundColor: HBStyle.color.common_gray_line,
    },
    iconNext: {
        width: 7,
        height: 13
    },
    creditorWrap: {
        width: Util.size.screen.width,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: HBStyle.color.wwhite,
        marginTop: 15,
        paddingLeft: 16,
        paddingRight: 14,
        borderTopWidth: 0.5,
        borderTopColor: HBStyle.color.common_gray_line
    },
    listViewWrap: {
        flex: 1,
        width: Util.size.screen.width,
        backgroundColor: HBStyle.color.gray_bg
    },
    listItem: {
        width: Util.size.screen.width,
        backgroundColor: HBStyle.color.wwhite,
        paddingVertical: 16,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    itemWrap: {
        width: Util.size.screen.width,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemProgressWrap: {
        width: 126,
        height: 20,
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7 * Util.size.screen.pixelRatio,
    },
    endLoadMore: {
        width: Util.size.screen.width,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: HBStyle.color.gray_bg
    },
    loadMoreFont: {
        fontSize: 12,
        color: HBStyle.color.text_gray_w_main
    },
    headerRefresh: {
        width: Dimensions.get('window').width,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerInfinite: {
        width: Dimensions.get('window').width,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshFont: {
        fontSize: 16,
        color: '#b84f35'
    }
});