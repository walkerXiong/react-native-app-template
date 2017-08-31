/**
 * Created by hebao on 2017/5/11.
 */
import Util from '../utility/util';
const HBStyle = {
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

        //键盘按钮色
        common_gray_bg: '#EFEFEF',
        common_gray_fa: '#FAFAFA',

        common_gray_line: '#EAEAEA',//分割线、衬线
        common_gray_press: '#F2F2F2',//列表项的按下颜色
        common_green_status: '#41C557',//绿色状态色
        common_green_item_bg: '#83de8b',//我的投资还款进度条背景、投资列表还款圆、投资详情还款圆

        text_red_w:'#F85F30',//金额文字主题色
        text_black_w: '#000000',//黑色文字、主要内容
        text_gray_w_main: '#B8B8B8',//灰色文字、副标题、副文
        text_white_w: '#FFFFFF',//白色文字
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
export default HBStyle;