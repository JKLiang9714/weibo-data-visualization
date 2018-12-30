import * as service from '../services/bloggerService'

export default {

    namespace: 'blogger',

    state: {
        list: [],
        single: {},
        friends: [],
        weiboContent: []
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
        *getSingle({ payload }, { call, put }) {
            const single = yield call(service.getBlogger, { name: payload.name })
            const friends = yield call(service.getBloggerFriends, { name: payload.name })
            const weiboContent = yield call(service.getBloggerWeiboContent, { name: payload.name })

            yield put({
                type: 'save',
                payload: {
                    single,
                    friends,
                    weiboContent,
                }
            });
        },
    },

    subscriptions: {
        init({ dispatch }) {
            dispatch({ type: "getList" })
        },
        setup({ dispatch, history }) {  // eslint-disable-line
            return history.listen(({ pathname }) => {
                // 当前path在deploy
                const regex = /^\/bloggers\/(.+)$/
                const match = regex.exec(pathname)
                if (match) {
                    dispatch({
                        type: "getSingle",
                        payload: {
                            name: match[1]
                        }
                    })
                }
            })
        },
    },

};