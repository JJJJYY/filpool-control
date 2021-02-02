import * as api from '../service/Api';

export default {
  namespace: 'cbbProductConfig',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.cbbProductConfigList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.cbbProductConfigUpdate, payload);
    },

    *add({ payload }, { call }) {
      return yield call(api.cbbProductConfigAdd, payload);
    },

    *delete({ payload }, { call }) {
      return yield call(api.cbbProductConfigDelete, payload);
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
