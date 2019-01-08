import { Table, Input } from "antd";
import { connect } from "dva";
import Link from 'umi/link'

const Search = Input.Search

const mapStateToProps = (state) => ({
  bloggers: state.blogger.list,
  page: state.blogger.page,
  count: state.blogger.count
})

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  render: (text, item) => <Link to={`/bloggers/${item.id}`}>
    {text}
  </Link>
}, {
  title: '性别',
  dataIndex: 'sex',
}, {
  title: '出生地',
  dataIndex: 'birthplace',
}, {
  title: '微博数',
  dataIndex: 'weibo_num',
}, {
  title: '关注',
  dataIndex: 'following',
}, {
  title: '粉丝',
  dataIndex: 'followers',
}];

const PAGE_SIZE = 10


function Index(props) {
  const { dispatch } = props

  return (
    <div>
      <div style={{
        overflow: "hidden"
      }}>
        <Search
          placeholder="搜索用户"
          onSearch={value => {
            dispatch({
              type: "blogger/getList",
              payload: {
                name: value
              }
            })
          }}
          style={{
            width: 300,
            float: 'right',
            marginBottom: 20
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={props.bloggers}
        pagination={{
          total: props.count,
          pageSize: PAGE_SIZE,
          current: props.page + 1,
          onChange: page => {
            dispatch({
              type: "blogger/getList",
              payload: {
                page: page - 1,
                pageSize: PAGE_SIZE
              }
            })
          }
        }}
      />
    </div>
  );
}

export default connect(mapStateToProps)(Index)