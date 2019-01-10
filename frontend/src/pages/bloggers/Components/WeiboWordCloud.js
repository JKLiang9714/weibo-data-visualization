import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";
import 'echarts-wordcloud'


const mapStateToProps = (state) => ({
    tfidfs: state.blogger.tfidf,
    blogger: state.blogger.single
})

const getOption = (tfidfs, name) => {
    return {
        title: {
            text: `对 ${name} 而言, 最重要的一个词是 ${tfidfs[0].word}`,
            left: 'center',
            top: 30,
            textStyle: {
                fontSize: 30
            }
        },
        series: [{
            type: "wordCloud",
            width: '100%',
            height: '100%',
            rotationRange: [0, 0],
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
    let { tfidfs, blogger } = props;

    // 过滤和博主名字相关的关键字
    tfidfs = tfidfs.filter(item =>
        blogger.name.indexOf(item.word) === -1
    )


    return <ReactEcharts
        style={{
            height: 800
        }}
        option={getOption(tfidfs, blogger.name)}
    />
}

export default connect(mapStateToProps)(Component)
