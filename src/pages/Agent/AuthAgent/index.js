import React, { Component } from 'react';
import {
  Switch,
  InputNumber,
  Input,
  Tag,
  Modal,
  Form,
  Select,
  Drawer,
  Divider,
  Table,
} from 'antd';
import { connect } from 'umi';
import EditModal from '@/components/EditModal';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const FormItem = Form.Item;
const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
    visible: false,
    visibleDrawer: false,
    userID: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户',
      dataIndex: 'account',
    },
    {
      title: '名称',
      dataIndex: 'name',
      editable: true,
      required: true,
    },
    {
      title: '收益比例',
      dataIndex: 'income_rate',
      editable: true,
      required: true,
      custom() {
        return <InputNumber min={0} max={0.2} placeholder="0 ~ 0.2" />;
      },
    },
    {
      title: '域名',
      dataIndex: 'host_url',
      editable: true,
      required: true,
      render(text) {
        return (
          <a target="_blank" href={'http://' + text}>
            {text}
          </a>
        );
      },
    },
    {
      title: '是否启用',
      dataIndex: 'is_enable',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>
            {[<Tag color="black">否</Tag>, <Tag color="green">是</Tag>][text]}
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="是" unCheckedChildren="否" />;
      },
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['详情', '角色'];
      },
    },
  ];

  modelColumns = [
    {
      title: '用户',
      key: 'account',
      required: true,
    },
    {
      title: '代理商名称',
      key: 'name',
      required: true,
    },
    {
      title: '域名',
      key: 'host_url',
      required: true,
      custom() {
        return <Input addonBefore="http://" />;
      },
    },
    {
      title: '收益比例',
      key: 'income_rate',
      required: true,
      custom() {
        return (
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={0.2}
            placeholder="0 ~ 0.2"
          />
        );
      },
    },
  ];

  columnsBalance = [
    {
      title: '资产类型',
      dataIndex: 'asset',
    },
    {
      title: '总数量',
      dataIndex: 'sum',
      render: (_, record) => (
        <div>
          {parseFloat(
            Number(record.available) +
              Number(record.recharge) +
              Number(record.frozen) +
              Number(record.pledged),
          )}
        </div>
      ),
    },
    {
      title: '释放',
      dataIndex: 'available',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '充提',
      dataIndex: 'recharge',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '冻结',
      dataIndex: 'frozen',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '质押',
      dataIndex: 'pledged',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <div>
          <a onClick={() => this.handleExchange(record, true)}>充值</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleExchange(record, false)}>扣除</a>
        </div>
      ),
    },
  ];

  columnsHashrate = [
    {
      title: '资产类型',
      dataIndex: 'type',
      render: text => (
        <div>
          {
            [
              '矿机租赁',
              '赠送',
              '兑换',
              '推广赠送',
              '注册送',
              '活动奖励',
              '矿机托管',
              '推广奖励',
              '其他',
              '未知',
            ][text - 1]
          }
        </div>
      ),
    },
    {
      title: '算力TB',
      dataIndex: 'quantity',
      render: text => <div>{parseFloat(text)}</div>,
    },
  ];

  columnsOrder = [
    {
      title: 'PID',
      dataIndex: 'pid',
    },
    {
      title: '算力',
      dataIndex: 'quantity',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '有效算力',
      dataIndex: 'adj_power',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '填充进度',
      dataIndex: 'max_adj',
      render: (text, record) => (
        <div>
          {parseFloat((record.adj_power / text) * 100).toFixed(2)}%
          {record.stop == 1 && '（停止）'}
        </div>
      ),
    },
    {
      title: '服务费',
      dataIndex: 'service_charge_rate',
      render: text => <div>{parseFloat(text)}</div>,
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'authAgent/queryList',
      payload: {
        page: this.state.page,
        count: this.state.count,
        search: this.state.search,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleCloseDrawer = () => {
    this.setState({ visibleDrawer: false, userID: null });
  };

  handleSubmit = values => {
    this.props
      .dispatch({
        type: 'authAgent/add',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'authAgent/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  loadUserDetail = id => {
    this.props
      .dispatch({
        type: 'authAgent/queryUserDetail',
        payload: { id: id },
      })
      .then(data => {
        if (data != 'error') {
          this.setState({ visibleDrawer: true, userID: id });
        }
      });
  };

  handleExchange = (record, isAdd) => {
    Modal.confirm({
      title: (isAdd ? '充值' : '扣除') + record.asset,
      content: (
        <div>
          <br />
          <Form ref={this.formRef}>
            <FormItem
              label="类型"
              name="type"
              rules={[{ required: true, message: `请选择类型` }]}
            >
              <Select>
                <Option value={2}>质押账户</Option>
                <Option value={3}>充提账户</Option>
              </Select>
            </FormItem>
            <FormItem
              label="数量"
              name="value"
              rules={[{ required: true, message: `请输入数量` }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入数量"
                min={0}
              />
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
                  type: 'agentBalance/exchange',
                  payload: {
                    auth_agent_id: record.auth_agent_id,
                    asset: record.asset,
                    value: isAdd ? values.value : -values.value,
                    type: values.type,
                  },
                })
                .then(data => {
                  if (data != 'error') {
                    resolve();
                    this.loadUserDetail(this.state.userID);
                  } else {
                    reject();
                  }
                });
            })
            .catch(() => reject());
        });
      },
    });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      this.loadUserDetail(row.id);
    } else {
      this.props
        .dispatch({
          type: 'authAgent/userRole',
          payload: { sys_user_id: row.id },
        })
        .then(data => {
          if (data != 'error') {
            Modal.confirm({
              title: '编辑用户角色',
              content: (
                <div>
                  用户：{row.name}
                  <br />
                  <br />
                  <Form ref={this.formRef}>
                    <Form.Item
                      label="角色"
                      name="sys_role_id"
                      initialValue={data.userRole.sys_role_id}
                      rules={[{ required: true, message: `请选择角色` }]}
                    >
                      <Select placeholder="请选择角色">
                        {data &&
                          data.roles.map(item => (
                            <Select.Option
                              value={item.id}
                              key={item.id}
                              disabled={!item.is_enable}
                            >
                              {item.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
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
                          type: 'agentRole/add',
                          payload: { auth_agent_id: row.id, ...values },
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
        });
    }
  };

  render() {
    const { visible, visibleDrawer } = this.state;
    const {
      data,
      listLoading,
      addLoading,
      updateLoading,
      userDetail,
    } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            this.state.page = 1;
            this.state.search = e;
            this.loadData();
          }}
          items={[{ label: '账号', name: 'account' }]}
        />
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
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
        <EditModal
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns}
        />
        <Drawer
          width={840}
          placement="right"
          onClose={this.handleCloseDrawer}
          visible={visibleDrawer}
        >
          {userDetail && (
            <div>
              <Divider>资金记录</Divider>
              <div style={{ width: '100%' }}>
                <Table
                  columns={this.columnsBalance}
                  dataSource={userDetail.balance}
                  pagination={false}
                  rowKey="id"
                />
              </div>
              <Divider>算力记录</Divider>
              <div style={{ width: '100%' }}>
                <Table
                  columns={this.columnsHashrate}
                  dataSource={userDetail.weight}
                  pagination={false}
                  rowKey="type"
                />
              </div>
              <Divider>订单记录</Divider>
              <div style={{ width: '100%' }}>
                <Table
                  columns={this.columnsOrder}
                  dataSource={userDetail.orders}
                  pagination={false}
                  rowKey="id"
                />
              </div>
            </div>
          )}
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.authAgent.list,
    userDetail: state.authAgent.userDetail,
    listLoading:
      state.loading.effects['authAgent/queryList'] ||
      state.loading.effects['authAgent/userRole'],
    addLoading: state.loading.effects['authAgent/add'],
    updateLoading: state.loading.effects['authAgent/update'],
  };
}

export default connect(mapStateToProps)(Page);
