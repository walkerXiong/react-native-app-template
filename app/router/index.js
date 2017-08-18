/**
 * Created by hebao on 2017/5/27.
 */
import {StackNavigator} from 'react-navigation';
import {FadeToTheLeft} from './transitionConfig';

import MainScreen from '../testView/mobxTest';
import RouterTestPage from '../testView/routerTestPage';
export const MainApp = StackNavigator({
    Main: {screen: MainScreen},
    NextPage: {screen: RouterTestPage}
}, {
    headerMode: 'none',
    navigationOptions: {gesturesEnabled: true},
    transitionConfig: FadeToTheLeft
});