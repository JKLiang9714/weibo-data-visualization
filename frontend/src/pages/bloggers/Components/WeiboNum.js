import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import echarts from 'echarts';

const mapStateToProps = (state) => ({
  blogger: state.blogger.single,
  weibo: state.blogger.weiboContent,
});

function getCalenderData(weibo) {
  var data = [];

  var day_count = [];
  var begin = +echarts.number.parseDate('2018-01-01');
  var end = +echarts.number.parseDate('2019-01-01');
  var dayTime = 3600 * 24 * 1000;
  for (var time = begin; time < end; time += dayTime) {
    day_count[echarts.format.formatTime('yyyy-MM-dd', time)] = 0;
  }

  for (var i = 0; i < weibo.length; i++) {
    var one_date = weibo[i].publish_time.split(' ')[0];
    if (+echarts.number.parseDate(one_date) >= begin && +echarts.number.parseDate(one_date) < end) {
      day_count[one_date]++;
    }
  }

  for (var time = begin; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      day_count[echarts.format.formatTime('yyyy-MM-dd', time)]
    ])
  }
  return data;
}

const getOption = (blogger, weibo) => {
  var data = getCalenderData(weibo);
  return {
    title: {
      top: 30,
      text: `2018年 ${blogger.name} 每天发布的微博数量`,
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '30',
      left: '100',
      data: ['微博数', 'Top 3'],
      textStyle: {
        color: '#333'
      },
      show: true
    },
    calendar: [{
      top: 100,
      left: 'center',
      range: ['2018-01-01', '2018-06-30'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid',
        },
      },
      yearLabel: {
        formatter: '{start}  1st',
        textStyle: {
          color: '#333',
        },
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111',
        },
      },
    }, {
      top: 340,
      left: 'center',
      range: ['2018-07-01', '2018-12-31'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid',
        },
      },
      yearLabel: {
        formatter: '{start}  2nd',
        textStyle: {
          color: '#333',
        },
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111',
        },
      },
    }],
    series: [
      {
        name: '微博数',
        type: 'scatter',
        coordinateSystem: 'calendar',
        data: data,
        symbolSize: function(val) {
          return val[1] * 4;
        },
        itemStyle: {
          normal: {
            color: '#ddb926',
          },
        },
      },
      {
        name: '微博数',
        type: 'scatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data,
        symbolSize: function(val) {
          return val[1] * 4;
        },
        itemStyle: {
          normal: {
            color: '#ddb926',
          },
        },
      },
      {
        name: 'Top 3',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data.sort(function (a, b) {
          return b[1] - a[1];
        }).slice(0, 3),
        symbolSize: function(val) {
          return val[1] * 4;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          },
        },
      },
      {
        name: 'Top 3',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        data: data.sort(function (a, b) {
          return b[1] - a[1];
        }).slice(0, 3),
        symbolSize: function(val) {
          return val[1] * 4;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          },
        },
      },
    ],
  };
};


function Component(props) {
  const { blogger, weibo } = props;

  return <ReactEcharts
    style={{
      height: 500,
    }}
    option={getOption(blogger, weibo)}
  />;
}

export default connect(mapStateToProps)(Component);
