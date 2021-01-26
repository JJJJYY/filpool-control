import React, { Component } from 'react';
import { Form, InputNumber, Tag, Modal, Select, DatePicker } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    page: 1,
    count: 10,
    search: null,
    selectedRowKeys: [],
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
      render: (text, record) => (
        <div>
          {text}（{record.agent_name}）
        </div>
      ),
    },
    {
      title: '商品',
      dataIndex: 'goods_name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      editable: true,
      required: true,
      render(text) {
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
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={1}>矿机租赁</Option>
            <Option value={7}>矿机托管</Option>
          </Select>
        );
      },
    },
    {
      title: '总算力(TB)',
      dataIndex: 'quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '已售算力',
      dataIndex: 'sell_quantity',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '有效算力上限',
      dataIndex: 'max_adj',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '有效算力',
      dataIndex: 'adj_power',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '填充进度',
      dataIndex: 'stop',
      editable: true,
      required: true,
      render: (text, record) => (
        <div>
          {parseFloat((record.adj_power / record.max_adj) * 100).toFixed(2)}%
          {text == 1 && '（停止）'}
        </div>
      ),
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={0}>正常</Option>
            <Option value={1}>停止</Option>
          </Select>
        );
      },
    },
    {
      title: '固定增长',
      dataIndex: 'adj_fixed_up',
      editable: true,
      required: true,
      render: text => <div>{text > 0 ? parseFloat(text) : '自然增长'}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '服务费',
      dataIndex: 'service_charge_rate',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '金额',
      dataIndex: 'payment_quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '单位',
      dataIndex: 'asset',
      editable: true,
      required: true,
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value="USDT">USDT</Option>
            <Option value="BTC">BTC</Option>
            <Option value="ETH">ETH</Option>
            <Option value="FIL">FIL</Option>
            <Option value="RMB">RMB</Option>
          </Select>
        );
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
                <Tag color="blue">待审核</Tag>,
                <Tag color="green">通过</Tag>,
                <Tag color="black">拒绝</Tag>,
              ][text]
            }
          </div>
        );
      },
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={0} disabled>
              待审核
            </Option>
            <Option value={1} disabled>
              通过
            </Option>
            <Option value={2}>拒绝</Option>
          </Select>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'add_sys_user_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '审核人',
      dataIndex: 'sys_user_name',
    },
    {
      title: '审核时间',
      dataIndex: 'oper_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      actions(record) {
        return record.status == 0 ? ['审核'] : [];
      },
    },
  ];

  modelColumns = active => [
    {
      title: '代理商账号',
      key: 'account',
      required: true,
    },
    {
      title: '类型',
      key: 'type',
      required: true,
      custom() {
        return (
          <Select>
            <Option value={1}>矿机租赁</Option>
            <Option value={7}>矿机托管</Option>
          </Select>
        );
      },
    },
    {
      title: '算力(TB)',
      key: 'quantity',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '初始填充进度',
      key: 'adj_power_rate',
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} max={1} />;
      },
    },
    {
      title: '金额',
      key: 'payment_quantity',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '单位',
      key: 'asset',
      required: true,
      custom() {
        return (
          <Select>
            <Option value="USDT">USDT</Option>
            <Option value="BTC">BTC</Option>
            <Option value="ETH">ETH</Option>
            <Option value="FIL">FIL</Option>
            <Option value="RMB">RMB</Option>
          </Select>
        );
      },
    },
    {
      title: '产品',
      key: 'goods_id',
      required: true,
      custom() {
        return (
          <Select>
            {active &&
              active.map(row => (
                <Option value={row.id} key={row.id}>
                  {row.name}（有效：{parseFloat(row.rate * 100)}%）
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '备注',
      key: 'remark',
    },
  ];

  componentDidMount() {
    this.loadData();
    this.props.dispatch({
      type: 'goods/queryActive',
    });
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'agentWeight/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSave = (row, id) => {
    this.props
      .dispatch({
        type: 'agentWeight/update',
        payload: { id: id, ...row },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      Modal.confirm({
        title: '审核',
        content: (
          <div>
            账号：{row.account}
            <br />
            创建人：{row.add_sys_user_name}
            <br />
            <br />
            <Form ref={this.formRef}>
              <FormItem
                label="审核"
                name="status"
                rules={[{ required: true, message: `请选择` }]}
              >
                <Select placeholder="请选择">
                  <Option value={1}>通过</Option>
                  <Option value={2}>拒绝</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        ),
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.formRef.current
              .validateFields()
              .then(values => {
                this.props
                  .dispatch({
                    type: 'agentWeight/update',
                    payload: {
                      id: row.id,
                      ...values,
                    },
                  })
                  .then(data => {
                    if (data != 'error') {
                      resolve();
                      this.loadData();
                    } else {
                      reject();
                    }
                  });
              })
              .catch(() => reject());
          });
        },
      });
    }
  };

  handleSubmit = values => {
    this.props
      .dispatch({
        type: 'agentWeight/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
      });
  };

  render() {
    const { visible, search, page, count } = this.state;
    const { data, active, listLoading, addLoading, updateLoading } = this.props;

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
            { label: '单号', name: 'pid' },
            { label: '账号', name: 'account' },
            {
              label: '类型',
              name: 'type',
              custom: (
                <Select>
                  <Option value={1}>矿机租赁</Option>
                  <Option value={7}>矿机托管</Option>
                </Select>
              ),
            },
            {
              label: '状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>待审核</Option>
                  <Option value={1}>通过</Option>
                  <Option value={2}>拒绝</Option>
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
        <div className={styles.btnGroup}>
          <OperationGroup
            onAdd={() => this.setState({ visible: true })}
            onExport={all => {
              this.props.dispatch({
                type: 'agentWeight/export',
                payload: {
                  page: page,
                  count: count,
                  search: search ? JSON.stringify(search) : null,
                  all: all,
                },
              });
            }}
          />
        </div>
        <EditModal
          visible={visible}
          width={630}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns(active)}
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
          onActions={this.handleActions}
          rowKey="id"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.agentWeight.list,
    active: state.goods.active,
    listLoading: state.loading.effects['agentWeight/queryList'],
    addLoading: state.loading.effects['agentWeight/add'],
    updateLoading: state.loading.effects['agentWeight/update'],
  };
}

export default connect(mapStateToProps)(Page);
