import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from "dva";

const mapStateToProps = (state) => ({
    blogger: state.blogger.single,
    friends: state.blogger.friends
})

const categoryMap = {
    "男": 0,
    "女": 1
}

// 粉丝数转换 用log10来计算几位数
const follower2Value = (followers) => 2 * Math.log10(followers)

function generateGraph(friends, blogger) {
    const nameDic = {}
    const graph = { nodes: [], links: [] }

    const queue = []
    // add a fake node for curr blogger for easy BFS
    const fake = blogger
    fake.friend_id = {}
    fake.friend_id.friends = friends.slice(0, 100)
    queue.push(fake)
    graph.nodes.push({
        name: fake.name,
        symbol: 'diamond',
        category: categoryMap[fake.sex],
        // fixed: true,
        symbolSize: follower2Value(fake.followers),
        value: follower2Value(fake.followers),
    })
    nameDic[fake.name] = true

    // BFS
    while (queue.length > 0) {
        let top = queue.shift()
        if (top.friend_id
            && top.friend_id.friends
            && top.friend_id.friends.length > 0) {
            // add friend's friends into queue
            top.friend_id.friends.forEach(people => {
                // add nodes
                if (!nameDic[people.name]) {
                    nameDic[people.name] = true
                    graph.nodes.push({
                        name: people.name,
                        symbolSize: follower2Value(people.followers),
                        value: follower2Value(people.followers),
                        category: categoryMap[people.sex],
                    })
                }

                // add links
                graph.links.push({
                    source: top.name,
                    target: people.name
                })

                queue.push(people)
            })
        }
    }

    return graph
}


const getOption = (friends, blogger) => {
    const graph = generateGraph(friends, blogger)

    return {
        title: {
            text: `${blogger.name}的朋友关系`
        },
        legend: {
            data: ["男", "女"]
        },
        series: [{
            type: 'graph',
            layout: 'force',
            data: graph.nodes,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            edges: graph.links,
            focusNodeAdjacency: true,
            categories: ["男", "女"],
            roam: true
        }]
    }
}


function Component(props) {
    const { friends, blogger } = props;

    return <ReactEcharts
        style={{
            height: 500
        }}
        option={getOption(friends, blogger)}
    />
}

export default connect(mapStateToProps)(Component)
