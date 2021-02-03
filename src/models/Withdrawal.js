import * as api from '../service/Api';

export default {
  namespace: 'withdrawal',

  state: {
    list: {},
    usdt: null,
    fil: null,
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.withdrawalList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *audit({ payload }, { call }) {
      return yield call(api.withdrawalAudit, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.withdrawalExport, payload);
    },

    *usdtBalance({ payload }, { call, put }) {
      const data = yield call(api.withdrawalUSDTBalance, payload);
      yield put({ type: 'usdt', payload: { data: data } });
    },

    *filBalance({ payload }, { call, put }) {
      const data = yield call(api.withdrawalFILBalance, payload);
      yield put({ type: 'fil', payload: { data: data } });
    },

    *exportFILTxt({ payload }, { call }) {
      return yield call(api.withdrawalExportFILTxt, payload);
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

    fil(state, { payload: { data } }) {
      return {
        ...state,
        fil: data,
      };
    },
  },
};
