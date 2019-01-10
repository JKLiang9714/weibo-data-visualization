import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

const mapStateToProps = (state) => ({
  data: state.blogger,
});

const getOption = (data) => {
  return {
  //   series: [
  //     {
  //       title: {
  //         fontSize: 20,
  //       },
  //       max: 5000,
  //       type: 'gauge',
  //       detail: {
  //         formatter: '{value}',
  //         fontSize: 22,
  //       },
  //       data: [{
  //         value: data.weibo_num,
  //         name: '微博数',
  //       }],
  //     },
  //   ]
    title: {
      text: `全部博主平均水平 vs ${data.single.name}`,
    },
    tooltip: {},
    legend: {
      data: ['全部博主的平均微博数、关注数、粉丝数', `${data.single.name}的微博数、关注数、粉丝数`],
      left: 20,
      top: 'center',
      orient: 'vertical',
    },
    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          color: '#fff',
          backgroundColor: '#999',
          borderRadius: 3,
          padding: [3, 5]
        }
      },
      indicator: [
        { name: '微博数（Weibo_Nums）', max: data.average.max_weibo_num},
        { name: '关注数（Following_Nums）', max: data.average.max_following},
        { name: '粉丝数（Follower_Nums）', max: data.average.max_followers},
      ]
    },
    series: [{
      type: 'radar',
      // areaStyle: {normal: {}},
      data : [
        {
          value : [data.average['avg_weibo_num'], data.average['avg_following'], data.average['avg_followers']],
          name : '全部博主的平均微博数、关注数、粉丝数'
        },
        {
          value : [data.single.weibo_num, data.single.following, data.single.followers],
          name : `${data.single.name}的微博数、关注数、粉丝数`
        }
      ]
    }]
  };
};

function Component(props) {
  const { data } = props;

  return <ReactEcharts
    style={{
      height: 800,
    }}
    option={getOption(data)}
  />;
}

export default connect(mapStateToProps)(Component);
