import * as api from '../service/Api';

export default {
  namespace: 'cbbUserOrders',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.cbbUserOrdersList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *show({ payload }, { call }) {
      return yield call(api.cbbUserOrdersShow, payload);
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
