import React, { Component } from 'react';
import { Tag, Form, Select, Modal, Input, Button } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';

const FormItem = Form.Item;
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
      render: (text, record) => (
        <div>
          {text}（{record.name}）
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'amount',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
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
                <Tag color="blue">待审核</Tag>,
                <Tag color="green">完成</Tag>,
                <Tag color="black">拒绝</Tag>,
                <Tag color="black">钱包拒绝</Tag>,
                <Tag color="blue">待钱包处理</Tag>,
                <Tag color="blue">转账中</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
    {
      title: '申请时间',
      dataIndex: 'create_time',
    },
    {
      title: '接收方',
      dataIndex: 'address',
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      fixed: 'right',
      render: (_, record) =>
        record.status == 0 ? (
          <a onClick={() => this.handleReceipt(record)}>审核</a>
        ) : (
          <div>-</div>
        ),
    },
  ];

  componentDidMount() {
    this.loadData();
    this.loadBalance();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'agentWithdrawal/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  loadBalance = () => {
    this.props.dispatch({
      type: 'agentWithdrawal/usdtBalance',
    });
  };

  handleReceipt = row => {
    Modal.confirm({
      title: '审核',
      content: (
        <div>
          账号：{row.account}
          <br />
          数量：{parseFloat(row.amount)}
          {row.asset}
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
            <FormItem label="备注" name="remark">
              <Input placeholder="备注" />
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
                  type: 'agentWithdrawal/audit',
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
  };

  checkHash = () => {
    Modal.confirm({
      title: '填写转账Hash',
      content: (
        <div>
          输入USDT(ERC20) / FIL转账Hash，系统将自动识别
          <br />
          <br />
          <Form ref={this.formRef}>
            <FormItem label="哈希" name="hash">
              <Input placeholder="hash" />
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
                  type: 'agentWithdrawal/checkHash',
                  payload: {
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
  };

  downloadFilWaitTrans = () => {
    this.props
      .dispatch({
        type: 'agentWithdrawal/exportFILTxt',
        payload: {
          sendTrans: this.state.search && this.state.search.status == 4,
        },
      })
      .then(res => {
        if (res && res != 'error') {
          this.loadData();

          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = res;
          link.setAttribute('download', '');
          document.body.appendChild(link);
          link.click();
        }
      });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading, updateLoading, usdt } = this.props;
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
              label: '状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>待审核</Option>
                  <Option value={1}>完成</Option>
                  <Option value={2}>拒绝</Option>
                  <Option value={3}>钱包拒绝</Option>
                  <Option value={4}>待钱包处理</Option>
                  <Option value={5}>转账中</Option>
                </Select>
              ),
            },
          ]}
        />
        <div className={styles.btnGroup}>
          <OperationGroup
            onExport={all => {
              this.props.dispatch({
                type: 'agentWithdrawal/export',
                payload: {
                  page: page,
                  count: count,
                  search: search ? JSON.stringify(search) : null,
                  all: all,
                },
              });
            }}
          />
          {/* {search &&
            (search.status == 4 || search.status == 5) &&
            search.asset == 'FIL' && (
              <Button
                className={styles.btn}
                type="primary"
                onClick={this.downloadFilWaitTrans}
              >
                下载提币数据
              </Button>
            )} */}
          <Button
            className={styles.btn}
            type="primary"
            onClick={this.checkHash}
          >
            填充Hash
          </Button>
        </div>
        {usdt && <div className={styles.balance}>提币地址： {usdt} USDT</div>}
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
          rowKey="id"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.agentWithdrawal.list,
    usdt: state.agentWithdrawal.usdt,
    listLoading: state.loading.effects['agentWithdrawal/queryList'],
    updateLoading: state.loading.effects['agentWithdrawal/audit'],
  };
}

export default connect(mapStateToProps)(Page);
