'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import {observable, action, autorun, computed} from 'mobx';
import {observer, Provider, inject} from 'mobx-react/native';
import AppStore from '../stores/testView/test';
import Util from '../utility/util';
import * as ACTIONS from '../utility/events';

import ModalActivity from '../components/ModalActivity';
import Loading from '../components/Loading';
import NavActivity from '../components/NavActivity';

@inject('store') @observer
class CountAge extends Component {
    componentDidMount() {
        setInterval(() => {
            this.props.store.state.age++
        }, 2000);
    }

    render() {
        return (
            <View style={{marginTop: 20}}>
                <Text>{`my age: ${this.props.store.state.age}`}</Text>
                <Text>{`my birth: ${this.props.store.fixAge}`}</Text>
            </View>
        );
    }
}

@inject('store', 'navigation') @observer
class ReduxTestPage extends Component {
    constructor(props) {
        super(props);
    }

    _nextPage() {
        // window.console.log(this.props.navigation);
        // this.props.navigation.navigate('NextPage');
        Util.trigger(ACTIONS.ACTION_LOADING_DONE, {done: false, overTime: 20000});
    }

    render() {
        let {userName} = this.props.store.state;
        let {Success} = this.props.store.data;
        let {updateData} = this.props.store;
        return (
            <View style={Styles.wrap}>
                <NavActivity
                    closeButton={{closeZone: 'right', disabled: false}}
                    leftButton={{disabled: false}}
                    title={{title: 'HOME'}}/>
                <Text>{`my Name is: ${userName}`}</Text>
                <Text>{`server data isSuccess ${Success}`}</Text>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => updateData({Success: !Success})}>
                    <Text>{'toggle server data true or false'}</Text>
                </TouchableOpacity>
                <CountAge/>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={() => this._nextPage()}>
                    <Text>{'press to jump router!!!'}</Text>
                </TouchableOpacity>
                <ModalActivity
                    wrapStyle={{justifyContent: 'center'}}
                    containerStyle={{width: 200,height:200,backgroundColor:'#feafea',borderRadius:100}}
                    visible={Success}
                    onRequestToClose={() => updateData({Success: !Success})}
                    allowHardwareBackHideModal={false}
                    tapBackToHide={true}/>
                <Loading/>
            </View>
        )
    }
}

export default class ReduxTest extends Component {
    static navigationOptions = {
        title: 'Home',
    };

    render() {
        return (
            <Provider store={AppStore} navigation={this.props.navigation}>
                <ReduxTestPage/>
            </Provider>
        );
    }
};

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btn: {
        width: 200,
        height: 50,
        backgroundColor: '#ffe341',
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});