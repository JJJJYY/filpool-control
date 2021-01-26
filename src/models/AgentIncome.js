import * as api from '../service/Api';

export default {
  namespace: 'agentIncome',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.agentIncomeList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *export({ payload }, { call }) {
      return yield call(api.agentIncomeExport, payload);
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
