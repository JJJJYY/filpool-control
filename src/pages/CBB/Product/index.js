import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import { Select, DatePicker, InputNumber, Tag } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';
import moment from 'moment';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    visible: false,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '商品名称',
      dataIndex: 'tittle',
    },
    {
      title: '币种',
      dataIndex: 'pay_coin',
    },
    {
      title: '筹集周期（天）',
      dataIndex: 'collect_days',
      editable: true,
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} step={1} />;
      },
    },
    {
      title: '持有时长（天）',
      dataIndex: 'last_days',
      editable: true,
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} step={1} />;
      },
    },
    {
      title: '最小购买量',
      dataIndex: 'minimum_amount',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '最大购买量',
      dataIndex: 'maximum_amount',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '产品总数',
      dataIndex: 'total',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '收益率（%）',
      dataIndex: 'earning_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={100} />;
      },
    },
    {
      title: 'DFL奖励比例（%）',
      dataIndex: 'award_defi_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={100} />;
      },
    },
    {
      title: '开售时间',
      dataIndex: 'start_sale_time',
      // editable: true,
      // required: true,
      // custom() {
      //   return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      // },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        switch (text) {
          case 0:
            return <Tag color="black">未开始</Tag>;
          case 1:
            return <Tag color="green">筹集中</Tag>;
          case 2:
            return <Tag color="blue">收益中</Tag>;
          case 3:
            return <Tag color="black">已结算</Tag>;
        }
      },
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
    },
  ];

  modelColumns = [
    {
      title: '商品名称',
      key: 'tittle',
      required: true,
    },
    {
      title: '币种',
      key: 'pay_coin',
      required: true,
      custom() {
        return (
          <Select>
            <Option value="FIL">FIL</Option>
          </Select>
        );
      },
    },
    {
      title: '筹集周期（天）',
      key: 'collect_days',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} step={1} />;
      },
    },
    {
      title: '持有时长（天）',
      key: 'last_days',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} step={1} />;
      },
    },
    {
      title: '最小购买量',
      key: 'minimum_amount',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '最大购买量',
      key: 'maximum_amount',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '产品总数',
      key: 'total',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '收益率（%）',
      key: 'earning_rate',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={100} />;
      },
    },
    {
      title: 'DFL奖励比例（%）',
      key: 'award_defi_rate',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={100} />;
      },
    },
    {
      title: '开售时间',
      key: 'start_sale_time',
      required: true,
      custom() {
        return (
          <DatePicker
            style={{ width: '100%' }}
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            disabledDate={current => {
              return current && current < moment(new Date()).add(-1, 'days');
            }}
          />
        );
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'cbbProduct/queryList',
      payload: {
        page: this.state.page,
        count: this.state.count,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = values => {
    if (values.start_time)
      values.start_time = values.start_time.format('YYYY-MM-DD HH:mm:ss');
    this.props
      .dispatch({
        type: 'cbbProduct/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
      });
  };

  handleSave = (row, id) => {
    if (row.start_time)
      row.start_time = row.start_time.format('YYYY-MM-DD HH:mm:ss');
    this.props
      .dispatch({
        type: 'cbbProduct/update',
        payload: { id: id, ...row },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onSave={this.handleSave}
          rowKey="id"
        />
        <EditModal
          visible={visible}
          width={630}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.cbbProduct.list,
    listLoading: state.loading.effects['cbbProduct/queryList'],
    addLoading: state.loading.effects['cbbProduct/add'],
    updateLoading: state.loading.effects['cbbProduct/update'],
  };
}

export default connect(mapStateToProps)(Page);
