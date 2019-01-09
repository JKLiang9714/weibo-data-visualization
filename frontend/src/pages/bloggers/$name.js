import React from 'react'
import { Tabs } from "antd";
import BasicInfo from './Components/BasicInfo'
import WeiboNum from './Components/WeiboNum'
import WeiboPublishTime from './Components/WeiboPublishTime'
import WordCloud from './Components/WordCloud'
import Popularity from './Components/Popularity'
import FriendsTopology from './Components/FriendsTopology'
import FriendsDistribution from './Components/FriendsDistribution'

const TabPane = Tabs.TabPane;

export default function (props) {
    return <Tabs
        tabPosition="top"
        defaultActiveKey="6"
        style={{ minHeight: 500 }}
    >
        <TabPane tab="基本信息" key="1">
            <BasicInfo />
        </TabPane>
        <TabPane tab="好友关系" key="2">
            <FriendsTopology />
        </TabPane>
        <TabPane tab="微博数趋势" key="3">
            <WeiboNum />
        </TabPane>
        <TabPane tab="热度趋势" key="4">
            <Popularity />
        </TabPane>
        <TabPane tab="微博词云" key="5">
            <WordCloud />
        </TabPane>
        <TabPane tab="发布时间" key="6">
            <WeiboPublishTime />
        </TabPane>
        <TabPane tab="好友热力分布" key="7">
            <FriendsDistribution />
        </TabPane>
    </Tabs>
}
