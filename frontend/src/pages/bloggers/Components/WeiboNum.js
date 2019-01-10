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
    day_count[echarts.format.formatTime('yyyy-MM-dd', time)] = {'count': 0, 'weibo': []};
  }

  for (var i = 0; i < weibo.length; i++) {
    var one_date = weibo[i].publish_time.split(' ')[0];
    if (+echarts.number.parseDate(one_date) >= begin && +echarts.number.parseDate(one_date) < end) {
      day_count[one_date].count++;
      day_count[one_date].weibo.push(weibo[i].tfidf);
    }
  }

  for (var time = begin; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      day_count[echarts.format.formatTime('yyyy-MM-dd', time)].count,
      day_count[echarts.format.formatTime('yyyy-MM-dd', time)].weibo,
    ])
  }
  return data;
}

const getOption = (blogger, weibo, subtext) => {
  var data = getCalenderData(weibo);
  return {
    title: {
      text: `2018年 ${blogger.name} 每天发布的微博数量及关键词`,
      subtext: `${ subtext }`,
      left: 'center',
      top: 30,
      textStyle: {
        fontSize: 30
      },
      subtextStyle: {
        fontSize: 15
      }
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
      top: 150,
      left: 'center',
      cellSize: [30],
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
      top: 420,
      left: 'center',
      cellSize: [30],
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
        symbolSize: function (val) {
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
        symbolSize: function (val) {
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
        symbolSize: function (val) {
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
        symbolSize: function (val) {
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

class Component extends React.Component{
  state = {
    subtext: ''
  };

  convertData(data) {
    let convert_data = [];
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].length; j++) {
        convert_data.push(data[i][j].word);
      }
    }
    return convert_data.slice(0, 5);
  }

  showWeibo(data) {
    this.setState({
      subtext: data[0] + ' 微博提到了：' + this.convertData(data[2])
    });
    // console.log(data)
  }

  render(){
    const { blogger, weibo } = this.props;
    const { subtext } = this.state;

    return <ReactEcharts
      style={{
        height: 700,
      }}
      onEvents={{
        click: (event) => {
          if (event.seriesType === "scatter" || event.seriesType === "effectScatter") {
            this.showWeibo(event.data)
          }
        }
      }}
      option={getOption(blogger, weibo, subtext)}
    />;
  }
}

export default connect(mapStateToProps)(Component);
