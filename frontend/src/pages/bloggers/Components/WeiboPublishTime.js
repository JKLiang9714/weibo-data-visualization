import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import { Row, Col } from 'antd';

const mapStateToProps = (state) => ({
  bloggers: state.blogger.weiboContent,
});

// const ignoreLabel = (params) => params.percent < 5 ? "" : "123"
// const ignoreLabelLine = (params) => params.percent < 5

const getOption_Week = (data) => {
  let week_data = [];
  for (var i = 1; i <= 7; i++) {
    week_data[i] = 0;
  }
  for (var j = 0; j < data.length; j++) {
    var dateArray = data[j].publish_time.split(" ")[0].split("-");
    var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    week_data[date.getDay() + 1]++;
  }
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      show: false,
      orient: 'horizontal',
      left: 'center',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: [20, 110],
        center: ['25%', '50%'],
        roseType: 'radius',
        center: ['50%', '60%'],
        data: [
          { value: week_data[1], name: '周一' },
          { value: week_data[2], name: '周二' },
          { value: week_data[3], name: '周三' },
          { value: week_data[4], name: '周四' },
          { value: week_data[5], name: '周五' },
          { value: week_data[6], name: '周六' },
          { value: week_data[7], name: '周日' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

const getOption_Time = (data) => {
  let time_data = [];
  for (var i = 0; i < 24; i++) {
    time_data[i] = 0;
  }
  for (var j = 0; j < data.length; j++) {
    var hour_0 = data[j].publish_time.split(" ")[1].split(":")[0];
    var hour = parseInt(~~hour_0);
    time_data[hour]++;
  }
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      show: false,
      orient: 'horizontal',
      left: 'center',
      data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点',
        '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        radius: [20, 110],
        roseType: 'radius',
        data: [
          { value: time_data[0], name: '0点' },
          { value: time_data[1], name: '1点' },
          { value: time_data[2], name: '2点' },
          { value: time_data[3], name: '3点' },
          { value: time_data[4], name: '4点' },
          { value: time_data[5], name: '5点' },
          { value: time_data[6], name: '6点' },
          { value: time_data[7], name: '7点' },
          { value: time_data[8], name: '8点' },
          { value: time_data[9], name: '9点' },
          { value: time_data[10], name: '10点' },
          { value: time_data[11], name: '11点' },
          { value: time_data[12], name: '12点' },
          { value: time_data[13], name: '13点' },
          { value: time_data[14], name: '14点' },
          { value: time_data[15], name: '15点' },
          { value: time_data[16], name: '16点' },
          { value: time_data[17], name: '17点' },
          { value: time_data[18], name: '18点' },
          { value: time_data[19], name: '19点' },
          { value: time_data[20], name: '20点' },
          { value: time_data[21], name: '21点' },
          { value: time_data[22], name: '22点' },
          { value: time_data[23], name: '23点' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

const getOption_Polar = (data) => {
  let hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  let days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  // let polar_data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]];
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
  const { bloggers } = props;

  return <Row gutter={16}>
    <Col span={8}> <ReactEcharts
      style={{
        height: 450,
      }}
      option={getOption_Week(bloggers)}
    /> </Col>

    <Col span={8}> <ReactEcharts
      style={{
        height: 450,
      }}
      option={getOption_Time(bloggers)}
    /> </Col>

    <Col span={8}> <ReactEcharts
      style={{
        height: 450,
      }}
      option={getOption_Polar(bloggers)}
    /> </Col>
  </Row>;
}

export default connect(mapStateToProps)(Component);
