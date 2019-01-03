import React from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';

const mapStateToProps = (state) => ({
  bloggers: state.blogger.weiboContent,
});

const getOption = (data) => {
  let popularity_data = [];
  let like_list = [];
  let comment_list = [];
  let forward_list = [];
  for (var i = 0; i < data.length; i++) {
    like_list.push([data[i].publish_time.split(" ")[0], data[i].like]);
    comment_list.push([data[i].publish_time.split(" ")[0], data[i].comment]);
    forward_list.push([data[i].publish_time.split(" ")[0], data[i].forward]);
  }
  popularity_data.push(like_list, comment_list, forward_list);
  for (var j = 0; j < popularity_data.length; j++) {
    popularity_data[j].sort();
  }
  return {
    title: {
      text: '近50条微博的点赞数、评论数、转发数'
    },
    legend: {
      right: 10,
      data: ['点赞数', '评论数', '转发数']
    },
    xAxis: {
      type: 'category',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    series: [{
      name: '点赞数',
      data: popularity_data[0],
      type: 'line',
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[1];
          },
          position: 'top'
        }
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }, {
      name: '评论数',
      data: popularity_data[1],
      type: 'line',
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[1];
          },
          position: 'top'
        }
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }, {
      name: '转发数',
      data: popularity_data[2],
      type: 'line',
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[2];
          },
          position: 'top'
        }
      },
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }]
  };
};


function Component(props) {
  const { bloggers } = props;

  return <ReactEcharts
    style={{
      height: 500,
    }}
    option={getOption(bloggers)}
  />;
}

export default connect(mapStateToProps)(Component);
