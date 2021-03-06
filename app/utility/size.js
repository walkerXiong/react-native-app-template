/**
 * Created by hebao on 2017/10/12.
 */
'use strict';
import {
    PixelRatio,
    StatusBar,
    Dimensions,
    Platform
} from 'react-native';

const {width, height} = Dimensions.get('window');//屏幕宽度
const minPixel = PixelRatio.get();

const fontScale = PixelRatio.getFontScale();
const statusBarHeight_android = StatusBar.currentHeight;

const size = (function countScreenSize() {
    let _width = width * minPixel;
    let _height = height * minPixel;
    if (_width <= 640 && _height <= 960) {
        return 1;//3.5英寸
    }
    else if (_width <= 640 && _height <= 1136) {
        return 2;//4.0英寸 i5 i5s i5c SE
    }
    else if (_width <= 750 && _height <= 1334) {
        return 3;//4.7英寸 i6 i6s i7 i8
    }
    else {
        return 4;//5.5英寸 i6p i6sp i7p i8p
    }
})();

const commonSize = {
    screen: {
        pixel: 1 / minPixel,//最小线宽
        pixelRatio: minPixel,
        width: width,//屏幕宽度
        height: height,//屏幕高度
        fontScale: fontScale,
        size: size
    },
    statusBar: {
        height: Platform.OS === 'android' ? statusBarHeight_android : 20//状态栏高度，iOS=20，安卓通过StatusBar获取
    },
    phoneModel: (model) => {
        /* android */

        if (Platform.OS === "android" || !model) return "iPhone 5";

        model = decodeURIComponent(model);

        /* iPhone */

        if (model === "iPhone1,1")    return "iPhone 2G";
        if (model === "iPhone1,2")    return "iPhone 3G";
        if (model === "iPhone2,1")    return "iPhone 3GS";
        if (model === "iPhone3,1")    return "iPhone 4 (GSM)";
        if (model === "iPhone3,2")    return "iPhone 4 (GSM/2012)";
        if (model === "iPhone3,3")    return "iPhone 4 (CDMA)";
        if (model === "iPhone4,1")    return "iPhone 4S";
        if (model === "iPhone5,1")    return "iPhone 5 (GSM)";
        if (model === "iPhone5,2")    return "iPhone 5 (Global)";
        if (model === "iPhone5,3")    return "iPhone 5c (GSM)";
        if (model === "iPhone5,4")    return "iPhone 5c (Global)";
        if (model === "iPhone6,1")    return "iPhone 5s (GSM)";
        if (model === "iPhone6,2")    return "iPhone 5s (Global)";
        if (model === "iPhone7,2")    return "iPhone 6";
        if (model === "iPhone7,1")    return "iPhone 6 Plus";
        if (model === "iPhone8,1")    return "iPhone 6s";
        if (model === "iPhone8,2")    return "iPhone 6s Plus";
        if (model === "iPhone8,4")    return "iPhone SE";
        if (model === "iPhone9,1")    return "iPhone 7 (Global)";
        if (model === "iPhone9,3")    return "iPhone 7 (GSM)";
        if (model === "iPhone9,2")    return "iPhone 7 Plus (Global)";
        if (model === "iPhone9,4")    return "iPhone 7 Plus (GSM)";
        if (model === "iPhone10,1")    return "iPhone 8";
        if (model === "iPhone10,2")    return "iPhone 8 Plus";
        if (model === "iPhone10,3")    return "iPhone X";
        if (model === "iPhone10,4")    return "iPhone 8";
        if (model === "iPhone10,5")    return "iPhone 8 Plus";
        if (model === "iPhone10,6")    return "iPhone X";

        /* iPad */

        if (model === "iPad1,1")      return "iPad 1";
        if (model === "iPad2,1")      return "iPad 2 (WiFi)";
        if (model === "iPad2,2")      return "iPad 2 (GSM)";
        if (model === "iPad2,3")      return "iPad 2 (CDMA)";
        if (model === "iPad2,4")      return "iPad 2 (Mid 2012)";
        if (model === "iPad3,1")      return "iPad 3 (WiFi)";
        if (model === "iPad3,2")      return "iPad 3 (CDMA)";
        if (model === "iPad3,3")      return "iPad 3 (GSM)";
        if (model === "iPad3,4")      return "iPad 4 (WiFi)";
        if (model === "iPad3,5")      return "iPad 4 (GSM)";
        if (model === "iPad3,6")      return "iPad 4 (Global)";

        /* iPad Air */

        if (model === "iPad4,1")      return "iPad Air (WiFi)";
        if (model === "iPad4,2")      return "iPad Air (Cellular)";
        if (model === "iPad4,3")      return "iPad Air (China)";
        if (model === "iPad5,3")      return "iPad Air 2 (WiFi)";
        if (model === "iPad5,4")      return "iPad Air 2 (Cellular)";

        /* iPad Mini */

        if (model === "iPad2,5")      return "iPad Mini (WiFi)";
        if (model === "iPad2,6")      return "iPad Mini (GSM)";
        if (model === "iPad2,7")      return "iPad Mini (Global)";
        if (model === "iPad4,4")      return "iPad Mini 2 (WiFi)";
        if (model === "iPad4,5")      return "iPad Mini 2 (Cellular)";
        if (model === "iPad4,6")      return "iPad Mini 2 (China)";
        if (model === "iPad4,7")      return "iPad Mini 3 (WiFi)";
        if (model === "iPad4,8")      return "iPad Mini 3 (Cellular)";
        if (model === "iPad4,9")      return "iPad Mini 3 (China)";
        if (model === "iPad5,1")      return "iPad Mini 4 (WiFi)";
        if (model === "iPad5,2")      return "iPad Mini 4 (Cellular)";

        /* iPad Pro */

        if (model === "iPad6,3")      return "iPad Pro (9.7 inch/WiFi)";
        if (model === "iPad6,4")      return "iPad Pro (9.7 inch/Cellular)";

        if (model === "iPad6,7")      return "iPad Pro (12.9 inch/WiFi)";
        if (model === "iPad6,8")      return "iPad Pro (12.9 inch/Cellular)";

        /* iPod */

        if (model === "iPod1,1")      return "iPod Touch 1G";
        if (model === "iPod2,1")      return "iPod Touch 2G";
        if (model === "iPod3,1")      return "iPod Touch 3G";
        if (model === "iPod4,1")      return "iPod Touch 4G";
        if (model === "iPod5,1")      return "iPod Touch 5G";
        if (model === "iPod7,1")      return "iPod Touch 6G";

        /* Simulator */

        if (model === "i386")         return "Simulator";
        if (model === "x86_64")       return "Simulator";
    }
};

export default commonSize;