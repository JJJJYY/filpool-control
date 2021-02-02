import React, { Component } from 'react';
import { InputNumber, Tag, Select, DatePicker } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    page: 1,
    count: 10,
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '订单号',
      dataIndex: 'pid',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '上级邀请人',
      dataIndex: 'up_user',
    },
    {
      title: '商品名称',
      dataIndex: 'related_name',
    },
    {
      title: '算力数量',
      dataIndex: 'quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '订单金额',
      dataIndex: 'payment_quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '支付方式',
      dataIndex: 'asset',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render(text) {
        var name = '其他';
        switch (text) {
          case 1:
            name = '矿机租赁';
            break;
          case 7:
            name = '矿机托管';
            break;
        }
        return name;
      },
    },
    {
      title: '服务费',
      dataIndex: 'service_charge_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} max={1} step={0.1} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="black">未付款</Tag>,
                <Tag color="green">已付款</Tag>,
                <Tag color="black">关闭</Tag>,
                <Tag color="black">超时</Tag>,
              ][text]
            }
          </div>
        );
      },
      custom() {
        return (
          <Select>
            <Option disabled value={0}>
              未付款
            </Option>
            <Option disabled value={1}>
              已付款
            </Option>
            <Option value={2}>关闭</Option>
            <Option disabled value={3}>
              超时
            </Option>
          </Select>
        );
      },
    },
    {
      title: '有效算力',
      dataIndex: 'adj_power',
      render: (text, record) => (
        <div>
          {parseFloat(text)}
          {parseFloat(record.speed_adj) != 0
            ? '（+' + parseFloat(record.speed_adj) + '）'
            : ''}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'weight/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'weight/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            this.state.page = 1;
            if (e && e.time) {
              e.time = [
                e.time[0].format('YYYY-MM-DD'),
                e.time[1].format('YYYY-MM-DD'),
              ];
            }
            this.state.search = e;
            this.loadData();
          }}
          items={[
            { label: '订单号', name: 'pid' },
            { label: '用户账号', name: 'account' },
            { label: '邀请人账号', name: 'up_user' },
            { label: '商品名称', name: 'related_name' },
            {
              label: '服务费',
              name: 'service_charge_rate',
              custom: (
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={1}
                  step={0.1}
                />
              ),
            },
            {
              label: '支付状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>未付款</Option>
                  <Option value={1}>已付款</Option>
                  <Option value={2}>关闭</Option>
                  <Option value={3}>超时</Option>
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
              type: 'weight/export',
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
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onSave={this.handleSave}
          rowKey="id"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.weight.list,
    listLoading: state.loading.effects['weight/queryList'],
    updateLoading: state.loading.effects['weight/update'],
  };
}

export default connect(mapStateToProps)(Page);
