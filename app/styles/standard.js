/**
 * Created by hebao on 2017/6/8.
 */
import Util from '../utility/util';
const StandardStyle = {
    color: {
        wred: '#f85f30',
        wblack: '#000000',
        wwhite: '#ffffff',
        worange: '#ffad2c',
        wgray_main: '#bebebe',
        yellow_main: '#ffc040',
        red_main: '#ff6446',
        wgray_sub: '#dfdfdf',
        gray_line: '#eaeaea',
        gray_bg: '#f9f9f9',
        white_bg: '#ffffff',

        btny: '#ffc040',
        btny_p: '#feb23a',
        btny_d: '#ffe1a4',
        btnr: '#ff6446',
        btnr_p: '#ff533c',
        btn_d: '#ffc8bd',

        gray_press: '#f2f2f2',
        common_gray_press: '#eaeaea',
        common_green_status: '#6975ea',
        common_green_item_bg: '#44b5ea',
        common_gray_line: '#eaeaea',

        text_black_w: '#000000',
        text_gray_w_main: '#dfdfdf',
        text_red_w: '#ff00ff',
        text_white_w: '#ffffff',
    },
    gap: {
        gap_edge: 14,
        gap_item: 16,
    },
    size: {
        h_list: 50
    },
    button: {
        btn_l: {
            height: 50,
            borderRadius: 25,
            width: Util.size.screen.width - 28,
            marginHorizontal: 14,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn_m: {
            height: 40,
            borderRadius: 20,
            width: 200,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn_s: {
            height: 38,
            borderRadius: 19,
            minWidth: 130,
            paddingHorizontal: 14,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        btn_input: {
            width: 76,
            height: 28,
            borderRadius: 6,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }
    },
};
export default StandardStyle;