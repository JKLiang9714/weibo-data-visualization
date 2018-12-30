import { Table } from "antd";
import { connect } from "dva";
import Link from 'umi/link'
import styles from './index.css';


const mapStateToProps = (state) => ({
  bloggers: state.blogger.list
})

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  render: text => <Link to={`/bloggers/${text}`}>
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
  sorter: (a, b) => a.weibo_num - b.weibo_num,
}, {
  title: '关注',
  dataIndex: 'following',
  sorter: (a, b) => a.following - b.following,
}, {
  title: '粉丝',
  dataIndex: 'followers',
  sorter: (a, b) => a.followers - b.followers,
}];

function Index(props) {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.bloggers}
      />
    </div>
  );
}

export default connect(mapStateToProps)(Index)