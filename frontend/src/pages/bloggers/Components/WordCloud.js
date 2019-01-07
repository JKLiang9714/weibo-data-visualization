import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";
import 'echarts-wordcloud'

const mapStateToProps = (state) => ({
    tfidfs: state.blogger.tfidf
})

const getOption = (tfidfs) => {
    return {
        series: [{
            type: "wordCloud",
            textStyle: {
                normal: {
                    fontFamily: 'sans-serif',
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: tfidfs.map(i => ({
                name: i.word,
                value: i.weight
            }))
        }]
    }
}


function Component(props) {
    const { tfidfs } = props;

    return <ReactEcharts
        style={{
            height: 500
        }}
        option={getOption(tfidfs)}
    />
}

export default connect(mapStateToProps)(Component)
