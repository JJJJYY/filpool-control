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
      editable: true,
      required: true,
    },
    {
      title: '币种',
      dataIndex: 'pay_coin',
      editable: true,
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
      title: '年化',
      dataIndex: 'earning_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={100} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      editable: true,
      required: true,
      render(text) {
        switch (text) {
          case 0:
            return <Tag color="black">不启用</Tag>;
          case 1:
            return <Tag color="green">启用</Tag>;
        }
      },
      custom() {
        return (
          <Select>
            <Option value={0}>启用</Option>
            <Option value={1}>不启用</Option>
          </Select>
        );
      },
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
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
      title: '年化',
      key: 'earning_rate',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={1} />;
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'cbbProductConfig/queryList',
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
    this.props
      .dispatch({
        type: 'cbbProductConfig/add',
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
    this.props
      .dispatch({
        type: 'cbbProductConfig/update',
        payload: { id: id, ...row },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  handleDelete = id => {
    this.props
      .dispatch({
        type: 'cbbProductConfig/delete',
        payload: { id: id },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  render() {
    const { visible } = this.state;
    const {
      data,
      listLoading,
      addLoading,
      updateLoading,
      deleteLoading,
    } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading || deleteLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onSave={this.handleSave}
          onDelete={this.handleDelete}
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
    data: state.cbbProductConfig.list,
    listLoading: state.loading.effects['cbbProductConfig/queryList'],
    addLoading: state.loading.effects['cbbProductConfig/add'],
    updateLoading: state.loading.effects['cbbProductConfig/update'],
    deleteLoading: state.loading.effects['cbbProductConfig/delete'],
  };
}

export default connect(mapStateToProps)(Page);
