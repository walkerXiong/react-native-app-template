/* eslint-disable */
/**
 * Created by hebao on 2017/2/7.
 */
'use strict';
import axios from 'axios';
import config from '../config';
import Util from './util';
import * as Crypto from './cryptoJs';

const debugKeyWord = '[webAPI]';
const WebAPIConfig = {
  _config: {
    startToLoading: 300,// 300ms内网络请求无响应，则展现loading动画
    requestTimeout: 60000,//API请求超时时间
    loadingTimeout: 30000,//loading 动画超时时间
  },
  /**
   * 验签秘钥
   */
  signKey: config.develop ? '12' : '12',
  /**
   * 获取当前域名
   * @returns {string}
   */
  getCurrDomain: () => {
    return config.develop ? config.devDomain : config.formalDomain;
  },
  /**
   *
   * @param options
   * //options: {'startToLoading': number, 'overTime': number}
   * //startToLoading: loading动画可以开始的时间
   * //loadingTimeout: API接口超时时间，默认 30s 超时
   * @returns {[*,*]}
   */
  startLoading: (options) => {
    let {startToLoading, loadingTimeout} = WebAPIConfig._config;
    options = options || {};
    let _loadingHandle = setTimeout(() => {
      Util.loading.show();
    }, options.startToLoading ? options.startToLoading : startToLoading);

    let _overTimeHandle = setTimeout(() => {
      Util.loading.hide();
      Util.toast.show('加载超时，请检查网络');
    }, options.loadingTimeout ? options.loadingTimeout : loadingTimeout);

    return [_loadingHandle, _overTimeHandle];
  },
  /**
   * 加载结束
   * @param handles
   */
  endLoading: (handles) => {
    clearTimeout(handles[0]);
    clearTimeout(handles[1]);
    Util.loading.hide();
  },
};

let Axios = axios.create({
  baseURL: WebAPIConfig.getCurrDomain(),
  timeout: WebAPIConfig._config.requestTimeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

function AxiosInstance(url, option, callback, errorCallback, loadingOptions) {
  let _loadingHandle = WebAPIConfig.startLoading(loadingOptions);
  Axios(url, option).then((res) => {
    WebAPIConfig.endLoading(_loadingHandle);
    let {Success, ErrorMessage, ErrorCode} = res.data;
    if (!Success) {
      errorCallback && errorCallback(res.data);
    }
    else {
      callback && callback(res.data);
    }
  }).catch((error) => {
    WebAPIConfig.endLoading(_loadingHandle);
    errorCallback && errorCallback(error);
  });
}

function formatParam(params, unEncode) {
  let _signStr = '', _signValue, _bodyStr;
  let _keySort = Object.keys(params).sort();
  for (let i = 0, j = _keySort.length; i < j; i++) {
    if (params[_keySort[i]] !== null && params[_keySort[i]] !== '' && params[_keySort[i]] !== undefined) {
      _signStr += _keySort[i] + '=' + (unEncode ? params[_keySort[i]] : encodeURIComponent(params[_keySort[i]])) + '&';
    }
  }
  _signStr = _signStr.substring(0, _signStr.length - 1);
  _signValue = Crypto.CryptoMD5(_signStr + '&key=' + WebAPIConfig.signKey);
  _bodyStr = _signStr + '&Sign=' + _signValue;
  return _bodyStr;
}

const WebAPI = {
  /**
   * 统一设置配置项
   * @param config
   */
  checkConfig: (config) => {
    WebAPIConfig._config = Object.assign(WebAPIConfig._config, config);
  },
  axios: {
    requestInterceptors: -1,
    responseInterceptors: -1,
    /**
     * 请求拦截器设置
     * @param requestCallback
     * @param errorCallback
     */
    setRequestInterceptors: (requestCallback, errorCallback) => {
      WebAPI.axios.requestInterceptors = Axios.interceptors.request.use(requestCallback, errorCallback);
    },
    /**
     * 响应拦截器设置
     * @param responseCallback
     * @param errorCallback
     */
    setResponseInterceptors: (responseCallback, errorCallback) => {
      WebAPI.axios.responseInterceptors = Axios.interceptors.response.use(responseCallback, errorCallback);
    },
    /**
     * 移除请求拦截器
     */
    removeRequestInterceptors: () => {
      Axios.interceptors.request.eject(WebAPI.axios.requestInterceptors);
    },
    /**
     * 移除响应拦截器
     */
    removeResponseInterceptors: () => {
      Axios.interceptors.response.eject(WebAPI.axios.responseInterceptors);
    },
    /**
     * 更新Axios的默认请求头配置
     * @param header
     */
    updateDefaultHeader: (header) => {
      Axios.defaults.headers = {
        ...Axios.defaults.headers,
        ...header
      }
    }
  },
  Example: {
    SetSomething: (params, callback, errorCallback, loadingOptions) => {
      AxiosInstance('/Example/SetSomething', {
        method: 'post',
        data: formatParam(params),//post请求对应的参数属性为data
      }, callback, errorCallback, loadingOptions);
    },
    GetSomething: (params, callback, errorCallback, loadingOptions) => {
      AxiosInstance('/Auth/GetBankCard', {
        method: 'get',
        params: params,//get请求对应的参数属性为params
      }, callback, errorCallback, loadingOptions);
    },
  },
  FakeRequest: {
    count: 1,
    handle: -1,
    test: () => {
      WebAPI.FakeRequest.count = 1
      WebAPI.FakeRequest.handle = setInterval(() => WebAPI.FakeRequest.simulateRequest(), 2000)
    },
    simulateRequest: (callback) => {
      if (WebAPI.FakeRequest.count > 5) {
        clearInterval(WebAPI.FakeRequest.handle)
      }
      WebAPI.FakeRequest.count++
      let _loadingHandle = WebAPIConfig.startLoading()
      let _responseTimeDelay = Math.ceil(Math.random() * 5) * 1000
      setTimeout(() => {
        WebAPIConfig.endLoading(_loadingHandle)
        callback && callback()
      }, _responseTimeDelay)
    },
  }
};
export default WebAPI;