import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';

const mapStateToProps = (state) => ({
  blogger: state.blogger.single,
  contents: state.blogger.weiboContent,
});

const getOption = (data, name) => {
  let popularity_data = [];
  let like_list = [];
  let comment_list = [];
  let forward_list = [];
  let bestContent = "";
  let max = 0;
  for (var i = 0; i < data.length; i++) {
    like_list.push([data[i].publish_time, data[i].like]);
    comment_list.push([data[i].publish_time, data[i].comment]);
    forward_list.push([data[i].publish_time, data[i].forward]);
    let popularity = data[i].like + data[i].comment + data[i].forward
    if (popularity > max) {
      max = popularity
      bestContent = data[i]
    }
  }
  popularity_data.push(like_list, comment_list, forward_list);
  for (var j = 0; j < popularity_data.length; j++) {
    popularity_data[j].sort();
  }
  return {
    title: {
      text: `${name} 最近微博热度趋势`,
      subtext: `最受欢迎的微博提到了：${bestContent.tfidf.map(i=>i.word)}`,
      rich:{}
    },
    grid: [
      {y: 100}
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
      },
      {
        type: 'inside',
        start: 94,
        end: 100
      },
    ],
    legend: {
      right: 10,
      data: ['点赞数', '评论数', '转发数']
    },
    xAxis: {
      type: 'time',
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
  const { contents, blogger } = props;

  return <ReactEcharts
    style={{
      height: 700,
    }}
    option={getOption(contents, blogger.name)}
  />;
}

export default connect(mapStateToProps)(Component);
