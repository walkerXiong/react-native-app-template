/**
 * Created by hebao on 2017/5/12.
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    BackHandler,
    DeviceEventEmitter,
    Animated,
    ViewPropTypes
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

import Util from '../../utility/util';
const debugKeyWord = '[SecuredPayKeyboard]';
export default class SecuredPayKeyboard extends Component {
    _hardwareBackPressHandle = null;//物理返回键监听句柄
    _hardwareBackPress = null;//安卓物理返回键案件回调函数
    _dot_1 = null;
    _dot_2 = null;
    _dot_3 = null;
    _dot_4 = null;
    _dot_5 = null;
    _dot_6 = null;

    static defaultProps = {
        visible: false,//modal是否显示
        springOption: {
            velocity: 3,
            friction: 10
        },//弹框摩擦选项
        allowHardwareBackHideModal: true,//是否允许安卓返回键隐藏Modal
        hardwareBackPress: null,//自定义响应安卓硬件返回键
        shadeStartOpacity: 0,//背景蒙层一开始出现的透明度
        shadeEndOpacity: 0.75,//背景蒙层的透明度
        initScale: 0.9,//初始放大的倍数
        animationDuration: 200,//显示完整Modal的时间
        tapBackToHide: true,//点击其他区域是否关闭弹框
        onRequestToClose: () => null,//关闭Modal的唯一途径只有通过props.visible来关闭，此回调函数就是用于父组件更新props.visible，并且此属性isRequired
        modalDidClose: null,//Modal关闭时候的回调函数
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            value: '',//键盘输入的值
            pwMaxLength: 6,//安全键盘输入密码的最长长度
            shadeOpacity: new Animated.Value(props.shadeStartOpacity),
            currScale: new Animated.Value(props.initScale),
            translatePosY: new Animated.Value(300),
            translatePosX: new Animated.Value(0),
            pwScale_1: new Animated.Value(1),
            pwScale_2: new Animated.Value(1),
            pwScale_3: new Animated.Value(1),
            pwScale_4: new Animated.Value(1),
            pwScale_5: new Animated.Value(1),
            pwScale_6: new Animated.Value(1),
        };
    }

    componentDidMount() {
        let {hardwareBackPress} = this.props;
        this._hardwareBackPress = hardwareBackPress instanceof Function ? hardwareBackPress : this.hardwareBackPress.bind(this);
        this._hardwareBackPressHandle = BackHandler.addEventListener('hardwareBackPress', this._hardwareBackPress);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if ((nextProps.visible === true || nextProps.visible === false) && nextProps.visible !== this.props.visible) {
            nextProps.visible === true ? this.modalShow() : this.modalHide();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.visible === false) {
            return nextState.visible !== this.state.visible;
        }
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        this._hardwareBackPressHandle.remove();
    }

    modalShow() {
        if (this.state.visible === false) {
            this.setState({
                visible: true
            }, () => {
                let {shadeEndOpacity, animationDuration, springOption} = this.props;
                Animated.spring(this.state.currScale, {
                    toValue: 1,
                    duration: animationDuration,
                    ...springOption
                }).start();
                Animated.timing(this.state.shadeOpacity, {
                    toValue: shadeEndOpacity,
                    duration: animationDuration
                }).start();
                Animated.timing(this.state.translatePosY, {
                    toValue: 0,
                    duration: animationDuration,
                }).start();
            });
        }
    }

    modalHide() {
        if (this.state.visible === true) {
            let {animationDuration, shadeStartOpacity, initScale, modalDidClose} = this.props;
            //Animated.parallel() callback exec will delay little time , usually is 600ms , so abort it.
            Animated.spring(this.state.currScale, {
                toValue: initScale,
                duration: animationDuration,
            }).start();
            Animated.timing(this.state.translatePosY, {
                toValue: 300,
                duration: animationDuration,
            }).start();
            Animated.timing(this.state.shadeOpacity, {
                toValue: shadeStartOpacity,
                duration: animationDuration
            }).start(() => {
                this.state.value = '';
                this._pwScale(0);
                this.state.translatePosX.setValue(0);
                this.setState({visible: false}, () => {
                    modalDidClose instanceof Function && modalDidClose();
                });
            });
        }
    }

    hardwareBackPress() {
        if (this.state.visible) {
            if (this.props.allowHardwareBackHideModal) {
                this.props.onRequestToClose();
            }
            return true;
        }
        return false;
    }

    tapBackToHide() {
        let {tapBackToHide, onRequestToClose} = this.props;
        if (tapBackToHide) onRequestToClose();
    }

    _verifyPassword() {
        let {animationDuration} = this.props;
        Animated.timing(this.state.translatePosX, {
            toValue: -Util.size.screen.width,
            duration: animationDuration,
        }).start();
    }

    _pwScale(id) {
        let _i = 0;
        if (id == 0) {
            for (_i = 1; _i <= this.state.pwMaxLength; _i++) {
                this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#eaeaea'}});
            }
        }
        else {
            for (_i = 1; _i <= this.state.pwMaxLength; _i++) {
                _i <= id ? this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#ffe341'}}) : this['_dot_' + _i].setNativeProps({style: {backgroundColor: '#eaeaea'}});
            }
            Animated.timing(this.state['pwScale_' + id], {
                toValue: 1.2,
                duration: 100,
            }).start(() => {
                Animated.timing(this.state['pwScale_' + id], {
                    toValue: 1,
                    duration: 100,
                }).start(() => {
                    id == this.state.pwMaxLength ? this._verifyPassword() : null;
                });
            });
        }
    }

    _keyboardPress(id) {
        if (this.state.value.length >= this.state.pwMaxLength && id !== 'delete') return;
        if (id !== 'delete') {
            this.state.value += id;
        }
        else {
            this.state.value = this.state.value.substring(0, this.state.value.length - 1);
        }
        Util.log(debugKeyWord + '_keyboardPress==value:' + this.state.value);
        this._pwScale(this.state.value.length);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <View style={[Styles.wrap, {transform: [{translateY: this.state.visible ? 0 : 10000}]}]}>
                <Animated.View
                    style={[Styles.wrap, {opacity: this.state.shadeOpacity, backgroundColor: 'rgba(0,0,0,0.9)'}]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.tapBackToHide()} style={Styles.wrap}/>
                </Animated.View>
                <Animated.View
                    style={[Styles.container, {
                        opacity: this.state.shadeOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1]
                        })
                    }]}>
                    <Animated.View
                        style={[Styles.headerWrap, {
                            transform: [{scale: this.state.currScale}],
                            opacity: this.state.shadeOpacity.interpolate({
                                 inputRange: [0, 1],
                                 outputRange: [0, 1]
                            })
                        }]}>
                        <Text style={{fontSize: 18, marginVertical: 10}}>10000</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Animated.View
                                ref={(ref) => this._dot_1 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_1}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_2 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_2}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_3 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_3}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_4 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_4}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_5 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_5}]}]}/>
                            <Animated.View
                                ref={(ref) => this._dot_6 = ref}
                                style={[Styles.dot, {transform: [{scale: this.state.pwScale_6}], marginRight: 0}]}/>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[Styles.keyboardWrap, {transform: [{translateY: this.state.translatePosY},{translateX: this.state.translatePosX}]}]}>
                        <View style={Styles.keyboardZone}>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(1)}
                                    style={[Styles.section]}>
                                    <Text>1</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(2)}
                                    style={[Styles.section]}>
                                    <Text>2</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(3)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>3</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(4)}
                                    style={[Styles.section]}>
                                    <Text>4</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(5)}
                                    style={[Styles.section]}>
                                    <Text>5</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(6)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>6</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(7)}
                                    style={[Styles.section]}>
                                    <Text>7</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(8)}
                                    style={[Styles.section]}>
                                    <Text>8</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(9)}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>9</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={[Styles.keyboardContainer,{borderBottomWidth: 0}]}>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#ffffff'}
                                    style={[Styles.section]}>
                                    <Text>{'secure'}</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress(0)}
                                    style={[Styles.section]}>
                                    <Text>0</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    activeOpacity={1}
                                    underlayColor={'#eaeaea'}
                                    onPress={()=>this._keyboardPress('delete')}
                                    style={[Styles.section, {borderRightWidth: 0}]}>
                                    <Text>delete</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <View style={Styles.keyboardZone}>
                            <Text>verifying...</Text>
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

SecuredPayKeyboard.propTypes = {
    visible: PropTypes.bool,
    springOption: PropTypes.object,
    allowHardwareBackHideModal: PropTypes.bool,
    hardwareBackPress: PropTypes.func,
    shadeStartOpacity: PropTypes.number,
    shadeEndOpacity: PropTypes.number,
    initScale: PropTypes.number,
    animationDuration: PropTypes.number,
    tapBackToHide: PropTypes.bool,
    onRequestToClose: PropTypes.func.isRequired,
    modalDidClose: PropTypes.func,
};

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff'
    },
    headerWrap: {
        width: Util.size.screen.width,
        height: 100,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    keyboardWrap: {
        width: Util.size.screen.width * 2,
        height: 280,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    keyboardZone: {
        width: Util.size.screen.width,
        height: 280,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: Util.size.screen.pixel,
        borderColor: '#eaeaea'
    },
    keyboardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: Util.size.screen.pixel,
        borderColor: '#eaeaea'
    },
    section: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: Util.size.screen.pixel,
        borderRightColor: '#eaeaea'
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#eaeaea',
        marginRight: 20
    }
});