import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Tabs } from 'antd'
import {request} from "@/utils/request";
import moment from 'moment';



const { Title, Paragraph, Text, Link } = Typography;
export default function NewsPreview() {

    const { id } = useParams()
    console.log(id);


    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        request.get(`/news?id=${id}&_expand=category&_expand=role`).then(res => {
            console.log(res.data[0]);
            setNewsInfo(res.data[0])
        })
    }, [id])


    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']

    const colorList = ['gray', 'orange', 'green', 'red']
    return (
        <div>
            {
                newsInfo && <Typography>
                    <Title level={5}>标题：{newsInfo.title} <span style={{ color: 'gray', fontSize: '12px' }}>{newsInfo.category.title}</span></Title>
                    <Paragraph>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>创建者：{newsInfo.author}</Text>
                            <Text>创建时间：{moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                            <Text>发布时间：{newsInfo.publishTime ? moment(newsInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</Text>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>区域：{newsInfo.region}</Text>
                            <Text>审核状态：<span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Text>
                            <Text>发布状态：<span style={{ color: colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>访问数量：{newsInfo.view}</Text>
                            <Text>点赞数量：{newsInfo.star}</Text>
                            <Text>评论数量：0</Text>
                        </div>

                        <div>

                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="新闻内容" key="1" style={{
                                    height: "340px",
                                    overflow: 'auto',
                                    padding: '0 24px'
                                }}>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: newsInfo.content
                                        }} />
                                </Tabs.TabPane>
                            </Tabs>
                        </div>


                    </Paragraph>
                </Typography>
            }

        </div >
    )
}
