import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

const mapStateToProps = (state) => ({
  bloggers: state.blogger.single,
});

const getOption_WeiboNum = (data) => {
  return {
    series: [
      {
        title: {
          fontSize: 20,
        },
        max: 5000,
        type: 'gauge',
        detail: {
          formatter: '{value}',
          fontSize: 22,
        },
        data: [{
          value: data.weibo_num,
          name: '微博数',
        }],
      },
    ]
  };
};

const getOption_Following = (data) => {
  return {
    series: [
      {
        title: {
          fontSize: 20,
        },
        max: 5000,
        type: 'gauge',
        detail: {
          formatter: '{value}',
          fontSize: 22,
        },
        data: [{
          value: data.following,
          name: '关注数',
        }],
      },
    ]
  };
};

const getOption_Followers = (data) => {
  return {
    series: [
      {
        title: {
          fontSize: 20,
        },
        axisLabel: {
          formatter: function (value) {
            return value / 10000 + 'w';
          }
        },
        max: 100000000,
        type: 'gauge',
        detail: {
          formatter: '{value}',
          fontSize: 22,
        },
        data: [{
          value: data.followers,
          name: '粉丝数',
        }],
      },
    ]
  };
};

function Component(props) {
  const { bloggers } = props;

  return <Row gutter={16}>
    <Col span={8}> <ReactEcharts
      style={{
        height: 450,
      }}
      option={getOption_WeiboNum(bloggers)}
    /> </Col>

    <Col span={8}>
      <ReactEcharts
        style={{
          height: 450,
        }}
        option={getOption_Following(bloggers)}
      /> </Col>

    <Col span={8}> <ReactEcharts
      style={{
        height: 450,
      }}
      option={getOption_Followers(bloggers)}
    /> </Col>
  </Row>;
}

export default connect(mapStateToProps)(Component);
