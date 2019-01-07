import { Table, Pagination } from "antd";
import { connect } from "dva";
import Link from 'umi/link'

const mapStateToProps = (state) => ({
  bloggers: state.blogger.list
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
      <Table
        columns={columns}
        dataSource={props.bloggers}
        onChange={(pagination) => {

        }}
        pagination={{
          total: 3017,
          pageSize: PAGE_SIZE,
          onChange: page => {
            dispatch({
              type: "blogger/getList",
              payload: {
                page,
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