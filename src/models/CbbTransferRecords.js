import * as api from '../service/Api';

export default {
  namespace: 'cbbTransferRecords',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.cbbTransferRecordsList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *audit({ payload }, { call }) {
      return yield call(api.cbbTransferRecordsAudit, payload);
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
