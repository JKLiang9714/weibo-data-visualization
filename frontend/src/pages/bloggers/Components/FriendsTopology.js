import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";

const mapStateToProps = (state) => ({
    bloggers: state.blogger.friends
})

const getOption = (data) => {
    return {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
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
