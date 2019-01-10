import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/map/js/china';
import { connect } from 'dva';


const mapStateToProps = (state) => ({
  bloggers: state.blogger.locationDistribution,
});


const getOption = (data) => {
  let map_data = [];
  let max_value = 0;
  for (var i = 0; i < data.length; i++) {
    map_data.push({
      name: data[i].name,
      value: data[i].value              // 原value
    });
    max_value = Math.max(max_value, data[i].value);
  }
  while (max_value % 1000 !== 0) max_value++;

  return {
    title: {
      text: '博主地域热力分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: function (val) {
        if (val.data) {
          var area_content = '地区：' + val.name + '</br>人数：' + val.data.originValue;
          return area_content.split("-").join("\n");
        }
        return ""
      },
    },
    visualMap: {
      min: 0,
      max: Math.log(max_value),
      left: 'left',
      top: 'bottom',
      text: ['多', '少'],           // 文本，默认为数值文本
      calculable: true,
      formatter: function (value) {
        if (value === 0) return 0
        return Math.floor(Math.exp(value))
      }
    },
    series: [
      {
        type: 'map',
        mapType: 'china',
        label: {
          normal: {
            show: true,
          },
          emphasis: {
            show: true,
          },
        },
        data: map_data.map(v => ({
          ...v,
          originValue: v.value,
          value: Math.log(v.value)
        })),
      },
    ],
  };
};


function Component(props) {
  const { bloggers } = props;

  return <ReactEcharts
    style={{
      height: 700,
    }}
    option={getOption(bloggers)}
  />;
}

export default connect(mapStateToProps)(Component);
