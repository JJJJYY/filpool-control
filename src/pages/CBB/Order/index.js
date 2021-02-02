import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import { Select, Tag } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '单号',
      dataIndex: 'pid',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '商品名称',
      dataIndex: 'tittle',
    },
    {
      title: '币种',
      dataIndex: 'pay_coin',
    },
    {
      title: '投资金额',
      dataIndex: 'amount',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '预期年化',
      dataIndex: 'expected_earning_rate',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '预期利息',
      dataIndex: 'expected_interest',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '预计DFL奖励',
      dataIndex: 'expected_award_defi_rate',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        switch (text) {
          case 1:
            return <Tag color="green">进行中</Tag>;
          case 2:
            return <Tag color="blue">转让中</Tag>;
          case 3:
            return <Tag color="black">已转让</Tag>;
          case 4:
            return <Tag color="black">已到期</Tag>;
        }
      },
    },
    {
      title: '付款状态',
      dataIndex: 'payment_status',
      render(text) {
        switch (text) {
          case 0:
            return <Tag color="black">未付款</Tag>;
          case 1:
            return <Tag color="green">已付款</Tag>;
          case 2:
            return <Tag color="black">付款失败</Tag>;
          case 3:
            return <Tag color="black">拒绝</Tag>;
        }
      },
    },
    {
      title: '购买时间',
      dataIndex: 'purchase_time',
    },
    {
      title: '预期到期时间',
      dataIndex: 'expected_end_time',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'cbbUserOrders/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  render() {
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
            { label: '单号', name: 'pid' },
            { label: '账号', name: 'account' },
            {
              label: '状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={1}>进行中</Option>
                  <Option value={2}>转让中</Option>
                  <Option value={3}>已转让</Option>
                  <Option value={4}>已到期</Option>
                </Select>
              ),
            },
            {
              label: '付款状态',
              name: 'payment_status',
              custom: (
                <Select>
                  <Option value={0}>未付款</Option>
                  <Option value={1}>已付款</Option>
                  <Option value={2}>付款失败</Option>
                  <Option value={3}>拒绝</Option>
                </Select>
              ),
            },
          ]}
        />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
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
    data: state.cbbUserOrders.list,
    listLoading: state.loading.effects['cbbUserOrders/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
