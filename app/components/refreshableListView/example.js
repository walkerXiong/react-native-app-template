/**
 * Created by hebao on 2017/8/24.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
}  from 'react-native';
import RefreshInfiniteListView from './refreshableListView';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Example extends Component {
    list = null;
    data = {
        index: 0,
        maxIndex: 20,
        list: []
    };

    constructor(props) {
        super(props);
        this.getData(true);
        this.state = {
            dataSource: ds.cloneWithRows(this.data.list),
        }
    }

    getData(init) {
        let total = 5;
        if (init) {
            this.data.index = 0;
            this.data.list = [];
            total = Math.ceil(Math.random() * 5);
        }
        for (let i = 0; i < total; i++) {
            this.data.list[this.data.index] = 'Row' + (this.data.index + 1);
            this.data.index++;
        }
    }


    onRefresh = () => {
        this.getData(true);
        setTimeout(() => {
            this.list && this.list.hideHeader();
            this.setState({
                dataSource: ds.cloneWithRows(this.data.list)
            });
        }, 1000);
    };

    onInfinite = () => {
        this.getData();
        setTimeout(() => {
            this.list && this.list.hideFooter();
            this.setState({
                dataSource: ds.cloneWithRows(this.data.list)
            });
        }, 1000);
    };

    loadedAllData = () => {
        return this.data.index >= this.data.maxIndex || this.data.index === 0;
    };

    renderRow = (rowData) => {
        return (
            <View style={styles.row}><Text >{rowData}</Text></View>
        );
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{height: 20}}/>
                <RefreshInfiniteListView
                    ref={(ref) => this.list = ref}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    loadedAllData={this.loadedAllData}
                    initialListSize={30}
                    onRefresh={this.onRefresh}
                    onInfinite={this.onInfinite}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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