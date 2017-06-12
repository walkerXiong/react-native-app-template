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
        GetHotFAQList: (callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetHotFAQList';
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
                    Util.log(debugKeyWord + "GetHotFAQList Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        GetFAQList: (keyword, callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetFAQList?keyword=' + keyword;
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
                    Util.log(debugKeyWord + "GetFAQList Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        GetFAQList_type: (typeID, callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetFAQList?typeID=' + typeID;
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
                    Util.log(debugKeyWord + "GetFAQList_type Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        GetFAQDetail: (id, callback, errorCallback) => {
            const _url = _domain + 'FAQ/GetFAQDetail/' + id;
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
                    Util.log(debugKeyWord + "GetFAQDetail Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        AddFAQTypeViewCount: (typeID, callback, errorCallback) => {
            const _url = _domain + 'FAQ/AddFAQTypeViewCount?typeID=' + typeID;
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
                    Util.log(debugKeyWord + "AddFAQTypeViewCount Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done();
        },
        AddFAQViewCount: (faqID, callback, errorCallback) => {
            const _url = _domain + 'FAQ/AddFAQViewCount?faqID=' + faqID;
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
                    Util.log(debugKeyWord + "AddFAQViewCount Error:" + e);
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
    CreditCard: {
        /**
         * 获取用户信用卡同步方式
         * @param bankCode
         * @param callback
         * @param errorCallback
         * @constructor
         */
        GetBankLoginType: (bankCode, callback, errorCallback) => {
            const _url = _domain + 'CreditCard/GetBankLoginType?bankCode=' + bankCode;
            Util.log(debugKeyWord + "fetch url:" + _url);
            let _loadingHandle = _startLoading();
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
                    Util.log(debugKeyWord + "GetBankLoginType Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done(() => _endLoading(_loadingHandle));
        },
        /**
         * 取信用卡同步结果
         * @param cardId
         * @param callback
         * @param errorCallback
         * @constructor
         */
        GetCreditCardBillResult: (cardId, callback, errorCallback) => {
            const _url = _domain + 'CreditCard/GetCreditCardBillResult?cardId=' + cardId;
            Util.log(debugKeyWord + "fetch url:" + _url);
            let _loadingHandle = _startLoading();
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
                    Util.log(debugKeyWord + "GetCreditCardBillResult Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done(() => _endLoading(_loadingHandle));
        },
        /**
         * 同步信用卡账单
         * @param CardId
         * @param Account
         * @param Password
         * @param LoginType
         * @param callback
         * @param errorCallback
         * @constructor
         */
        SyncCreditCardBill: (CardId, Account, Password, LoginType, callback, errorCallback) => {
            const _url = _domain + 'CreditCard/SyncCreditCardBill';
            Util.log(debugKeyWord + "fetch url:" + _url);
            const _body = _sign({
                "CardId": CardId,
                "Account": Account,
                "Password": Password,
                "LoginType": LoginType
            });
            let _loadingHandle = _startLoading(60000);
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
                    Util.log(debugKeyWord + "SyncCreditCardBill Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done(() => _endLoading(_loadingHandle));
        },
        /**
         * 发送验证码
         * @param OrderNo
         * @param IdentifyingCode
         * @param callback
         * @param errorCallback
         * @constructor
         */
        SendIdentifyingCode: (OrderNo, IdentifyingCode, callback, errorCallback) => {
            if (!WebAPI.fetchDone) return;
            WebAPI.fetchDone = false;
            const _url = _domain + 'CreditCard/SendIdentifyingCode';
            Util.log(debugKeyWord + "fetch url:" + _url);
            const _body = _sign({
                "OrderNo": OrderNo,
                "IdentifyingCode": IdentifyingCode,
            });
            let _loadingHandle = _startLoading();
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
                    Util.log(debugKeyWord + "SendIdentifyingCode Error:" + e);
                    errorCallback && errorCallback(e);
                })
                .done(() => {
                    _endLoading(_loadingHandle);
                    WebAPI.fetchDone = true;
                });
        },
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
    /**
     * 活动接口，需要注意的是，活动接口的正式域名与APP接口的正式域名不同，需要在此处配置
     */
    Activity: {
        /**
         * 拉新红包雨的接口
         */
        PullUserRain: {
            InitHBUserStatus: (activityId, token, callback, errorCallback) => {
                const _url = _activityDomain + 'PullUserRain/InitHBUserStatus?activityId=' + activityId;
                Util.log(debugKeyWord + "fetch url:" + _url + ';token:' + token);
                fetch(_url, {
                    method: "GET",
                    headers: {
                        Referer: 'https://activity.hebaodai.com',
                        token: token
                    }
                })
                    .then((response) => response.json())
                    .then((responseJsonData) => {
                        callback && callback(responseJsonData);
                    })
                    .catch((e) => {
                        Util.log(debugKeyWord + "InitHBUserStatus Error:" + e);
                        errorCallback && errorCallback(e);
                    })
                    .done();
            },
            GetJoinState: (token, callback, errorCallback) => {
                const _url = _activityDomain + 'PullUserRain/GetJoinState';
                Util.log(debugKeyWord + "fetch url:" + _url);
                fetch(_url, {
                    method: "GET",
                    headers: {
                        Referer: 'https://activity.hebaodai.com',
                        token: token
                    }
                })
                    .then((response) => response.json())
                    .then((responseJsonData) => {
                        callback && callback(responseJsonData);
                    })
                    .catch((e) => {
                        Util.log(debugKeyWord + "InitHBUserStatus Error:" + e);
                        errorCallback && errorCallback(e);
                    })
                    .done();
            }
        }
    },
};
export default WebAPI;