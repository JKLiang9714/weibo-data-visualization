import React from 'react';
import ReactEcharts from 'echarts-for-react';
import 'echarts/map/js/china';
import { connect } from 'dva';

const mapStateToProps = (state) => ({
  bloggers: state.blogger.locationDistribution,
});

const getOption = (data) => {
  let map_data = [];
  let draw_map_data = [];
  let max_value = 0;
  for (var i = 0; i < data.length; i++) {
    map_data.push({
      name: data[i].name,
      value: data[i].value              // 原value
    });
    max_value = Math.max(max_value, data[i].value);
  }
  while (max_value % 1000 != 0) max_value++;
  return {
    title: {
      text: '博主地域热力分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: function(val){
        var area_content =  '地区：' + val.name + '</br>人数：' + val.value;
        return area_content.split("-").join("\n");
      },
    },
    visualMap: {
      min: 0,
      max: max_value,
      left: 'left',
      top: 'bottom',
      text: ['多', '少'],           // 文本，默认为数值文本
      calculable: true,
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
        data: map_data,
      },
    ],
  };
};


function Component(props) {
  const { bloggers } = props;

  return <ReactEcharts
    style={{
      height: 900,
    }}
    option={getOption(bloggers)}
  />;
}

export default connect(mapStateToProps)(Component);
