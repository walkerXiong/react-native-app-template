/**
 * Created by hebao on 2017/6/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Modal
} from 'react-native';
import PropTypes from 'prop-types';
import Util from '../../utility/util';
import CommonSize from '../../utility/size';
import * as KBEvent from './KBEvent';
import HBStyle from '../../styles/standard';

const {width, height, pixel} = CommonSize;
const debugKeyWord = '[NumericKeyboard]';
export default class NumericKeyboard extends Component {
    _keyBoardShowHandle = null;

    static propTypes = {
        keyboardShow: PropTypes.bool,
        keyboardType: PropTypes.number,
        onKeyPress: PropTypes.func,
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

            keyboardShow: props.keyboardShow,
            keyboardType: props.keyboardType
        }
    }

    componentDidMount() {
        this._keyBoardShowHandle = Util.addListener(KBEvent.ACTION_NUMERIC_KEYBOARD_SHOW, this._keyBoardShow.bind(this));
    }

    componentWillUnmount() {
        Util.removeListener(this._keyBoardShowHandle);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.keyboardShow !== this.state.keyboardShow || nextState.keyboardType !== this.state.keyboardType;
    }

    componentWillReceiveProps(nextProps, nextState) {
        this._keyBoardShow(nextProps);
    }

    _keyBoardShow(payload) {
        if (payload.keyboardShow === true) {
            this.setState({
                keyboardShow: payload.keyboardShow,
                keyboardType: payload.keyboardType
            });
        }
        else if (payload.keyboardShow === false) {
            this._onRequestClose();
        }
    }

    _onRequestClose() {
        Animated.timing(this.state.translatePosY, {
            toValue: 250,
            duration: 200,
            easing: Easing.ease
        }).start(() => {
            this.setState({
                keyboardShow: false
            }, () => {
                this.props.onKeyboardDidHide instanceof Function && this.props.onKeyboardDidHide();
            });
        });
    }

    _onShow() {
        Animated.timing(this.state.translatePosY, {
            toValue: 0,
            duration: 200,
            easing: Easing.ease
        }).start(() => {
            this.props.onKeyboardDidShow instanceof Function && this.props.onKeyboardDidShow();
        });
    }

    _keyboardPress(id) {
        this.props.onKeyPress instanceof Function && this.props.onKeyPress(id);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {keyboardShow, keyboardType} = this.state;
        return (
            <Modal
                onRequestClose={this._onRequestClose.bind(this)}
                onShow={this._onShow.bind(this)}
                visible={keyboardShow}
                transparent={true}
                animationType={'none'}>
                <View style={Styles.wrap}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{flex: 1, width}}
                        onPress={this._onRequestClose.bind(this)}/>
                    <Animated.View style={[Styles.keyboardWrap, {transform: [{translateY: this.state.translatePosY}]}]}>
                        <View style={[Styles.container, {
                            borderTopWidth: pixel,
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
                </View>
            </Modal>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    keyboardWrap: {
        width,
        height: 240,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: HBStyle.color.common_gray_fa
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: pixel,
        borderBottomColor: '#d2d2d2'
    },
    section: {
        flex: 1,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: pixel,
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