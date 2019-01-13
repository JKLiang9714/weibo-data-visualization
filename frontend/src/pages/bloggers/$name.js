import React from 'react'
import { Tabs } from "antd";
import BasicInfo from './Components/BasicInfo'
import WeiboCalendar from './Components/WeiboCalendar'
import WeiboPublishTime from './Components/WeiboPublishTime'
import WeiboWordCloud from './Components/WeiboWordCloud'
import PopularityTrend from './Components/PopularityTrend'
import FriendsTopology from './Components/FriendsTopology'
import FriendsDistribution from './Components/FriendsDistribution'

const TabPane = Tabs.TabPane;

export default function (props) {
    return <Tabs
        tabPosition="top"
        defaultActiveKey="1"
        style={{ minHeight: 500 }}
    >
        <TabPane tab="基本信息" key="1">
            <BasicInfo />
        </TabPane>
        <TabPane tab="好友关系" key="2">
            <FriendsTopology />
        </TabPane>
        <TabPane tab="微博日历" key="3">
            <WeiboCalendar />
        </TabPane>
        <TabPane tab="热度趋势" key="4">
            <PopularityTrend />
        </TabPane>
        <TabPane tab="微博词云" key="5">
            <WeiboWordCloud />
        </TabPane>
        <TabPane tab="发布时间" key="6">
            <WeiboPublishTime />
        </TabPane>
        {/* <TabPane tab="好友热力分布" key="7">
            <FriendsDistribution />
        </TabPane> */}
    </Tabs>
}
