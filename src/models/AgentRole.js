import * as api from '../service/Api';

export default {
  namespace: 'agentRole',

  state: {},

  effects: {
    *add({ payload }, { call }) {
      return yield call(api.agentRoleAdd, payload);
    },
  },

  reducers: {},
};
