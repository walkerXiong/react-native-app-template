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

            onStartShouldSetPanResponderCapture: this.onStartShouldSetPanResponderCapture,//所以如果一个父视图要防止子视图在触摸开始时成为响应器，它应该有一个 onStartShouldSetResponderCapture 处理程序，返回 true
            onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,//这个视图是否在触摸开始时想成为响应器

            onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
            onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,//当视图不是响应器时，该指令被在视图上移动的触摸调用：这个视图想“声明”触摸响应吗?

            onPanResponderTerminationRequest: () => true,//其他的东西想成为响应器。这种视图应该释放应答吗？返回 true 就是允许释放
            onPanResponderTerminate: () => null,//响应器已经从该视图抽离了。可能在调用onResponderTerminationRequest 之后被其他视图获取，也可能是被操作系统在没有请求的情况下获取了(发生在 iOS 的 control center/notification center)

            //Api 调用顺序
            onPanResponderGrant: this.onPanResponderGrant,//视图现在正在响应触摸事件。这个时候要高亮标明并显示给用户正在发生的事情
            onPanResponderReject: this.onPanResponderReject,//当前有其他的东西成为响应器并且没有释放它

            onPanResponderStart: this.onPanResponderStart,
            onPanResponderMove: this.onPanResponderMove,//有可能会直接 End （如果手势快的话） ，所以 Move 不一定会执行
            onPanResponderEnd: this.onPanResponderEnd,// End 函数一定会执行，不管是否 onPanResponderTerminate 已经被夺去了响应，如果夺去了响应，也会先 End -> onPanResponderTerminate
            onPanResponderRelease: this.onPanResponderRelease,//有可能会直接 End （如果手势快的话），所以 Release 不一定会执行
        });
    }

    //========================API 调用顺序 part 1========================
    onStartShouldSetPanResponderCapture = () => {
        window.console.log('debug keyword: onStartShouldSetPanResponderCapture === call order 1.');//首先调用此方法
        return false;
    };
    onStartShouldSetPanResponder = () => {
        window.console.log('debug keyword: onStartShouldSetPanResponder === call order 1.');//如果 onStartShouldSetPanResponderCapture 返回 true 则此方法不会被调用
        return true;
    };

    onMoveShouldSetPanResponderCapture = (evt, gestureState) => {//如果 onStartShouldSetPanResponderCapture 或者 onStartShouldSetPanResponder 返回 true 则此方法不会被调用
        window.console.log('debug keyword: onMoveShouldSetPanResponderCapture === call order 2.');
        return false;
    };
    onMoveShouldSetPanResponder = (evt, gestureState) => {//如果 onMoveShouldSetPanResponderCapture 或者 onStartShouldSetPanResponder 返回 true 则此方法不会被调用
        window.console.log('debug keyword: onMoveShouldSetPanResponder === call order 2.');
        return true;
    };

    //========================API 调用顺序 part 2========================
    //onPanResponderGrant 方法和 onPanResponderReject 方法视情况而调用
    onPanResponderGrant = () => {
        window.console.log('debug keyword: onPanResponderGrant === call order 3.');
    };
    onPanResponderReject = () => {
        window.console.log('debug keyword: onPanResponderReject === call order 3.');
    };

    //========================API 调用顺序 part 3========================
    //只有当 onStartShouldSetPanResponder 返回为 true 时，此方法被调用
    onPanResponderStart = () => {
        window.console.log('debug keyword: onPanResponderStart === call order 4.');
    };

    //========================API 调用顺序 part 4========================
    //以下方法顺序调用
    onPanResponderMove = () => {
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