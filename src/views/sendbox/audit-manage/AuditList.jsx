import { Table, Tag, Button, message, Modal } from 'antd'
import { RollbackOutlined, RocketOutlined, HighlightOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { NavLink, useNavigate } from 'react-router-dom'
import {request} from "@/utils/request";
import React, { useEffect, useState } from 'react'


const { confirm } = Modal
export default function AuditList() {
    const [auditList, setAuditList] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    const navigate = useNavigate()
    const getAuditList = () => {
        request.get(`/news?auditState_ne=0&author=${username}&publishState_lte=1&_expand=category`).then(res => {
            const list = res.data
            setAuditList(list)
        })
    }
    useEffect(() => {
        getAuditList()
    }, [username])

    // 操作区
    // 撤销
    const onClickRollback = (id) => {
        request.patch(`/news/${id}`, {
            auditState: 0
        }).then(res => {

            message.success('撤销成功')
            getAuditList()
            // 回到草稿箱
            navigate('/news-manage/draft')
        }).catch(err => {
            message.error('撤销失败')
        })
    }

    // 发布
    const onClickPublish = (id) => {
        confirm({
            title: '您确定要发布此文章吗？',
            icon: <ExclamationCircleOutlined />,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                request.patch(`/news/${id}`, {
                    publishState: 2,
                    publishTime: Date.now()
                }).then(res => {
                    message.success('发布成功')
                    getAuditList()
                    navigate('/publish-manage/published')
                }).catch(err => { })
            },
            onCancel() {
                message.info('取消发布')
            }
        })
    }

    // 修改
    const onClickEdit = (id) => {
        navigate(`/news-manage/update/${id}`)
    }

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`} >{title}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            render: (author) => {
                return <div>{author}</div>
            }
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                if (auditState === 1) {
                    return <Tag color="warning">审核中</Tag>
                } else if (auditState === 2) {
                    return <Tag color="success">已通过</Tag >
                } else if (auditState === 3) {
                    return <Tag color="error">未通过</Tag>
                }
            }
        },
        {
            title: '操作',
            render: ({ auditState, id }) => {
                if (auditState === 1) {
                    return <Button type="primary" icon={<RollbackOutlined />} onClick={() => onClickRollback(id)}>撤销</Button>
                } else if (auditState === 2) {
                    return <Button type="primary" icon={<RocketOutlined />} onClick={() => onClickPublish(id)}>发布</Button>
                } else if (auditState === 3) {
                    return <Button type="primary" icon={<HighlightOutlined />} onClick={() => onClickEdit(id)}>修改</Button>
                }
            }
        }
    ]
    return (
        <div>
            <Table dataSource={auditList} columns={columns} rowKey={item => item.id}></Table>
        </div>
    )
}
