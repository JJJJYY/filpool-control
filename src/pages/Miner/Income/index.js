import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
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
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '期数',
      dataIndex: 'number',
      render: (text) => (
        <div>{text}期</div>
      ),
    }, {
      title: '总数',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '释放初始值',
      dataIndex: 'release_quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '资产类型',
      dataIndex: 'asset',
    }, {
      title: '类型',
      dataIndex: 'type',
      render(text) {
        return (
          <div>{['SR1奖励', '挖矿收益', '赠送/补收益', '加速收益'][text - 1]}</div>
        );
      }
    }, {
      title: '手续费',
      dataIndex: 'service_charge',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    }, {
      title: '开始时间',
      dataIndex: 'start_time',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'income/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' },
          {
            label: '期数', name: 'number',
            custom: (
              <Select>
                <Option value={1}>1期</Option>
                <Option value={2}>2期</Option>
              </Select>
            )
          }, {
            label: '类型', name: 'type',
            custom: (
              <Select>
                <Option value={1}>SR1奖励</Option>
                <Option value={2}>挖矿收益</Option>
                <Option value={3}>赠送/补收益</Option>
                <Option value={4}>加速收益</Option>
              </Select>
            )
          }, {
            label: '日期', name: 'time',
            custom: (
              <DatePicker.RangePicker />
            )
          }]
        } />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'income/export',
            payload: {
              page: page,
              count: count,
              search: search ? JSON.stringify(search) : null,
              all: all,
            },
          });
        }} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          rowKey="id"
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.income.list,
    listLoading: state.loading.effects['income/queryList'],
  };
}

export default connect(mapStateToProps)(Page);