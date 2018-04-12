import {observable} from 'mobx';

let Routers = observable({
    @observable navSwitch: null,
    @observable navStack: null
});

export default Routers;