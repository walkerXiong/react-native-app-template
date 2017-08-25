/**
 * Created by hebao on 2017/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    PanResponder,
    Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class RefresherListView extends Component {
    _panResponder = null;//触摸响应句柄

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onShouldBlockNativeResponder: () => false,//是否应该阻止原生触摸事件响应

            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,//这个视图是否在触摸开始时想成为响应器
            onStartShouldSetPanResponderCapture: () => false,//所以如果一个父视图要防止子视图在触摸开始时成为响应器，它应该有一个 onStartShouldSetResponderCapture 处理程序，返回 true

            onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,//当视图不是响应器时，该指令被在视图上移动的触摸调用：这个视图想“声明”触摸响应吗?
            onMoveShouldSetPanResponderCapture: () => false,

            onPanResponderTerminationRequest: () => true,//其他的东西想成为响应器。这种视图应该释放应答吗？返回 true 就是允许释放
            onPanResponderTerminate: () => null,//响应器已经从该视图抽离了。可能在调用onResponderTerminationRequest 之后被其他视图获取，也可能是被操作系统在没有请求的情况下获取了(发生在 iOS 的 control center/notification center)

            //Api 调用顺序
            onPanResponderGrant: this.onPanResponderGrant,//视图现在正在响应触摸事件。这个时候要高亮标明并显示给用户正在发生的事情
            onResponderReject: this.onResponderReject,//当前有其他的东西成为响应器并且没有释放它

            onPanResponderStart: this.onPanResponderStart,
            onPanResponderMove: this.handlePanResponderMove,
            onPanResponderEnd: this.onPanResponderEnd,
            onPanResponderRelease: this.onPanResponderRelease,
        });
    }

    //========================API 调用顺序 part 1========================
    onStartShouldSetPanResponder = () => {
        window.console.log('debug keyword: onStartShouldSetPanResponder === call order 1.');//首先调用此方法
        return true;
    };
    onMoveShouldSetPanResponder = (evt, gestureState) => {//如果 onStartShouldSetPanResponder 返回 true 则此方法不会被调用
        window.console.log('debug keyword: onMoveShouldSetPanResponder === call order 2.');
        return true;
    };

    //========================API 调用顺序 part 2========================
    //onPanResponderGrant 方法和 onResponderReject 方法视情况而调用
    onPanResponderGrant = () => {
        window.console.log('debug keyword: onPanResponderGrant === call order 3.');
    };
    onResponderReject = () => {
        window.console.log('debug keyword: onResponderReject === call order 3.');
    };

    //========================API 调用顺序 part 3========================
    //只有当 onStartShouldSetPanResponder 返回为 true 时，此方法被调用
    onPanResponderStart = () => {
        window.console.log('debug keyword: onPanResponderStart === call order 4.');
    };

    //========================API 调用顺序 part 4========================
    //以下方法顺序调用
    handlePanResponderMove = () => {
        window.console.log('debug keyword: handlePanResponderMove === call order 5.');
    };
    onPanResponderEnd = () => {
        window.console.log('debug keyword: onPanResponderEnd === call order 6.');
    };
    onPanResponderRelease = () => {
        window.console.log('debug keyword: onPanResponderRelease === call order 7.');
    };

    render() {
        return <View style={Styles.wrap} {...this._panResponder.panHandlers}/>;
    }
}

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: '#feafea'
    }
});