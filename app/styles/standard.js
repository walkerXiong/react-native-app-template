/**
 * Created by hebao on 2018/3/22.
 */
import {Platform} from 'react-native'
import CommonSize from '../utility/size'
const {width, height} = CommonSize.screen

let standard_ios = {
  /**字体大小**/
  font: {
    Title1: 30,
    Title2: 20,
    Title3: 18,
    Title4: 17,

    Subtle1: 16,
    Subtle2: 15,

    Body1: 14,
    Body2: 13,

    Small1: 12,
    Small2: 11,

    /**列表项文字字号**/
    DL1: 16,
    DL2: 14,
    DL3: 13,
    DL4: 12,

    SL1: 16,
    SL2: 14,

    CL1: 16,
    CL2: 14,

    EL1: 16,
    EL2: 14,

    /**按钮文字字号**/
    btn_l: 17,
    btn_m: 16,
    btn_s: 13,
    btn_xs: 14,
    wbtn_l: 16,//纯文字按钮-大
    wbtn_s: 13,//纯文字按钮-小
    btn_bottom: 17,
    btn_input: 12,
  },
  /**颜色值**/
  color: {
    /**app通用色**/
    gray_bg: '#f7f7f7',
    white_bg: '#ffffff',
    gray_line: '#eaeaea',
    gray_press: '#f2f2f2',
    white_bar: '#fafafa',
    white_nvg: '#ffffff',
    yellow_main: '#ffc040',
    red_main: '#ff6446',
    green_status: '#41c557',
    green_itembg: '#83de8b',
    gray_status: '#d9d9d9',

    /**app文字色**/
    wwhite: '#ffffff',
    wgray_main: '#b8b8b8',
    wgray_sub: '#d9d9d9',
    wgray_bar: '#aaaaaa',
    wblack: '#000000',
    wred: '#f85f30',
    worange: '#ffad2c',
    wgreen: '#41c557',
    wwhite_alpha: '#ffffff',

    /**app按钮色**/
    btny: '#ffba00',
    btny_p: '#feb23a',
    btny_d: '#ffe1a4',
    btnr: '#ff6446',
    btnr_p: '#ff533c',
    btnr_d: '#ffc8bd',

    /**5.0之前版本兼容**/
    btn_d: '#ffc8bd',

    common_gray_bg: '#EFEFEF',
    common_gray_fa: '#FAFAFA',

    common_gray_line: '#EAEAEA',//分割线、衬线
    common_gray_press: '#F2F2F2',//列表项的按下颜色
    common_green_status: '#41C557',//绿色状态色
    common_green_item_bg: '#83de8b',//我的投资还款进度条背景、投资列表还款圆、投资详情还款圆

    text_red_w: '#F85F30',//金额文字主题色
    text_black_w: '#000000',//黑色文字、主要内容
    text_gray_w_main: '#B8B8B8',//灰色文字、副标题、副文
    text_white_w: '#FFFFFF',//白色文字
  },
  /**按钮类型**/
  button: {
    btn_l: {
      height: 44,
      borderRadius: 22,
      width: width - 24,
      marginHorizontal: 12,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_m: {
      height: 36,
      borderRadius: 18,
      width: 180,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_s: {
      height: 34,
      borderRadius: 17,
      minWidth: 115,
      paddingHorizontal: 12,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_xs: {
      height: 36,
      borderRadius: 18,
      width: 110,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_bottom: {
      height: 44,
      width: width,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_input: {
      width: 68,
      height: 25,
      borderRadius: 12,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  /**间距规范**/
  gap: {
    gap_edge: 12,
    gap_item: 15,
    gap_category: 30,
    gap_section: 15,
    h_list: 44,
  },

  /**自定义通用UI组件**/
  /**头栏**/
  nav: {
    height: 44,
    nav_icon: 22,
    fontSize: 17,
  },
}

let standard_android = {
  /**字体大小**/
  font: {
    Title1: 31,
    Title2: 21,
    Title3: 19,
    Title4: 18,

    Subtle1: 17,
    Subtle2: 16,

    Body1: 15,
    Body2: 14,

    Small1: 13,
    Small2: 12,

    /**列表项文字字号**/
    DL1: 17,
    DL2: 15,
    DL3: 14,
    DL4: 13,

    SL1: 17,
    SL2: 15,

    CL1: 17,
    CL2: 15,

    EL1: 17,
    EL2: 15,

    /**按钮文字字号**/
    btn_l: 18,
    btn_m: 17,
    btn_s: 14,
    btn_xs: 15,
    wbtn_l: 17,//纯文字按钮-大
    wbtn_s: 14,//纯文字按钮-小
    btn_bottom: 18,
    btn_input: 13,
  },
  /**颜色值**/
  color: {
    /**app通用色**/
    gray_bg: '#f7f7f7',
    white_bg: '#ffffff',
    gray_line: '#eaeaea',
    gray_press: '#f2f2f2',
    white_bar: '#fafafa',
    white_nvg: '#ffffff',
    yellow_main: '#ffc040',
    red_main: '#ff6446',
    green_status: '#41c557',
    green_itembg: '#83de8b',
    gray_status: '#d9d9d9',

    /**app文字色**/
    wwhite: '#ffffff',
    wgray_main: '#b8b8b8',
    wgray_sub: '#d9d9d9',
    wgray_bar: '#aaaaaa',
    wblack: '#000000',
    wred: '#f85f30',
    worange: '#ffad2c',
    wgreen: '#41c557',
    wwhite_alpha: '#ffffff',

    /**app按钮色**/
    btny: '#ffba00',
    btny_p: '#feb23a',
    btny_d: '#ffe1a4',
    btnr: '#ff6446',
    btnr_p: '#ff533c',
    btnr_d: '#ffc8bd',

    /**5.0之前版本兼容**/
    btn_d: '#ffc8bd',

    common_gray_bg: '#EFEFEF',
    common_gray_fa: '#FAFAFA',

    common_gray_line: '#EAEAEA',//分割线、衬线
    common_gray_press: '#F2F2F2',//列表项的按下颜色
    common_green_status: '#41C557',//绿色状态色
    common_green_item_bg: '#83de8b',//我的投资还款进度条背景、投资列表还款圆、投资详情还款圆

    text_red_w: '#F85F30',//金额文字主题色
    text_black_w: '#000000',//黑色文字、主要内容
    text_gray_w_main: '#B8B8B8',//灰色文字、副标题、副文
    text_white_w: '#FFFFFF',//白色文字
  },
  /**按钮类型**/
  button: {
    btn_l: {
      height: 50,
      borderRadius: 25,
      width: width - 28,
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
    btn_xs: {
      height: 40,
      borderRadius: 20,
      width: 124,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_bottom: {
      height: 50,
      width: width,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_input: {
      width: 76,
      height: 28,
      borderRadius: 14,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  /**间距规范**/
  gap: {
    gap_edge: 14,
    gap_item: 16,
    gap_category: 34,
    gap_section: 16,
    h_list: 50,
  },

  /**自定义通用UI组件**/
  /**头栏**/
  nav: {
    height: 50,
    nav_icon: 24,
    fontSize: 18,
  },
}

let HBStyle = Platform.OS === 'android' ? standard_android : standard_ios
HBStyle.layout = {
  ccc: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ccfs: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ccfe: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cfsc: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cfsfs: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  cfsfe: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  cfec: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cfefs: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  cfefe: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  rcc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rcfs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  rcfe: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  rfsc: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  rfsfs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  rfsfe: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  rfec: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  rfefs: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  rfefe: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  rsbc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rsac: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  csbc: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

export default HBStyle