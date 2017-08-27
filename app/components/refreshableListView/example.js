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
}  from 'react-native';
import RefresherListView from './refresher';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Example extends Component {
    data = ['row1', 'row2', 'row3'];

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
            total = Math.ceil(Math.random() * 5);
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
        switch (gestureStatus) {
            case 2:
                return (
                    <View style={{
                        height: 80,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'下拉刷新...'}</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={{
                        height: 80,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'释放刷新...'}</Text>
                    </View>
                );
                break;
            case 4:
                setTimeout(() => {
                    this.getData(true);
                    this.setState({
                        dataSource: ds.cloneWithRows(this.data)
                    }, () => {
                        RefresherListView.headerRefreshDone();
                    });
                }, 2000);
                return (
                    <View style={{
                        height: 80,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'正在刷新...'}</Text>
                    </View>
                );
                break;
            default:
                return null;
        }
    };

    renderFooterInfinite = (gestureStatus) => {
        switch (gestureStatus) {
            case 1:
                return (
                    <View style={{
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'上拉加载更多...'}</Text>
                    </View>
                );
                break;
            case 3:
                return (
                    <View style={{
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'松开加载更多...'}</Text>
                    </View>
                );
                break;
            case 5:
                setTimeout(() => {
                    this.getData();
                    this.setState({
                        dataSource: ds.cloneWithRows(this.data)
                    }, () => {
                        RefresherListView.footerInfiniteDone();
                    });
                }, 2000);
                return (
                    <View style={{
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{'加载中...'}</Text>
                    </View>
                );
                break;
            default:
                return null;
        }
    };

    render() {
        return (
            <View style={styles.wrap}>
                <View style={{height: 44, width: Dimensions.get('window').width, backgroundColor: '#142124'}}/>
                <RefresherListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    enableHeaderRefresh={true}
                    enableFooterInfinite={false}
                    renderHeaderRefresh={this.renderHeaderRefresh}
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
    separator: {
        height: 1,
        backgroundColor: '#CCC',
    },
});