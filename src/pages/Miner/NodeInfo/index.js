import React, { Component } from 'react';
import { Tag, Select, DatePicker } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };

  columns = [
    {
      title: '合作方',
      dataIndex: 'partner',
    },
    {
      title: '节点号',
      dataIndex: 'miner',
    },
    {
      title: '充币',
      dataIndex: 'top_up_coin_amount',
    },
    {
      title: '借币',
      dataIndex: 'lent_coin_amount',
    },
    {
      title: '有效算力',
      dataIndex: 'valid_power',
    },
    {
      title: '可用余额',
      dataIndex: 'available_balance',
    },
    {
      title: '质押余额',
      dataIndex: 'pledge_balance',
    },
    {
      title: '锁仓余额',
      dataIndex: 'lock_balance',
    },
    {
      title: '预提交余额',
      dataIndex: 'precommit_balance',
    },
    {
      title: '账户余额',
      dataIndex: 'account_balance',
    },
    {
      title: 'GAS',
      dataIndex: 'gas_fee',
    },
    {
      title: '24H GAS',
      dataIndex: 'gas_fee_24',
    },
    {
      title: '总收益',
      dataIndex: 'total_award',
    },
    {
      title: '24H 收益',
      dataIndex: 'reward_24',
    },
    {
      title: 'worker余额',
      dataIndex: 'worker_balance',
    },
    {
      title: '日期',
      dataIndex: 'time_node',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'dailyFilpoolMinerStatistics/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            this.state.page = 1;
            this.state.search = e;
            this.loadData();
          }}
          items={[
            { label: '节点号', name: 'miner' },
            {
              label: '日期',
              name: 'time',
              custom: <DatePicker.RangePicker />,
            },
          ]}
        />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          rowKey="id"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.dailyFilpoolMinerStatistics.list,
    listLoading: state.loading.effects['dailyFilpoolMinerStatistics/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
