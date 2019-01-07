import * as service from '../services/bloggerService'
import {Calendar} from 'antd'

export default {

    namespace: 'blogger',

    state: {
        list: [],
        single: {},
        friends: [],
        weiboContent: [],
        tfidf: [],
        sexDistribution: [],
        locationDistribution: []
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

    effects: {
        *getList(action, { call, put }) {
            const list = yield call(service.getBloggers)
            const sexDistribution = yield call(service.getSexDistribution)
            const locationDistribution = yield call(service.getLocationDistribution)

            yield put({
                type: 'save',
                payload: {
                    list,
                    sexDistribution: sexDistribution[0].values,
                    locationDistribution: locationDistribution[0].values
                }
            });
        },
        *getSingle({ payload }, { call, put }) {
            const single = yield call(service.getBlogger, { id: payload.id })
            const friends = yield call(service.getBloggerFriends, { id: payload.id })
            const weiboContent = yield call(service.getBloggerWeiboContent, { id: payload.id })

            yield put({
                type: 'save',
                payload: {
                    single: single[0],
                    friends,
                    weiboContent: weiboContent.contents,
                    tfidf: weiboContent.tfidf
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
                            id: match[1]
                        }
                    })
                }
            })
        },
    },

};
