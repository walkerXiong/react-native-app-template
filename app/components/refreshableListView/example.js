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
    ActivityIndicator
}  from 'react-native';
import RefresherListView from './refresherListView';

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
            <View style={styles.footerInfinite}>
                {gestureStatus === 5 ?
                    <ActivityIndicator
                        size={'large'}
                        animating={true}
                        color={'#75c5fe'}
                        style={{marginRight: 20}}/> : null}
                <Text style={styles.refreshFont}>{_refreshFont}</Text>
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
            <View style={styles.headerRefresh}>
                {gestureStatus === 4 ?
                    <ActivityIndicator
                        size={'large'}
                        animating={true}
                        color={'#75c5fe'}
                        style={{marginRight: 20}}/> : null}
                <Text style={styles.refreshFont}>{_refreshFont}</Text>
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
        let total = 5;
        if (init) {
            this.data = [];
            total = Math.ceil(Math.random() * 10);
        }
        for (let i = 0; i < total; i++) {
            this.data.push('row' + Math.ceil(Math.random() * 5));
        }
    }

    renderRow = (rowData) => {
        return (
            <View style={styles.row}><Text >{rowData}</Text></View>
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
            }, 2000);
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
            }, 2000);
        }
        return <FooterInfinite gestureStatus={gestureStatus}/>
    };

    render() {
        return (
            <View style={styles.wrap}>
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

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    row: {
        width: Dimensions.get('window').width,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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