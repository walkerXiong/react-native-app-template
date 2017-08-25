/**
 * Created by hebao on 2017/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    ListView,
    Dimensions,
    Text,
    TouchableHighlight,
    Image,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DirectText from '../../components/DirectText';
import HBStyle from '../../styles/style.android';
import Util from '../../utility/util';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const responseData = {
    rows: [
        {
            "RepaymentDate": "0001-01-01T00:00:00+08:00",
            "ProjectSubType": 0,
            "FinancerType": 0,
            "Period": 3,
            "CurrentPeriod": 1,
            "ClearingForm": 3,
            "RepaymentType": 0,
            "IncomeRate": 12.88,
            "SurplusDay": 57,
            "AllDays": 92,
            "Investmented": false,
            "InvestAmount": 0.0,
            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
            "ScoreList": [{
                "ScoreType": 1,
                "Score": 90,
                "FullScore": 100
            }, {
                "ScoreType": 2,
                "Score": 87,
                "FullScore": 100
            }, {
                "ScoreType": 3,
                "Score": 109,
                "FullScore": 120
            }, {
                "ScoreType": 4,
                "Score": 209,
                "FullScore": 240
            }, {
                "ScoreType": 5,
                "Score": 106,
                "FullScore": 120
            }],
            "ProjectStatus": 3,
            "ProjectId": 12,
            "ProjectNo": null,
            "ProjectName": "小荷包贷I1898V",
            "ProjectType": 4,
            "FinancingAmount": 1000.00,
            "AlreadyFinancing": 0.0,
            "BaseType": 1
        },
        {
            "RepaymentDate": "0001-01-01T00:00:00+08:00",
            "ProjectSubType": 0,
            "FinancerType": 0,
            "Period": 3,
            "CurrentPeriod": 1,
            "ClearingForm": 3,
            "RepaymentType": 0,
            "IncomeRate": 12.88,
            "SurplusDay": 57,
            "AllDays": 92,
            "Investmented": false,
            "InvestAmount": 0.0,
            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
            "ScoreList": [{
                "ScoreType": 1,
                "Score": 90,
                "FullScore": 100
            }, {
                "ScoreType": 2,
                "Score": 87,
                "FullScore": 100
            }, {
                "ScoreType": 3,
                "Score": 109,
                "FullScore": 120
            }, {
                "ScoreType": 4,
                "Score": 209,
                "FullScore": 240
            }, {
                "ScoreType": 5,
                "Score": 106,
                "FullScore": 120
            }],
            "ProjectStatus": 3,
            "ProjectId": 12,
            "ProjectNo": null,
            "ProjectName": "小荷包贷I1898V",
            "ProjectType": 4,
            "FinancingAmount": 1000.00,
            "AlreadyFinancing": 0.0,
            "BaseType": 1
        },
        {
            "RepaymentDate": "0001-01-01T00:00:00+08:00",
            "ProjectSubType": 0,
            "FinancerType": 0,
            "Period": 3,
            "CurrentPeriod": 1,
            "ClearingForm": 3,
            "RepaymentType": 0,
            "IncomeRate": 12.88,
            "SurplusDay": 57,
            "AllDays": 92,
            "Investmented": false,
            "InvestAmount": 0.0,
            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
            "ScoreList": [{
                "ScoreType": 1,
                "Score": 90,
                "FullScore": 100
            }, {
                "ScoreType": 2,
                "Score": 87,
                "FullScore": 100
            }, {
                "ScoreType": 3,
                "Score": 109,
                "FullScore": 120
            }, {
                "ScoreType": 4,
                "Score": 209,
                "FullScore": 240
            }, {
                "ScoreType": 5,
                "Score": 106,
                "FullScore": 120
            }],
            "ProjectStatus": 3,
            "ProjectId": 12,
            "ProjectNo": null,
            "ProjectName": "小荷包贷I1898V",
            "ProjectType": 4,
            "FinancingAmount": 1000.00,
            "AlreadyFinancing": 0.0,
            "BaseType": 1
        },
        {
            "RepaymentDate": "0001-01-01T00:00:00+08:00",
            "ProjectSubType": 0,
            "FinancerType": 0,
            "Period": 3,
            "CurrentPeriod": 1,
            "ClearingForm": 3,
            "RepaymentType": 0,
            "IncomeRate": 12.88,
            "SurplusDay": 57,
            "AllDays": 92,
            "Investmented": false,
            "InvestAmount": 0.0,
            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
            "ScoreList": [{
                "ScoreType": 1,
                "Score": 90,
                "FullScore": 100
            }, {
                "ScoreType": 2,
                "Score": 87,
                "FullScore": 100
            }, {
                "ScoreType": 3,
                "Score": 109,
                "FullScore": 120
            }, {
                "ScoreType": 4,
                "Score": 209,
                "FullScore": 240
            }, {
                "ScoreType": 5,
                "Score": 106,
                "FullScore": 120
            }],
            "ProjectStatus": 3,
            "ProjectId": 12,
            "ProjectNo": null,
            "ProjectName": "小荷包贷I1898V",
            "ProjectType": 4,
            "FinancingAmount": 1000.00,
            "AlreadyFinancing": 0.0,
            "BaseType": 1
        },
        {
            "RepaymentDate": "0001-01-01T00:00:00+08:00",
            "ProjectSubType": 0,
            "FinancerType": 0,
            "Period": 3,
            "CurrentPeriod": 1,
            "ClearingForm": 3,
            "RepaymentType": 0,
            "IncomeRate": 12.88,
            "SurplusDay": 57,
            "AllDays": 92,
            "Investmented": false,
            "InvestAmount": 0.0,
            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
            "ScoreList": [{
                "ScoreType": 1,
                "Score": 90,
                "FullScore": 100
            }, {
                "ScoreType": 2,
                "Score": 87,
                "FullScore": 100
            }, {
                "ScoreType": 3,
                "Score": 109,
                "FullScore": 120
            }, {
                "ScoreType": 4,
                "Score": 209,
                "FullScore": 240
            }, {
                "ScoreType": 5,
                "Score": 106,
                "FullScore": 120
            }],
            "ProjectStatus": 3,
            "ProjectId": 12,
            "ProjectNo": null,
            "ProjectName": "小荷包贷I1898V",
            "ProjectType": 4,
            "FinancingAmount": 1000.00,
            "AlreadyFinancing": 0.0,
            "BaseType": 1
        },
    ]
};
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const
    G_STATUS_NONE = 0,// 正常手势，没有上拉或者下拉刷新
    G_STATUS_PULLING_UP = 1,// ListView 处于底部，上拉加载更多
    G_STATUS_PULLING_DOWN = 2,// ListView 处于顶部，下拉刷新
    G_STATUS_RELEASE_TO_REFRESH = 3,// 拉动距离处于可触发刷新或者加载状态
    G_STATUS_REFRESHING = 4;// 正在刷新中

const
    G_PULL_UP_DISTANCE = 50,
    G_PULL_CLAMP_DISTANCE = 8,
    G_PULL_DOWN_DISTANCE = 30;

class Creditor extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={Styles.creditorWrap}>
                <Text style={Styles.font_creditor}>{'可能匹配到的债权'}</Text>
                <Text style={Styles.font_creditorDetail}>{'可能匹配到的债权说明可能匹配到的债权说明可能匹配到的债权说明'}</Text>
                <View style={[Styles.divideLine, {marginTop: 18}]}/>
            </View>
        );
    }
}

class Protocol extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={Styles.protocolWrap}>
                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={HBStyle.color.common_gray_press}
                    onPress={() => null}>
                    <View style={Styles.protocol}>
                        <Text style={Styles.font_1}>{'协议模版'}</Text>
                        <Image style={Styles.iconNext} resizeMode={'contain'} source={{uri: 'common_btn_vector'}}/>
                    </View>
                </TouchableHighlight>
                <View style={[Styles.divideLine, {marginLeft: 16}]}/>
                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={HBStyle.color.common_gray_press}
                    onPress={() => null}>
                    <View style={Styles.protocol}>
                        <Text style={Styles.font_1}>{'多重保障'}</Text>
                        <View style={Styles.commonRowSC}>
                            <Text style={[Styles.font_2, {marginRight: 11}]}>{'适用于千万风险预备金计划'}</Text>
                            <Image style={Styles.iconNext} resizeMode={'contain'} source={{uri: 'common_btn_vector'}}/>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

class PageHeader extends Component {
    render() {
        return (
            <View style={Styles.wrap}>
                <Protocol />
                <Creditor />
            </View>
        );
    }
}

export default class RefresherListView extends Component {
    _panResponder = null;//触摸响应句柄
    _directText = null;// 刷新文字 实例

    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows(responseData.rows),
            //当前手势状态
            gestureStatus: G_STATUS_NONE,
            //以下为处理 ListView 所需参数
            l_layout_height: 0,// ListView 的组件高度
            l_contentHeight: 0,// ListView 的内容高度
            l_contentOffset_y: 0,// ListView 的滚动高度

            //以下为 PullUpDown 所需参数
            p_translateY: new Animated.Value(0),// ListView 上拉时候的位移距离，用于展现刷新指示组件
            p_currPullDistance: 0,// ListView 当前上拉或下拉的距离
            p_directTextStatus: 0,// 上拉或下拉文案状态，避免频繁 render 0:上拉刷新 1:释放刷新 2:正在刷新

        }
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
        let _onEndReached = l_contentOffset_y >= l_contentHeight - l_layout_height;
        let _validDy = gestureState.dy < 0;
        let _validVy = gestureState.vy < 0;
        //window.console.log('debug keyword: onMoveShouldSetPanResponderCapture===call order 1===gestureState.dy:' + gestureState.dy + ';gestureState.vy:' + gestureState.vy);
        return _onEndReached && _validDy && _validVy;
    };

    handlePanResponderMove = (evt, gestureState) => {
        window.console.log('debug keyword: handlePanResponderMove === call order 5.');
        if (gestureState.dy < 0) {
            let _translateY = Math.ceil(Math.abs(gestureState.dy));
            this.state.p_translateY.setValue(_translateY >= G_PULL_UP_DISTANCE ? -G_PULL_UP_DISTANCE : -_translateY);
            this.state.p_currPullDistance = _translateY >= G_PULL_UP_DISTANCE ? G_PULL_UP_DISTANCE : _translateY;

            if (this.state.p_currPullDistance >= G_PULL_UP_DISTANCE - G_PULL_CLAMP_DISTANCE) {
                if (this.state.gestureStatus !== G_STATUS_RELEASE_TO_REFRESH) {
                    this.state.gestureStatus = G_STATUS_RELEASE_TO_REFRESH;
                    this._directText.setText('松开即可加载更多...');
                }
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_PULLING_UP) {
                    this.state.gestureStatus = G_STATUS_PULLING_UP;
                    this._directText.setText('上拉即可加载更多...');
                }
            }
        }
    };
    onPanResponderEnd = () => {
        window.console.log('debug keyword: onPanResponderEnd === call order 6.');
        if (this.state.p_currPullDistance < G_PULL_UP_DISTANCE && this.state.p_currPullDistance < G_PULL_UP_DISTANCE - G_PULL_CLAMP_DISTANCE) {
            this.state.p_currPullDistance = 0;
            Animated.timing(this.state.p_translateY, {
                toValue: 0,
                duration: 100
            }).start();
        }
        else {
            if (this.state.gestureStatus !== G_STATUS_REFRESHING) {
                this.state.gestureStatus = G_STATUS_REFRESHING;
                this._directText.setText('正在加载...');

                //todo 拉取新数据
                for (let i = 0, j = 10; i < j; i++) {
                    responseData.rows.push({
                        "RepaymentDate": "0001-01-01T00:00:00+08:00",
                        "ProjectSubType": 0,
                        "FinancerType": 0,
                        "Period": 3,
                        "CurrentPeriod": 1,
                        "ClearingForm": 3,
                        "RepaymentType": 0,
                        "IncomeRate": 12.88,
                        "SurplusDay": 57,
                        "AllDays": 92,
                        "Investmented": false,
                        "InvestAmount": 0.0,
                        "BiddingStartTime": "0001-01-01T00:00:00+08:00",
                        "BiddingDeadline": "0001-01-01T00:00:00+08:00",
                        "ScoreList": [{
                            "ScoreType": 1,
                            "Score": 90,
                            "FullScore": 100
                        }, {
                            "ScoreType": 2,
                            "Score": 87,
                            "FullScore": 100
                        }, {
                            "ScoreType": 3,
                            "Score": 109,
                            "FullScore": 120
                        }, {
                            "ScoreType": 4,
                            "Score": 209,
                            "FullScore": 240
                        }, {
                            "ScoreType": 5,
                            "Score": 106,
                            "FullScore": 120
                        }],
                        "ProjectStatus": 3,
                        "ProjectId": 12,
                        "ProjectNo": null,
                        "ProjectName": "小荷包贷I" + Math.ceil(Math.random() * 1000) + "V",
                        "ProjectType": 4,
                        "FinancingAmount": 1000.00,
                        "AlreadyFinancing": 0.0,
                        "BaseType": 1
                    });
                }
                setTimeout(() => {
                    this.state.p_currPullDistance = 0;
                    this.state.p_translateY.setValue(0);
                    this.setState({
                        dataSource: ds.cloneWithRows(responseData.rows)
                    });
                }, 2000);
            }
        }
    };
    onPanResponderRelease = () => {
        window.console.log('debug keyword: onPanResponderRelease === call order 7.');
        if (this.state.p_currPullDistance !== 0) {
            if (this.state.p_currPullDistance < G_PULL_UP_DISTANCE && this.state.p_currPullDistance < G_PULL_UP_DISTANCE - G_PULL_CLAMP_DISTANCE) {
                this.state.p_currPullDistance = 0;
                Animated.timing(this.state.p_translateY, {
                    toValue: 0,
                    duration: 100
                }).start();
            }
            else {
                if (this.state.gestureStatus !== G_STATUS_REFRESHING) {
                    this.state.gestureStatus = G_STATUS_REFRESHING;
                    this._directText.setText('正在加载...');

                    //todo 拉取新数据
                    for (let i = 0, j = 10; i < j; i++) {
                        responseData.rows.push({
                            "RepaymentDate": "0001-01-01T00:00:00+08:00",
                            "ProjectSubType": 0,
                            "FinancerType": 0,
                            "Period": 3,
                            "CurrentPeriod": 1,
                            "ClearingForm": 3,
                            "RepaymentType": 0,
                            "IncomeRate": 12.88,
                            "SurplusDay": 57,
                            "AllDays": 92,
                            "Investmented": false,
                            "InvestAmount": 0.0,
                            "BiddingStartTime": "0001-01-01T00:00:00+08:00",
                            "BiddingDeadline": "0001-01-01T00:00:00+08:00",
                            "ScoreList": [{
                                "ScoreType": 1,
                                "Score": 90,
                                "FullScore": 100
                            }, {
                                "ScoreType": 2,
                                "Score": 87,
                                "FullScore": 100
                            }, {
                                "ScoreType": 3,
                                "Score": 109,
                                "FullScore": 120
                            }, {
                                "ScoreType": 4,
                                "Score": 209,
                                "FullScore": 240
                            }, {
                                "ScoreType": 5,
                                "Score": 106,
                                "FullScore": 120
                            }],
                            "ProjectStatus": 3,
                            "ProjectId": 12,
                            "ProjectNo": null,
                            "ProjectName": "小荷包贷I" + Math.ceil(Math.random() * 1000) + "V",
                            "ProjectType": 4,
                            "FinancingAmount": 1000.00,
                            "AlreadyFinancing": 0.0,
                            "BaseType": 1
                        });
                    }
                    setTimeout(() => {
                        this.state.p_currPullDistance = 0;
                        this.state.p_translateY.setValue(0);
                        this.setState({
                            dataSource: ds.cloneWithRows(responseData.rows)
                        });
                    }, 2000);
                }
            }
        }
    };

    formatAmount(amount) {
        amount = amount.toString(10).split('.');
        let _int = amount[0].split(''), _decimals = amount[1], _num = '';
        for (let i = _int.length - 1, j = 1; i >= 0; i--, j++) {
            _num += _int[i];
            if (j % 3 === 0 && j < _int.length) {
                _num += ',';
            }
        }
        _num = _num.split('').reverse().join('');
        return _num + '.' + (_decimals ? _decimals : '00');
    }

    renderRower = (rowData, sectionID, rowID) => {
        let {dataSource} = this.state;
        let _length = dataSource.getRowCount();
        return (
            <View style={Styles.commonColumnSS}>
                <View style={Styles.listItem}>
                    <View style={Styles.itemWrap}>
                        <Text style={Styles.font_3}>{rowData.ProjectName}</Text>
                        <Text style={Styles.font_2}>{'融资金额(元)'}</Text>
                    </View>
                    <View style={[Styles.itemWrap, {marginTop: 11}]}>
                        <LinearGradient
                            start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
                            colors={[HBStyle.color.common_green_status, HBStyle.color.common_green_item_bg, HBStyle.color.common_green_item_bg]}
                            locations={[0.3, 0.3, 1]}
                            style={Styles.itemProgressWrap}>
                            <Text style={Styles.font_5}>{'正常还款中1/3期'}</Text>
                        </LinearGradient>
                        <Text style={Styles.font_4}>{this.formatAmount(rowData.FinancingAmount)}</Text>
                    </View>
                </View>
                {rowID < _length - 1 ? <View style={[Styles.divideLine, {marginLeft: 16}]}/> : null}
            </View>
        );
    };
    //主要用于获取 ListView 的高度
    onLayout = (evt) => {
        window.console.log('debug keyword: onLayout===layout.height:' + evt.nativeEvent.layout.height);
        this.state.l_layout_height = evt.nativeEvent.layout.height;
    };
    //主要获取 ListView 的内容高度
    onContentSizeChange = (contentWidth, contentHeight) => {
        window.console.log('debug keyword: onContentSizeChange===contentWidth:' + contentWidth + ';contentHeight:' + contentHeight + ';SCREEN_HEIGHT:' + SCREEN_HEIGHT);
        this.state.l_contentHeight = contentHeight;
    };
    //主要获取 ListView 内容的滚动高度
    onScroll = (evt) => {
        //window.console.log('debug keyword: onScroll===contentOffset.y:' + evt.nativeEvent.contentOffset.y + ';evt.nativeEvent.lay.y:' + evt.nativeEvent.layoutMeasurement.height);
        this.state.l_contentOffset_y = evt.nativeEvent.contentOffset.y;
    };

    render() {
        window.console.log('debug keyword: render!!!!!!');
        return (
            <View style={Styles.wrap}>
                <View style={Styles.loadMore}>
                    <DirectText ref={(ref) => this._directText = ref} text={'上拉即可加载更多...'}/>
                </View>
                <Animated.View
                    style={[Styles.wrap, {transform: [{translateY: this.state.p_translateY}]}]} {...this._panResponder.panHandlers}>
                    <ListView
                        style={{flex: 1}}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={false}
                        onLayout={this.onLayout}
                        onContentSizeChange={this.onContentSizeChange}
                        onScroll={this.onScroll}
                        renderHeader={() => <PageHeader />}
                        renderRow={this.renderRower}/>
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
        backgroundColor: 'transparent'
    },
    loadMore: {
        width: SCREEN_WIDTH,
        height: G_PULL_UP_DISTANCE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#feafea'
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: HBStyle.color.gray_bg
    }
});