/**
 * Created by hebao on 2017/2/7.
 */
'use strict';
import {
    NetInfo
} from 'react-native';
import config from '../config';
import Util from './util';
import * as Crypto from './cryptoJs';
import * as ACTIONS from '../utility/events';

const _domain = config.develop ? config.devDomain : (config.preview ? config.preDomain : config.formalDomain);
const _signKey = config.develop ? 'AF30FEB52DCEC4129CF778A316871BCA' : '453349E3338EE078CF23E9C8D46DF799';
const _activityDomain = config.develop ? config.activityDevDomain : config.activityFormalDomain;
const debugKeyWord = '[webAPI]';

let _loadingStartTime = 600;//500ms内网络请求无响应，则展现loading动画
function _startLoading(overTime) {
    Util.log(debugKeyWord + "loading start!!!!");
    return setTimeout(() => {
        Util.trigger(ACTIONS.ACTION_LOADING_DONE, {done: false, overTime: overTime});
    }, _loadingStartTime);
}
function _endLoading(loadingHandle) {
    Util.log(debugKeyWord + "loading done!!!");
    clearTimeout(loadingHandle);
    Util.trigger(ACTIONS.ACTION_LOADING_DONE, {done: true});
}
function _sign(obj) {//加签规则
    let _signStr = '', _signValue, _bodyStr;
    let _keySort = Object.keys(obj).sort();
    for (let i = 0, j = _keySort.length; i < j; i++) {
        _signStr += _keySort[i] + '=' + encodeURIComponent(obj[_keySort[i]]);
        i !== j - 1 ? _signStr += '&' : null;
    }
    _signValue = Crypto.CryptoMD5(_signStr + '&key=' + _signKey);
    _bodyStr = _signStr + '&Sign=' + _signValue;
    return _bodyStr;
}
const WebAPI = {
    fetchDone: true,
    header: {},
    FAQ: {
        GetFAQTypeList: (callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetFAQTypeList';
            Util.log(debugKeyWord + "fetch url:" + _url);
            fetch(_url, {
                method: "GET",
                headers: {
                    ...WebAPI.header
                },
            })
                .then((response) => response.json())
                .then((responseJsonData) => {
                    callback && callback(responseJsonData);
                })
                .catch((e) => {
                    Util.log(debugKeyWord + "GetFAQTypeList Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        FeedbackFAQ: (FAQID, isResolved, callback, errorCallback) => {
            const _url = _domain + 'FAQ/FeedbackFAQ';
            Util.log(debugKeyWord + "post url:" + _url + ";FAQID:" + FAQID + ";isResolved:" + isResolved);
            const _body = _sign({
                "FAQID": FAQID,
                "isResolved": isResolved,
            });
            fetch(_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...WebAPI.header
                },
                body: _body
            })
                .then((response) => response.json())
                .then((responseJsonData) => {
                    callback && callback(responseJsonData);
                })
                .catch((e) => {
                    Util.log(debugKeyWord + "FeedbackFAQ Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        }
    },
    NetInfo: {
        simulateRequestHandle: -1,
        isConnected: {
            fetch: (callback) => {
                NetInfo.isConnected.fetch().done(
                    (isConnected) => {
                        callback && callback(isConnected);
                    }
                );
            },
            addEventListener: (handle, callback) => {
                NetInfo.isConnected.addEventListener(
                    handle,
                    callback
                );
            },
            removeEventListener: (handle, callback) => {
                NetInfo.isConnected.removeEventListener(
                    handle,
                    callback
                );
            }
        },
        simulateRequest: (callback) => {
            clearTimeout(WebAPI.NetInfo.simulateRequestHandle);
            let _responseTimeDelay = Math.ceil(Math.random() + 15) * 1000;
            let _loadingHandle = _startLoading();
            NetInfo.isConnected.fetch().done(
                (isConnected) => {
                    WebAPI.NetInfo.simulateRequestHandle = setTimeout(() => {
                        _endLoading(_loadingHandle);
                        callback && callback(isConnected);
                    }, _responseTimeDelay);
                }
            );
        }
    },
};
export default WebAPI;