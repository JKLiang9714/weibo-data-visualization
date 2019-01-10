import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { weekdays } from '_moment@2.23.0@moment';

const mapStateToProps = (state) => ({
  blogger: state.blogger.single,
  weiboContent: state.blogger.weiboContent,
});

const getOption_Week = (data, blogger) => {
  let week_data = [];
  let sum = data.length;
  for (var i = 1; i <= 7; i++) {
    week_data[i] = 0;
  }
  for (var j = 0; j < data.length; j++) {
    var dateArray = data[j].publish_time.split(" ")[0].split("-");
    var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    week_data[date.getDay()]++;
  }

  return {
    title: {
      text: `${blogger.name} 喜欢在周几发布微博`,
      left: "center",
      top: 30,
      textStyle: {
        fontSize: 30
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
      {
        name: '微博数',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        roseType: 'radius',
        data: week_data.map((num, index) => {
          const show = num / sum > 0.15
          return {
            value: num,
            name: '周' + ['一', '二', '三', '四', '五', '六', '日'][index],
            label: { show, position: show ? "outside" : "inside" },
            labelLine: { show, emphasis: { show } }
          }
        }),
        label: {
          fontSize: 18
        },
        labelLine: {
          length: 30,
          length2: 0,
          smooth: true
        }
      },
    ]
  };
};

const getOption_Time = (data, blogger) => {
  let time_data = [];
  // 总数 = 微博数
  let sum = data.length;
  for (var i = 0; i < 24; i++) {
    time_data[i] = 0;
  }
  for (var j = 0; j < data.length; j++) {
    var hour_0 = data[j].publish_time.split(" ")[1].split(":")[0];
    var hour = parseInt(~~hour_0);
    time_data[hour]++;
  }

  return {
    title: {
      text: `${blogger.name} 喜欢在几点发布微博`,
      left: "center",
      top: 30,
      textStyle: {
        fontSize: 30
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series: [
      {
        name: '微博数',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        roseType: 'radius',
        data: time_data.map((num, index) => {
          const show = num / sum > 0.1
          return {
            value: num,
            name: index + '点',
            label: { show, position: show ? "outside" : "inside" },
            labelLine: { show, emphasis: { show } }
          }
        }),
        label: {
          fontSize: 18
        },
        labelLine: {
          length: 30,
          length2: 0,
          smooth: true
        }
      }
    ]
  };
};

const getOption_Polar = (data, blogger) => {
  let hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  let days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  let polar_data = [];
  let week_day_cnt = new Array();
  for (var i = 1; i <= 7; i++) {
    week_day_cnt[i] = new Array();
  }
  for (var i = 1; i <= 7; i++) {
    for (var j = 0; j <= 23; j++) {
      week_day_cnt[i][j] = 0;
    }
  }
  for (var i = 0; i < data.length; i++) {
    var dateArray = data[i].publish_time.split(" ")[0].split("-");
    var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    var week = date.getDay() + 1;

    var hour_0 = data[i].publish_time.split(" ")[1].split(":")[0];
    var hour = parseInt(~~hour_0);

    week_day_cnt[week][hour]++;
  }
  for (var i = 1; i <= 7; i++) {
    for (var j = 0; j <= 23; j++) {
      polar_data.push([
        i, j, week_day_cnt[i][j]
      ]);
    }
  }

  return {
    title: {
      text: `${blogger.name} 微博发布时间总览`,
      left: "center",
      top: 30,
      textStyle: {
        fontSize: 30
      }
    },
    polar: {},
    tooltip: {
      formatter: function (params) {
        return days[params.value[0]] + ',' + hours[params.value[1]] + "点, " + params.value[2] + "条";
      }
    },
    angleAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#999',
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      }
    },
    radiusAxis: {
      type: 'category',
      data: days,
      axisLine: {
        show: false
      },
      axisLabel: {
        rotate: 45
      }
    },
    series: [{
      type: 'scatter',
      coordinateSystem: 'polar',
      symbolSize: function (val) {
        return val[2] * 5;
      },
      data: polar_data,
      animationDelay: function (idx) {
        return idx * 5;
      }
    }]
  };
};

function Component(props) {
  const { weiboContent, blogger } = props;

  return <Row gutter={16}>
    <Col span={8}>
      <ReactEcharts
        style={{
          height: 800,
        }}
        option={getOption_Week(weiboContent, blogger)}
      />
    </Col>
    <Col span={8}>
      <ReactEcharts
        style={{
          height: 800,
        }}
        option={getOption_Time(weiboContent, blogger)}
      />
    </Col>
    <Col span={8}>
      <ReactEcharts
        style={{
          height: 800,
        }}
        option={getOption_Polar(weiboContent, blogger)}
      />
    </Col>
  </Row>;
}

export default connect(mapStateToProps)(Component);
