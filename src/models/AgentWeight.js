import * as api from '../service/Api';

export default {
  namespace: 'agentWeight',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.agentWeightList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.agentWeightAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.agentWeightUpdate, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.agentWeightExport, payload);
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
