/**
 * Created by hebao on 2017/6/13.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableHighlight,
    BackAndroid,
    Image
} from 'react-native';
import Util from '../../utility/util';
import * as KBEvent from './KBEvent';
import HBStyle from '../../styles/style.android';

const debugKeyWord = '[PageKeyboard]';
export default class PageKeyboard extends Component {
    _keyboardHandle = null;

    static propTypes = {
        keyboardShow: PropTypes.bool,
        keyboardType: PropTypes.number,
        onKeyPress: PropTypes.func,
        onRequestClose: PropTypes.func.isRequired,
        onKeyboardDidShow: PropTypes.func,
        onKeyboardDidHide: PropTypes.func,
    };

    static defaultProps = {
        keyboardShow: false,
        keyboardType: 1,//1 身份证键盘  2 数字带小数点键盘  3 纯数字键盘
    };

    constructor(props) {
        super(props);
        this.state = {
            translatePosY: new Animated.Value(250),
        }
    }

    componentWillUnmount() {
        this._keyboardHandle && this._keyboardHandle.remove();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.keyboardShow !== this.props.keyboardShow || nextProps.keyboardType !== this.props.keyboardType;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.keyboardShow !== this.props.keyboardShow) {
            if (this.props.keyboardShow === true) {
                Animated.timing(this.state.translatePosY, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.ease
                }).start(() => {
                    this._keyboardHandle = BackAndroid.addEventListener(KBEvent.ACTION_NUMERIC_KEYBOARD_SHOW, this._hardwareBackPress.bind(this));
                    this.props.onKeyboardDidShow instanceof Function && this.props.onKeyboardDidShow();
                });
            }
            else if (this.props.keyboardShow === false) {
                Animated.timing(this.state.translatePosY, {
                    toValue: 250,
                    duration: 200,
                    easing: Easing.ease
                }).start(() => {
                    this._keyboardHandle && this._keyboardHandle.remove();
                    this.props.onKeyboardDidHide instanceof Function && this.props.onKeyboardDidHide();
                });
            }
        }
    }

    _hardwareBackPress() {
        let {keyboardShow, onRequestClose} = this.props;
        if (keyboardShow) {
            onRequestClose instanceof Function && onRequestClose();
            return true;
        }
        return false;
    }

    _keyboardPress(id) {
        this.props.onKeyPress instanceof Function && this.props.onKeyPress(id);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {keyboardType} = this.props;
        return (
            <Animated.View style={[Styles.wrap, {transform: [{translateY: this.state.translatePosY}]}]}>
                <View style={[Styles.container, {
                    borderTopWidth: Util.size.screen.pixel,
                    borderTopColor: '#d2d2d2'
                }]}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(1)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>1</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(2)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>2</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(3)}
                        style={[Styles.section, {borderRightWidth: 0}]}>
                        <Text style={Styles.keyFont}>3</Text>
                    </TouchableHighlight>
                </View>
                <View style={[Styles.container]}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(4)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>4</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(5)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>5</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(6)}
                        style={[Styles.section, {borderRightWidth: 0}]}>
                        <Text style={Styles.keyFont}>6</Text>
                    </TouchableHighlight>
                </View>
                <View style={[Styles.container]}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(7)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>7</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(8)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>8</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(9)}
                        style={[Styles.section, {borderRightWidth: 0}]}>
                        <Text style={Styles.keyFont}>9</Text>
                    </TouchableHighlight>
                </View>
                <View style={[Styles.container, {borderBottomWidth: 0}]}>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={keyboardType !== 3 ? HBStyle.color.common_gray_fa : HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(keyboardType == 1 ? 'X' : keyboardType == 2 ? '.' : 'secure')}
                        style={[Styles.section, {backgroundColor: HBStyle.color.common_gray_bg}]}>
                        <Text
                            style={[Styles.keyFont, {fontSize: keyboardType == 3 ? 11 : 28}]}>{keyboardType == 1 ? 'X' : keyboardType == 2 ? '.' : '荷包安全键盘'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_bg}
                        onPress={() => this._keyboardPress(0)}
                        style={[Styles.section]}>
                        <Text style={Styles.keyFont}>0</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={HBStyle.color.common_gray_fa}
                        onPress={() => this._keyboardPress('del')}
                        style={[Styles.section, {
                            borderRightWidth: 0,
                            backgroundColor: HBStyle.color.common_gray_bg
                        }]}>
                        <Image
                            fadeDuration={0}
                            source={{uri: 'keyboard_img_pay_delicon'}}
                            style={Styles.keyDelete}
                            resizeMode={'contain'}/>
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        width: Util.size.screen.width,
        height: 240,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: HBStyle.color.common_gray_fa
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: Util.size.screen.pixel,
        borderBottomColor: '#d2d2d2'
    },
    section: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: Util.size.screen.pixel,
        borderRightColor: '#d2d2d2'
    },
    keyFont: {
        color: '#555555',
        fontSize: 28
    },
    keyDelete: {
        width: 37.5,
        height: 37.5
    }
});