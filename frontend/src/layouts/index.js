import React, { Component } from 'react';
import { Layout, Icon, Menu } from "antd";
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

            <div style={{
              marginTop: 20,
              padding: 20,
              minHeight: 360,
              background: "#fff"
            }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            @浙江大学软件学院 数据可视化小组
          </Footer>
        </Layout>
      </Layout>
    );
  }
}



export default BasicLayout;
