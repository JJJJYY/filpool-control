import * as api from '../service/Api';

export default {
  namespace: 'agentWithdrawal',

  state: {
    list: {},
    usdt: null,
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.agentWithdrawalList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *audit({ payload }, { call }) {
      return yield call(api.agentWithdrawalAudit, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.agentWithdrawalExport, payload);
    },

    *usdtBalance({ payload }, { call, put }) {
      const data = yield call(api.agentWithdrawalUSDTBalance, payload);
      yield put({ type: 'usdt', payload: { data: data } });
    },

    *exportFILTxt({ payload }, { call }) {
      return yield call(api.agentWithdrawalExportFILTxt, payload);
    },

    *checkHash({ payload }, { call }) {
      return yield call(api.agentWithdrawalCheckHash, payload);
    },
  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      };
    },

    usdt(state, { payload: { data } }) {
      return {
        ...state,
        usdt: data,
      };
    },
  },
};
