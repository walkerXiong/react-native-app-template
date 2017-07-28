/**
 * Created by hebao on 2017/7/26.
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Image,
    ScrollView
}from 'react-native';
import Util from '../utility/util';

const debugKeyWord = '[FullImageWithScroll]';

export default class FullImageWithScroll extends Component {
    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.shape({
                uri: PropTypes.string,
                headers: PropTypes.objectOf(PropTypes.string),
            }),
            // Opaque type returned by require('./image.jpg')
            PropTypes.number,
            // Multiple sources
            PropTypes.arrayOf(
                PropTypes.shape({
                    uri: PropTypes.string,
                    width: PropTypes.number,
                    height: PropTypes.number,
                }))
        ]).isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        let {width} = Util.size.screen;
        this.state = {
            width: width,
            height: props.height / props.width * width
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        Util.log(debugKeyWord + 'render!!!');
        let {width, height} = this.state;
        return (
            <ScrollView
                style={Styles.wrap}
                showsVerticalScrollIndicator={false}>
                <Image
                    style={{width: width, height: height}}
                    resizeMode={'cover'}
                    fadeDuration={0}
                    source={this.props.source}>
                </Image>
            </ScrollView>
        );
    }
}

const Styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});