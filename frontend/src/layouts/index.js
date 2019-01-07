import React, { Component } from 'react';
import { Layout, Icon, Menu, Spin } from "antd";
import { connect } from "dva";
import Link from "umi/link";
import styles from './index.css';
import routerConfig from '../menuConfig'

const {
  Header, Content, Footer, Sider,
} = Layout;

function getPathNameIndex() {
  return routerConfig.findIndex(item => {
    return item.router === window.location.pathname
  }) + ""
}

const mapStateToProps = (state) => ({
  loading: state.loading.global
})

class BasicLayout extends Component {

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const { loading } = this.props;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <h2 className={this.state.collapsed ? styles.logoHide : styles.logo}>
            WeiboViz Pro
          </h2>
          <Menu
            theme="dark"
            defaultSelectedKeys={[getPathNameIndex()]}
            mode="inline">
            {
              routerConfig.map((item, index) => {
                return <Menu.Item key={index}>
                  <Link to={item.router}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Link>
                </Menu.Item>
              })
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Spin
              spinning={loading}
              tip="Loading..."
              size="large"
            >
              <div style={{
                marginTop: 20,
                padding: 20,
                minHeight: 400,
                background: "#fff"
              }}>
                {this.props.children}
              </div>
            </Spin>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            @浙江大学软件学院 数据可视化作业
            <br />
            by 毛怡伟，梁家坤，邵迪龙
          </Footer>
        </Layout>
      </Layout>
    );
  }
}



export default connect(mapStateToProps)(BasicLayout);
