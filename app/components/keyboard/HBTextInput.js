/**
 * Created by hebao on 2017/7/5.
 */
'use strict';
import React, {Component} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
const ColorPropType = require('ColorPropType');
import shallowCompare from 'react-addons-shallow-compare';
import HBStyle from '../../styles/standard';

export default class TestPage extends Component {
  _indicator = null;
  _indicatorShineHandle = -1;
  _indicatorShineCount = 0;

  static propTypes = {
    wrapStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
    indicatorStyle: View.propTypes.style,
    placeholder: PropTypes.node,
    placeholderTextColor: ColorPropType,
    maxLength: PropTypes.number,

    onFocus: PropTypes.func,
    editable: PropTypes.bool,
  };

  static defaultProps = {
    editable: true,
    placeholderTextColor: HBStyle.color.wgray_sub
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    clearInterval(this._indicatorShineHandle);
  }

  setText(text) {
    if (text === 'secure') return;
    let _value = '';
    if (text === 'del') {
      _value = this.state.value.substring(0, this.state.value.length - 1);
      this.setState({value: _value});
    }
    else {
      _value = this.state.value + text;
      if (Number(this.props.maxLength)) {
        _value.length <= this.props.maxLength ? this.setState({value: _value}) : null;
      }
      else {
        this.setState({value: _value});
      }
    }
  }

  setBlur() {
    clearInterval(this._indicatorShineHandle);
    this._indicator.setNativeProps({style: {opacity: 0}});
  }

  _onFocus() {
    this._indicatorShine();
    this.props.onFocus instanceof Function && this.props.onFocus();
  }

  _indicatorShine() {
    clearInterval(this._indicatorShineHandle);
    this._indicatorShineHandle = setInterval(() => {
      if (this._indicator) {
        this._indicatorShineCount++;
        this._indicator.setNativeProps({style: {opacity: this._indicatorShineCount % 2}});
      }
    }, 500);
  }

  render() {
    let {editable, placeholder, placeholderTextColor, wrapStyle, textStyle, indicatorStyle} = this.props;
    return (
      <TouchableWithoutFeedback disabled={!editable} onPress={this._onFocus.bind(this)}>
        <View style={[Styles.wrap, wrapStyle]}>
          <Text style={[Styles.commonFont, textStyle]}>
            {this.state.value}
          </Text>
          <View ref={(ref) => this._indicator = ref} style={[Styles.indicator, indicatorStyle]}/>
          <Text numberOfLines={1} style={[Styles.commonFont, textStyle, {color: placeholderTextColor}]}>
            {this.state.value ? '' : placeholder}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: HBStyle.size.h_list
  },
  commonFont: {
    fontSize: 23,
    color: HBStyle.color.wblack,
    textAlign: 'left',
  },
  indicator: {
    width: 1,
    height: HBStyle.size.h_list * 2 / 3,
    backgroundColor: '#B3B3B3',
    opacity: 0
  }
});