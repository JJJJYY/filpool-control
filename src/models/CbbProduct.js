import * as api from '../service/Api';

export default {
  namespace: 'cbbProduct',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.cbbProductList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.cbbProductUpdate, payload);
    },

    *add({ payload }, { call }) {
      return yield call(api.cbbProductAdd, payload);
    },
  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      };
    },
  },
};
