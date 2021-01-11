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
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '期数',
      dataIndex: 'number',
      render: text => <div>{text}期</div>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
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
              [
                '购买算力',
                '申请加速包',
                '充值',
                '提现',
                '提现中',
                '收益->充值',
                '充值->收益',
                '内部转出',
                '内部转入',
                '借币本息',
                '还贷',
                '返佣',
                '系统充币',
                '活动奖励',
                '系统提币',
                '兑换',
                '收益释放',
                '系统扣除',
                '补款',
                '冻结款扣除',
                '25%收益释放',
                '自动质押划转',
                '质押返还',
                '挖矿收益',
                'SR质押币发放',
                '扣除质押币',
                '充值->质押',
                '释放至质押',
                '加速收益',
                '25%加速收益释放',
                '加速收益释放',
                '借贷质押',
                '未知',
              ][text - 1]
            }
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="blue">提现中</Tag>,
                <Tag color="green">成功</Tag>,
                <Tag color="black">拒绝</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'create_time',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    var s = search ? search : {};
    s.asset = 'FIL';
    s.type = s.type ? s.type : [17, 21, 31, 30];
    this.props.dispatch({
      type: 'balanceModify/queryList',
      payload: {
        page: page,
        count: count,
        search: s,
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
              label: '期数',
              name: 'number',
              custom: (
                <Select>
                  <Option value={'1'}>1期</Option>
                  <Option value={'2'}>2期</Option>
                </Select>
              ),
            },
            {
              label: '类型',
              name: 'type',
              custom: (
                <Select>
                  <Option value={17}>收益释放</Option>
                  <Option value={21}>25%收益释放</Option>
                  <Option value={31}>加速收益释放</Option>
                  <Option value={30}>25%加速收益释放</Option>
                </Select>
              ),
            },
            {
              label: '日期',
              name: 'time',
              custom: <DatePicker.RangePicker />,
            },
          ]}
        />
        <OperationGroup
          onExport={all => {
            this.props.dispatch({
              type: 'balanceModify/export',
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
    data: state.balanceModify.list,
    listLoading: state.loading.effects['balanceModify/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
