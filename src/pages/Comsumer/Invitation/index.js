import React, { Component } from 'react';
import { Select, Drawer, Divider, Row, Table } from 'antd';
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
    invitePage: 1,
    inviteCount: 10,
    rank: 0,
    userID: null,
  };

  columns = [
    {
      title: 'UID',
      dataIndex: 'id',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '等级',
      dataIndex: 'level',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>{['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][text + 1]}</div>
        );
      }
    }, {
      title: '邀请人',
      dataIndex: 'up_user',
    }, {
      title: '累计人数',
      dataIndex: 'reward',
      render(text) {
        return text.invitation_count;
      },
    }, {
      title: '分销奖励USDT',
      dataIndex: 'reward',
      render(text) {
        return (
          Math.max(text.brokerage, 0)
        )
      },
    }, {
      title: '累计分销算力（TB）',
      dataIndex: 'reward',
      render(text) {
        return (
          parseFloat(text.children_purchase) + parseFloat(text.grandchildren_purchase)
        )
      },
    }, {
      title: '一级分销（TB)',
      dataIndex: 'reward',
      render(text) {
        return (
          parseFloat(text.children_purchase)
        )
      },
    }, {
      title: '二级分销（TB）',
      dataIndex: 'reward',
      render(text) {
        return (
          parseFloat(text.grandchildren_purchase)
        )
      },
    }, {
      title: '注册时间',
      dataIndex: 'create_time',
    }, {
      title: '操作',
      operation: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['详情'];
      },
    },
  ];

  columnsInvite = [
    {
      title: '邀请用户',
      dataIndex: 'account',
    }, {
      title: '用户等级',
      dataIndex: 'level',
      render: (text) => (
        <div>{['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][text + 1]}</div>
      ),
    }, {
      title: '层级关系',
      dataIndex: 'rank',
      render(text) {
        return text + '级';
      }
    }, {
      title: '购买算力',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)} TB</div>
      ),
    }, {
      title: '团队业绩',
      dataIndex: 'reward',
      render: (text) => (
        <div>{(parseFloat(text.children_purchase) + parseFloat(text.grandchildren_purchase))} TB</div>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'authUser/queryInvitationList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  loadUserInvite = () => {
    const { invitePage, inviteCount, userID, rank } = this.state;
    this.props.dispatch({
      type: 'authUser/queryInviteDetailList',
      payload: {
        id: userID,
        page: invitePage,
        count: inviteCount,
        rank: rank,
        maxrank: 2,
      },
    }).then((data) => {
      if (data != 'error') {
        this.setState({ visibleInviteDrawer: true });
      }
    })
  }

  handleCloseDrawer = () => {
    this.setState({ visibleInviteDrawer: false, userID: null, invitePage: 1, rank: 0 });
  }

  handleActions = (row, index) => {
    if (index == 0) {
      this.state.userID = row.id;
      this.loadUserInvite({ rank: 0 });
    }
  }

  render() {
    const { visibleInviteDrawer, page, count, search, userID, invitePage, inviteCount, rank } = this.state;
    const { data, inviteList, listLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '账号', name: 'account' },
          { label: '邀请人', name: 'up_user' },
          {
            label: '用户等级', name: 'level',
            custom: (
              <Select>
                <Option value={-1}>普通合伙人</Option>
                <Option value={0}>铜牌合伙人</Option>
                <Option value={1}>银牌合伙人</Option>
                <Option value={2}>金牌合伙人</Option>
                <Option value={3}>铂金合伙人</Option>
                <Option value={4}>钻石合伙人</Option>
                <Option value={5}>超级合伙人</Option>
              </Select>
            )
          }]
        } />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'authUser/invitationExport',
            payload: {
              page: page,
              count: count,
              search: search ? JSON.stringify(search) : null,
              all: all,
            },
          });
        }} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          onActions={this.handleActions}
          rowKey="id"
        />
        <Drawer
          width={720}
          placement="right"
          onClose={this.handleCloseDrawer}
          visible={visibleInviteDrawer}
        >
          <div>
            <Divider>邀请纪录</Divider>
            <Row>
              <div style={{ width: '100%' }}>
                <SearchGroup onSearch={(e) => {
                  this.state.invitePage = 1;
                  this.state.rank = e ? e.rank : 0;
                  this.loadUserInvite();
                }} items={[{
                  label: '层级关系', name: 'rank',
                  custom: (
                    <Select>
                      <Option value={1}>1级</Option>
                      <Option value={2}>2级</Option>
                    </Select>
                  )
                }]} />
                <OperationGroup onExport={(all) => {
                  this.props.dispatch({
                    type: 'authUser/inviteDetailExport',
                    payload: {
                      id: userID,
                      page: invitePage,
                      count: inviteCount,
                      rank: rank ? rank : 0,
                      maxrank: 2,
                      all: all,
                    },
                  });
                }} />
                <Table
                  columns={this.columnsInvite}
                  loading={listLoading}
                  dataSource={inviteList ? inviteList.list : []}
                  onChange={(pagination) => {
                    this.state.invitePage = pagination.current;
                    this.state.inviteCount = pagination.pageSize;
                    this.loadUserInvite()
                  }}
                  pagination={{
                    total: inviteList ? inviteList.total : 0,
                    current: inviteList ? inviteList.current : 0,
                    showTotal: (total) => {
                      return `总数:${total}`;
                    },
                  }}
                  rowKey="id" />
              </div>
            </Row>
          </div>
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.authUser.invitationList,
    inviteList: state.authUser.inviteDetailList,
    listLoading: state.loading.effects['authUser/queryInvitationList'] || state.loading.effects['authUser/queryInviteDetailList'],
  };
}

export default connect(mapStateToProps)(Page);