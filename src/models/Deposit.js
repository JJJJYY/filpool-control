import * as api from '../service/Api';

export default {
  namespace: 'deposit',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.depositList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *export({ payload }, { call }) {
      return yield call(api.depositExport, payload);
    },

  },

  reducers: {
    list(state, { payload: {data} }) {
      return {
        ...state,
        list: data,
      }
    },
    
  },
}