/**
 * Created by hebao on 2017/6/13.
 */
import React, {Component, PropTypes} from 'react';
import {
    View,
    Modal,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import Util from '../../utility/util';
import * as KBEvent from './KBEvent';

const debugKeyWord = '[SecuredPayKeyboard]';
export default class SecuredPayKeyboard extends Component {
    _keyboardHandle = -1;

    constructor(props) {
        super(props);
        this.state = {
            keyboardShow: false,
        }
    }

    componentDidMount() {
        this._keyboardHandle = Util.addListener(KBEvent.ACTION_SECURED_KEYBOARD_SHOW, (show) => {
            this.setState({keyboardShow: show});
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
        Util.removeListener(this._keyboardHandle);
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        return (
            <Modal
                visible={this.state.keyboardShow}
                animationType={'slide'}
                transparent={true}
                hardwareAccelerated={true}
                onRequestClose={}
                onShow={() => null}>

            </Modal>
        );
    }
}