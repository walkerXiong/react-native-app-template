/**
 * Created by DELL on 2016/12/23.
 */
'use strict';
import {
  DeviceEventEmitter,
  Platform,
  BackHandler,
} from 'react-native';

import Toast from '../components/C_Toast';
import Loading from '../components/C_Loading';
import Alert from '../components/C_Alert';
import ActionSheet from '../components/C_ActionSheetWithoutMobX';

import IDValidator from './IDValidator';
import dateFormat from 'dateformat';
import config from '../config';

const Validator = new IDValidator();
const Util = {
  activeOpacity: 0.6,
  activityIndicatorColor: '#b3bbc0',
  platformAndroid: Platform.OS === 'android',
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

        //如果路由层级大于1，则返回上一路由
        if (_routers.length > 1) {
          navigator.pop();
          return true;
        }
        //如果路由层级已经为顶层，则两次单击退出
        if (Util.physicalButton._lastBackPressed !== -1 && (Util.physicalButton._lastBackPressed + Util.physicalButton._allowLeaveTime) >= Date.now()) {
          return false;//2s之内连续按返回键，则退出应用
        }
        Util.physicalButton._lastBackPressed = Date.now();
        Util.toast.show("再按一次退出应用");
        return true;
      }
    }
  },
  toast: {
    handle: null,
    show: (content) => Util.toast.handle = Toast.show(content),
    hide: () => Util.toast.handle && Toast.hide(Util.toast.handle)
  },
  loading: {
    show: Loading.show,
    hide: Loading.hide
  },
  alert: {
    show: Alert.show,
    hide: Alert.hide
  },
  actionSheet: {
    show: ActionSheet.show,
    hide: ActionSheet.hide
  },
  /**
   * 验证手机号码
   * @param mobile
   * @returns {boolean}
   */
  checkMobile: (mobile) => {
    return /^1[34578]\d{9}$/.test(mobile);
  },
  /**
   * 验证纯数字
   * @param num
   * @returns {boolean}
   */
  checkPureNumber: (num) => {
    return /^[0-9]*$/.test(num);
  },
  /**
   * 校验姓名
   * @param name
   * @returns {[*,*]}
   */
  checkValidName: (name) => {
    return [(name.length <= 5), (/^[\u4e00-\u9fa5]{2,5}$/.test(name))];
  },
  /**
   * 校验身份证号
   * @param idNum
   * @returns {[*,*]}
   */
  checkValidIdentity: (idNum) => {
    return [(idNum.length === 18 || idNum.length === 15), Validator.isValid(idNum)];
  },
  /**
   * 处理js 0.1精度问题: 1300 + 27.3 + 1.1 = 1328.3999999999999
   * @param num
   * @returns {number}
   */
  fixFloatNum: (num) => {
    return Number(MathJs.format(num, {precision: 14}))
  },
  /**
   * 格式化日期: https://github.com/felixge/node-dateformat
   * @param date
   * @param format
   * @returns {*}
   */
  formatDate: (date, format) => {
    return dateFormat(date, format);
  },
  /**
   * 格式化金钱格式
   * @param amount
   * @returns {*}
   */
  formatAmount: (amount) => {
    // if (!amount) return amount;
    if (!amount) return '0.00'; // 为了将  0  =》 0.00
    amount = amount.toString(10).split('.');
    let _int = amount[0].split(''), _decimals = amount[1] ? amount[1].substring(0, 2) : '', _num = '';
    for (let i = _int.length - 1, j = 1; i >= 0; i--, j++) {
      _num += _int[i];
      if (j % 3 === 0 && j < _int.length) {
        _num += ',';
      }
    }
    _num = _num.split('').reverse().join('');
    return _num + '.' + (_decimals ? (_decimals.length <= 1 ? _decimals + '0' : _decimals) : '00');
  },
  showConfig: () => {
    Alert.show({
      title: '版本信息',
      content: [{title: '', detail: 'V:' + config.version + ';D:' + config.develop + ';B:' + config.beta}],//中间主体部分文字
      buttons: [{title: '确定', callback: () => null}],
    });
  },
  log(msg){
    config.debugMsg ? window.console.log("【UI】" + msg) : null;
  }
};

export default Util;