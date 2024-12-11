import React, { useState, useEffect } from 'react'
import { Card, Col, Row, Avatar, List, Space, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import {request} from "@/utils/request";
import { NavLink } from 'react-router-dom';


import HomeBarChart from "@/components/home-chart/HomeBarChart";
import HomePieChart from "@/components/home-chart/HomePieChart";

const { Meta } = Card;
export default function Home() {

    // 浏览量降序列表
    const [viewList, setViewList] = useState([]);
    // 点赞量降序列表
    const [starList, setStarList] = useState([]);
    // 控制抽屉的打开
    const [openDrawer, setOpenDrawer] = useState(false);

    // 获取浏览量降序列表
    const getViewList = async () => {
        // 获取已发布的文章,以浏览量进行降序排序,并且只取前6条
        const { data } = await request.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=8');
        setViewList(data);
    };

    // 获取点赞量降序列表
    const getStarList = async () => {
        // 获取已发布的文章,以点赞量进行降序排序,并且只取前6条
        const { data } = await request.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=8');
        setStarList(data);
    };


    useEffect(() => {
        getViewList();
        getStarList();

    }, []);


    const { username, role: { roleName }, region, } = JSON.parse(localStorage.getItem('token'))

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <NavLink to={`/news-manage/preview/${item.id}`}>{item.title}</NavLink>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setOpenDrawer(true)

                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={username}
                            description={
                                <Space>
                                    <b>{region === '' ? '全球' : region}</b>
                                    {roleName}
                                </Space>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer width={'40%'} title="个人新闻分类" onClose={
                () => setOpenDrawer(false)
            } open={openDrawer}>
                {/*饼状图*/}
                <HomePieChart></HomePieChart>

            </Drawer>

            {/*柱状图*/}
            <HomeBarChart></HomeBarChart>


        </div>
    )
}
