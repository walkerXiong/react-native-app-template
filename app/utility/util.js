/**
 * Created by DELL on 2016/12/23.
 */
'use strict';
import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import {
    PixelRatio,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    StatusBar
} from 'react-native';
//import Toast from 'react-native-root-toast';

import config from '../config';
const debugMsg = config.debugMsg;//是否开启打印

const screenWidth = Dimensions.get('window').width;//屏幕宽度
const screenHeight = Dimensions.get('window').height;//屏幕高度
const minPixel = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const statusBarHeight_android = StatusBar.currentHeight;

const Util = {
    activeOpacity: 0.6,
    ActivityIndicatorColor: '#b3bbc0',

    platformAndroid: () => {
        return Platform.OS === 'android';
    },

    size: {
        screen: {
            pixel: 1 / minPixel,//最小线宽
            pixelRatio: minPixel,
            width: screenWidth,//屏幕宽度
            height: screenHeight,//屏幕高度
            fontScale: fontScale
        },
        statusBar: {
            height: Platform.OS === 'android' ? statusBarHeight_android : 20//状态栏高度，iOS=20，安卓通过StatusBar获取
        },
    },
    /**
     * 添加事件监听
     * event: 需要监听的事件
     * callback: 监听回调
     */
    addListener(event, callback){
        return DeviceEventEmitter.addListener(event, callback);
    },
    /**
     * 触发监听事件
     * event: 触发监听的事件
     * params: 事件携带参数
     */
    trigger(event, params){
        DeviceEventEmitter.emit(event, params);
    },
    /**
     * 移除监听事件
     * handle: addListener方法返回的句柄
     */
    removeListener(handle){
        handle && handle.remove();
    },
    /**
     * 物理按键
     */
    physicalButton: {
        _lastBackPressed: -1,
        _allowLeaveTime: 2000,
        _navigator: null,
        addBackEventListener(eventName, navigator){
            Util.physicalButton._navigator = navigator;
            return BackHandler.addEventListener(eventName, Util.physicalButton.onBackAndroid);
        },
        removeBackEventListener(hardWareBackHandle){
            hardWareBackHandle && hardWareBackHandle.remove();
        },
        onBackAndroid(){
            let navigator = Util.physicalButton._navigator;
            if (navigator) {
                let _routers = navigator.getCurrentRoutes();

                //如果当前路由组件定义了ignoreBackEvent，则不执行返回键；如果当前路由组件定义了handleBackEvent，则执行handleBackEvent，并根据其返回值决定是否执行返回键
                const _currNav = _routers[_routers.length - 1];
                if (_currNav.ignoreBackEvent || _currNav.component.ignoreBackEvent) return true;
                if (_currNav.handleBackEvent || _currNav.component.handleBackEvent) {
                    if (_currNav.handleBackEvent instanceof Function) {
                        return _currNav.handleBackEvent();
                    }
                    if (_currNav.component.handleBackEvent instanceof Function) {
                        return _currNav.component.handleBackEvent();
                    }
                }

                if (_routers.length > 1) {
                    navigator.pop();
                    return true;
                }
                return false;

                // //如果路由层级已经为顶层，则两次单击退出
                // if (this._lastBackPressed !== -1 && (this._lastBackPressed + this._allowLeaveTime) >= Date.now()) {
                //     return false;//2s之内连续按返回键，则退出应用
                // }
                // this._lastBackPressed = Date.now();
                // Util.toast.show("再按一次退出应用");
                // return true;
            }
        }
    },
    log(msg){
        debugMsg ? window.console.log("【UI】" + msg) : null;
    }
};

export default Util;