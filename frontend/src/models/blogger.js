import * as service from '../services/bloggerService'

export default {

    namespace: 'blogger',

    state: {
        list: [],
        single: {}
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

    effects: {
        *getList(action, { call, put }) {
            const list = yield call(service.getBloggers)
            yield put({
                type: 'save',
                payload: {
                    list
                }
            });
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
            return history.listen(({ pathname }) => {
                // 当前path在deploy
                dispatch({ type: "getList" })
            })
        },
    },

};