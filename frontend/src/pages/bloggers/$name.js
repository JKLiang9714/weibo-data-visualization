import React from 'react'
import { Tabs } from "antd";
import BasicInfo from './Components/BasicInfo'
import WeiboNum from './Components/WeiboNum'
import WeiboPublishTime from './Components/WeiboPublishTime'
import WordCloud from './Components/WordCloud'
import Popularity from './Components/Popularity'
import FriendsTopology from './Components/FriendsTopology'

const TabPane = Tabs.TabPane;

export default function (props) {
    return <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        style={{ height: 500 }}
    >
        <TabPane tab="基本信息" key="1">
            <BasicInfo />
        </TabPane>
        <TabPane tab="好友关系拓扑" key="2">
            <FriendsTopology />
        </TabPane>
        <TabPane tab="三个月微博数趋势" key="3">
            <WeiboNum />
        </TabPane>
        <TabPane tab="近50条微博热度" key="4">
            <Popularity />
        </TabPane>
        <TabPane tab="近50条微博词云" key="5">
            <WordCloud />
        </TabPane>
        <TabPane tab="近50条发布时间" key="6">
            <WeiboPublishTime />
        </TabPane>
    </Tabs>
}