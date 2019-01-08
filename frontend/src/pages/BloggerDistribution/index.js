import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";

const mapStateToProps = (state) => ({
  bloggers: state.blogger.sexDistribution
})

const getOption = (data) => {
  return {
    title: {
      text: '所有博主男女比例',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['男', '女']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '65%',
        center: ['50%', '60%'],
        data: [
          { value: data[1].value, name: '男' },
          { value: data[0].value, name: '女' },
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
  }
}


function Component(props) {
  const { bloggers } = props;

  return <ReactEcharts
    style={{
      height: 500
    }}
    option={getOption(bloggers)}
  />
}

export default connect(mapStateToProps)(Component)
