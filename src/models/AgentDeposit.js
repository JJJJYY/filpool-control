import * as api from '../service/Api';

export default {
  namespace: 'agentDeposit',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.agentDepositList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *export({ payload }, { call }) {
      return yield call(api.agentDepositExport, payload);
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
