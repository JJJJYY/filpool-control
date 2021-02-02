import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import { Select, Tag, Modal, Form } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;
const FormItem = Form.Item;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };
  formRef = React.createRef();

  columns = [
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
      title: '申请时间',
      dataIndex: 'create_time',
    },
    {
      title: '状态',
      dataIndex: 'audit_status',
      render(text) {
        switch (text) {
          case 1:
            return <Tag color="green">待审核</Tag>;
          case 2:
            return <Tag color="blue">通过</Tag>;
          case 3:
            return <Tag color="black">拒绝</Tag>;
        }
      },
    },
    {
      title: '操作',
      operation: true,
      width: 60,
      fixed: 'right',
      actions(record) {
        return record.audit_status == 1 ? ['审核'] : [];
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'cbbTransferRecords/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
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
            <Form ref={this.formRef}>
              <FormItem
                label="审核"
                name="audit_status"
                rules={[{ required: true, message: `请选择` }]}
              >
                <Select placeholder="请选择">
                  <Option value={2}>通过</Option>
                  <Option value={3}>拒绝</Option>
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
                    type: 'cbbTransferRecords/audit',
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
            { label: '账号', name: 'account' },
            {
              label: '状态',
              name: 'audit_status',
              custom: (
                <Select>
                  <Option value={1}>待审核</Option>
                  <Option value={2}>通过</Option>
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
          onActions={this.handleActions}
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
    data: state.cbbTransferRecords.list,
    listLoading: state.loading.effects['cbbTransferRecords/queryList'],
  };
}

export default connect(mapStateToProps)(Page);
