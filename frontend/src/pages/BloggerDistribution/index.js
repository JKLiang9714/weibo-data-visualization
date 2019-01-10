import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";
import symbols from "../../assets/iconsvgpath"

const mapStateToProps = (state) => ({
  sex: state.blogger.sexDistribution
})

const getOption = (data) => {
  const sum = data[0].value + data[1].value

  const percent = (v) => `${Math.floor(10000 * v / sum) / 100} %`

  return {
    title: {
      text: '所有博主男女分布',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.seriesName} 
        ${params.seriesName === "男" ? percent(data[1].value) : percent(data[0].value)} <br/>
        平均微博数 ${Math.floor(params.data[0])} <br/>
        平均粉丝数 ${Math.floor(params.data[1])} <br/> `
      }
    },
    legend: {
      left: 'left',
      data: ['男', '女'],
      itemWidth: 15,
    },
    xAxis: {
      name: "平均微博数",
      min: 400,
    },
    yAxis: {
      name: "平均粉丝数",
      min: 3000,
    },
    series: data.map(i => ({
      name: i.name,
      type: 'scatter',
      // symbol: 'image://' + i.name === '男' ? boy : girl,
      symbol: i.name === '男' ? symbols.boy : symbols.girl,
      symbolSize: i.value / 10,
      data: [[
        i.avg_following,
        i.avg_weibo_num
      ]]
    }))
  }
}


function Component(props) {
  const { sex } = props;

  return <ReactEcharts
    style={{
      height: 500
    }}
    option={getOption(sex)}
  />
}

export default connect(mapStateToProps)(Component)
