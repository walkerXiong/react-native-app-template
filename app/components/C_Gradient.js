/**
 * Created by hebao on 2017/9/9.
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import LinearGradient from 'react-native-linear-gradient';

import BXStandard from '../styles/standard';
const {width, height} = Dimensions.get('window');
const debugKeyWord = '[NGradient]';

export default class NGradient extends Component {
  _countHandle = -1;
  _defaultContentText = '';

  static propTypes = {
    wrapStyle: ViewPropTypes.style,
    btnType: PropTypes.string,
    emptyBtn: PropTypes.bool,
    countDownBtn: PropTypes.bool,
    countTime: PropTypes.number,
    contentText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    btnType: 'btn_l',
    emptyBtn: false,
    countDownBtn: false,
    countTime: 60,
    contentText: '',
    disabled: false,
    onPress: () => null
  };

  colorsCommon = ['#f9eaa4', '#efcb75', '#ddb464', '#e1ae55'];
  colorsDisabled = ['rgba(249,234,164,0.55)', 'rgba(239,203,117,0.55)', 'rgba(221,180,100,0.55)', 'rgba(225,174,85, 0.55)'];
  colorsPressIn = ['#f9dc88', '#efbf60', '#dda952', '#e1a345'];
  emptyColor = 'rgba(0,0,0,0)';
  emptyColorPressIn = '#fbf4e1';

  constructor(props) {
    super(props);
    this._defaultContentText = props.contentText;
    this.state = {
      pressDown: false,
      contentText: props.contentText,
      disabled: props.disabled,
      countTime: props.countTime
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      ...this.state,
      ...nextProps
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    clearTimeout(this._countHandle);
  }

  _countDown = () => {
    let _countTime = this.state.countTime;
    this.setState({
      contentText: _countTime,
      countTime: --_countTime,
      disabled: true
    });
    if (_countTime > 0) {
      this._countHandle = setTimeout(() => {
        this._countDown();
      }, 1000);
    }
    else {
      this.setState({
        contentText: this._defaultContentText,
        countTime: this.props.countTime,
        disabled: false
      });
    }
  };

  _onPress = () => {
    let {onPress, countDownBtn} = this.props;
    if (countDownBtn) {
      this._countDown();
    }
    onPress();
  };

  render() {
    let {wrapStyle, btnType, emptyBtn} = this.props;
    let {pressDown, contentText, disabled} = this.state;
    return (
      <TouchableHighlight
        style={[wrapStyle]}
        disabled={disabled}
        activeOpacity={1}
        underlayColor={'rgba(0,0,0,0)'}
        onPressIn={() => (!disabled && this.setState({pressDown: true}))}
        onPress={() => (!disabled && this._onPress())}
        onPressOut={() => (!disabled && this.setState({pressDown: false}))}>
        {
          emptyBtn ?
            <View
              style={[
                Styles.btn,
                Styles[btnType],
                Styles.emptyBtn,
                {backgroundColor: pressDown ? this.emptyColorPressIn : this.emptyColor}
              ]}>
              <Text style={[Styles.emptyFont, Styles['font_' + btnType]]}>{contentText}</Text>
            </View> :
            <LinearGradient
              start={{x: 0.0, y: 1.0}}
              end={{x: 1.0, y: 1.0}}
              locations={[0, 0.36, 0.7, 1.0]}
              colors={disabled ? this.colorsDisabled : pressDown ? this.colorsPressIn : this.colorsCommon}
              style={[Styles.btn, Styles[btnType]]}>
              <Text style={[Styles.font, Styles['font_' + btnType]]}>{contentText}</Text>
            </LinearGradient>
        }
      </TouchableHighlight>
    )
  }
}

const Styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  font: {
    color: BXStandard.color.wwhite
  },
  emptyBtn: {
    borderWidth: 0.5,
    borderColor: BXStandard.color.gold_main
  },
  emptyFont: {
    color: BXStandard.color.wgold_main
  },

  btn_l: {
    width: width - 24,
    height: 44,
    borderRadius: 22,
  },
  font_btn_l: {
    fontSize: 17
  },
  btn_m: {
    width: 130,
    height: 36,
    borderRadius: 18,
  },
  font_btn_m: {
    fontSize: 15
  },
  btn_s: {
    width: 73,
    height: 30,
    borderRadius: 15,
  },
  font_btn_s: {
    fontSize: 13
  },
  btn_xs: {
    width: 60,
    height: 24,
    borderRadius: 12,
  },
  font_btn_xs: {
    fontSize: 13
  },
  btn_input: {
    width: 48,
    height: 27,
    borderRadius: 13.5,
  },
  font_btn_input: {
    fontSize: 13
  },

  btn_alert_half: {
    flex: 1,
    height: 44.5,
    borderBottomRightRadius: 15
  },
  font_btn_alert_half: {
    fontSize: 15
  },
  btn_alert_full: {
    flex: 1,
    height: 44.5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  font_btn_alert_full: {
    fontSize: 15
  },

  btn_update: {
    width: 180,
    height: 36,
    borderRadius: 18
  },
  font_btn_update: {
    fontSize: 16
  },

  btn_update_half: {
    width: 110,
    height: 36,
    borderRadius: 18
  },
  font_btn_update_half: {
    fontSize: 14
  },
});