import React, { Component } from 'react';
import { Select } from 'antd';
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
      render: (text, record) => (
        <div>
          {text}（{record.agent_name}）
        </div>
      ),
    },
    {
      title: '当日产出',
      dataIndex: 'quantity',
      render: (text, record) => (
        <div>
          {Number(parseFloat(text) + parseFloat(record.service_charge)).toFixed(
            6,
          )}
        </div>
      ),
    },
    {
      title: '算力收益',
      dataIndex: 'quantity',
      render: text => <div>{parseFloat(text).toFixed(6)}</div>,
    },
    {
      title: '75%锁仓',
      dataIndex: 'release_quantity',
      render: text => <div>{parseFloat(text).toFixed(6)}</div>,
    },
    {
      title: '25%立即释放',
      dataIndex: 'release_quantity',
      render: (text, record) => (
        <div>
          {Number(parseFloat(record.quantity) - parseFloat(text)).toFixed(6)}
        </div>
      ),
    },
    {
      title: '技术服务费',
      dataIndex: 'service_charge',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '资产类型',
      dataIndex: 'asset',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render(text) {
        return (
          <div>
            {
              ['SR1奖励', '挖矿收益', '赠送/补收益', '加速收益', '代理奖励'][
                text - 1
              ]
            }
          </div>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'agentIncome/queryList',
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
            { label: '用户账号', name: 'account' },
            {
              label: '类型',
              name: 'type',
              custom: (
                <Select>
                  <Option value={1}>SR1奖励</Option>
                  <Option value={2}>挖矿收益</Option>
                  <Option value={3}>赠送/补收益</Option>
                  <Option value={4}>加速收益</Option>
                </Select>
              ),
            },
          ]}
        />
        <OperationGroup
          onExport={all => {
            this.props.dispatch({
              type: 'agentIncome/export',
              payload: {
                page: page,
                count: count,
                search: search ? JSON.stringify(search) : null,
                all: all,
              },
            });
          }}
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
    data: state.agentIncome.list,
    listLoading: state.loading.effects['agentIncome/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
