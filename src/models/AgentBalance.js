import * as api from '../service/Api';

export default {
  namespace: 'agentBalance',

  state: {},

  effects: {
    *exchange({ payload }, { call }) {
      return yield call(api.agentBalanceExchange, payload);
    },
  },

  reducers: {},
};
