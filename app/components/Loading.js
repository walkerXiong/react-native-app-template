/**
 * Created by DELL on 2016/11/16.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Modal
} from 'react-native';

import Util from '../utility/util';
import FrameAnimation from './FrameAnimation';
import * as ACTIONS from '../utility/events';

class LoadingActivity extends Component {
    _DeviceEventEmitter = null;
    _overTimeHandle = -1;
    _overTimeCount = 30000;//30s超时

    _sprite = [
        require('../res/test/animation_loading00.png'),
        require('../res/test/animation_loading01.png'),
        require('../res/test/animation_loading02.png'),
        require('../res/test/animation_loading03.png'),
        require('../res/test/animation_loading04.png'),
        require('../res/test/animation_loading05.png'),
        require('../res/test/animation_loading06.png'),
        require('../res/test/animation_loading07.png'),
        require('../res/test/animation_loading08.png'),
        require('../res/test/animation_loading09.png'),
        require('../res/test/animation_loading10.png'),
        require('../res/test/animation_loading11.png'),
        require('../res/test/animation_loading12.png'),
        require('../res/test/animation_loading13.png'),
        require('../res/test/animation_loading14.png'),
        require('../res/test/animation_loading15.png'),
    ];

    constructor(props) {
        super(props);
        this.state = {
            isLoadingDone: true,
        }
    }

    componentDidMount() {
        this._DeviceEventEmitter = Util.addListener(ACTIONS.ACTION_LOADING_DONE, (done) => {
            this.setState({isLoadingDone: done.done});
            clearTimeout(this._overTimeHandle);
            if (!done.done) {
                this._overTimeHandle = setTimeout(() => {
                    this.setState({isLoadingDone: true}, () => {
                        Util.toast.show('网络加载超时，请检查网络！');
                    });
                }, done.overTime ? done.overTime : this._overTimeCount);
            }
        });
    }

    componentWillUnmount() {
        clearTimeout(this._overTimeHandle);
        Util.removeListener(this._DeviceEventEmitter);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoadingDone !== this.state.isLoadingDone;
    }

    onRequestClose() {
        clearTimeout(this._overTimeHandle);
        this.setState({isLoadingDone: true});
    }

    render() {
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={!this.state.isLoadingDone}
                onRequestClose={() => this.onRequestClose()}
                onShow={() => null}>
                <View style={Styles.wrap}>
                    <View style={Styles.loading}>
                        <FrameAnimation
                            fps={20}
                            sprite={this._sprite}
                            width={112}
                            height={56}/>
                        <Text style={Styles.font} numberOfLines={1}>{this.props.font || '加载中...'}</Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        width: 171,
        height: 171,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 30
    },
    font: {
        marginTop: 10,
        fontSize: 15,
        textAlign: 'center',
        color: '#B8B8B8'
    }
});

export default LoadingActivity;