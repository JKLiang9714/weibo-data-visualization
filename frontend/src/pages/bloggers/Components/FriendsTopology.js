import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { Modal, Radio } from "antd";
import router from 'umi/router';
import { connect } from "dva";
import symbols from "../../../assets/iconsvgpath"

const confirm = Modal.confirm;

const mapStateToProps = (state) => ({
    blogger: state.blogger.single,
    friends: state.blogger.friends
})

const categoryMap = {
    "女": 0,
    "男": 1,
}

// 粉丝数转换 用log10来计算几位数
const follower2Value = (followers) => 5 * Math.log10(followers)

function generateGraph(friends, blogger, maxDepth = 3) {
    const nameDic = {}
    const graph = { nodes: [], links: [] }

    const queue = []
    // add a fake node for curr blogger for easy BFS
    const fake = blogger
    fake.friend_id = {}
    fake.friend_id.friends = friends.slice(0, 100)
    fake.depth = 0
    queue.push(fake)
    graph.nodes.push({
        name: fake.name,
        linkId: fake.id,
        category: categoryMap[fake.sex],
        // fixed: true,
        symbol: fake.sex === '男' ? symbols.boy : symbols.girl,
        symbolSize: follower2Value(fake.followers),
        value: follower2Value(fake.followers),
        label: { show: true }
    })
    nameDic[fake.name] = true

    // BFS
    while (queue.length > 0) {
        let top = queue.shift()
        if (top.depth >= maxDepth) {
            break
        }
        if (top.friend_id
            && top.friend_id.friends
            && top.friend_id.friends.length > 0) {
            // add friend's friends into queue
            top.friend_id.friends.slice(0, 20).forEach(people => {
                people.depth = top.depth + 1
                // add nodes
                if (!nameDic[people.name]) {
                    nameDic[people.name] = true
                    graph.nodes.push({
                        name: people.name,
                        linkId: people.id,
                        symbol: people.sex === '男' ? symbols.boy : symbols.girl,
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


const getOption = (friends, blogger, maxDepth = 3) => {
    const graph = generateGraph(friends, blogger, maxDepth)

    return {
        title: {
            text: `${blogger.name}的朋友关系`
        },
        legend: [{
            show: true,
            left: 20,
            top: 'center',
            orient: 'vertical',
            itemWidth: 15,
            data: [
                { name: "男", icon: symbols.boy },
                { name: "女", icon: symbols.girl }
            ]
        }, {
            show: true,
            data: [
                { name: "一层好友" },
                { name: "二层好友" },
                { name: "三层好友" },
            ]
        }],
        series: [{
            type: 'graph',
            layout: 'force',
            edgeSymbol: ['none', 'arrow'],
            edgeSymbolSize: 8,
            data: graph.nodes,
            force: {
                repulsion: 400
            },
            label: {
                normal: {
                    fontSize: 20,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            edges: graph.links,
            focusNodeAdjacency: true,
            categories: [{ name: "女" }, { name: "男" }],
            draggable: true,
            roam: true,
            nodeScaleRatio: 1
        }]
    }
}

function showConfirm(data) {
    confirm({
        title: `是否前往 ${data.name} 的页面进行查看 ?`,
        onOk() {
            router.push(`/bloggers/${data.linkId}`)
        }
    });
}


class Component extends React.Component {

    state = {
        maxDepth: 3
    }

    render(props) {
        const { friends, blogger } = this.props;

        return <>
            <Radio.Group
                value={this.state.maxDepth}
                onChange={(e) => {
                    this.setState({
                        maxDepth: e.target.value
                    })
                }}
            >
                <Radio value={1}>一层好友拓扑</Radio>
                <Radio value={2}>二层好友拓扑</Radio>
                <Radio value={3}>三层好友拓扑</Radio>
            </Radio.Group>

            <ReactEcharts
                style={{
                    marginTop: 10,
                    height: 800
                }}
                onEvents={{
                    click: (event) => {
                        console.log(event)
                        if (event.dataType === "node") {
                            showConfirm(event.data)
                        }
                    }
                }}
                option={getOption(friends, blogger, this.state.maxDepth)}
            />
        </>
    }
}



export default connect(mapStateToProps)(Component)
