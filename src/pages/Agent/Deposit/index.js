import React, { Component } from 'react';
import { Tag, Select } from 'antd';
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
      title: '单号',
      dataIndex: 'pid',
    },
    {
      title: '账号',
      dataIndex: 'account',
      render: (text, record) => (
        <div>
          {text}（{record.name}）
        </div>
      ),
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '币种',
      dataIndex: 'asset',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="black">取消</Tag>,
                <Tag color="green">完成</Tag>,
                <Tag color="blue">正在处理</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
    {
      title: '充值时间',
      dataIndex: 'create_time',
    },
    {
      title: '发送方',
      dataIndex: 'from_address',
    },
    {
      title: '接收方',
      dataIndex: 'address',
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'agentDeposit/queryList',
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
              label: '币种',
              name: 'asset',
              custom: (
                <Select>
                  <Option value="USDT">USDT</Option>
                  <Option value="ETH">ETH</Option>
                  <Option value="BTC">BTC</Option>
                  <Option value="FIL">FIL</Option>
                </Select>
              ),
            },
            { label: '哈希', name: 'hash' },
            {
              label: '处理状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>取消</Option>
                  <Option value={1}>完成</Option>
                  <Option value={2}>正在处理</Option>
                </Select>
              ),
            },
          ]}
        />
        <OperationGroup
          onExport={all => {
            this.props.dispatch({
              type: 'agentDeposit/export',
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
    data: state.agentDeposit.list,
    listLoading: state.loading.effects['agentDeposit/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
