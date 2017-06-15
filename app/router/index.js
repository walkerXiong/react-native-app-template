/**
 * Created by hebao on 2017/5/27.
 */
import {StackNavigator} from 'react-navigation';
import {Android_Default, Horizontal_RToL_withoutScale, Horizontal_RToL_withScale, FadeIn} from './transitionConfig';

import MainScreen from '../testView/mobxTest';
import RouterTestPage from '../testView/routerTestPage';
export const MainApp = StackNavigator({
    Main: {screen: MainScreen},
    NextPage: {screen: RouterTestPage}
}, {
    headerMode: 'none',
    navigationOptions: {gesturesEnabled: true},
    transitionConfig: Horizontal_RToL_withoutScale
});