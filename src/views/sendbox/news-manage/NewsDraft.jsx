import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Table, Button, Space, Tooltip, Modal, message } from 'antd'
import {
    DeleteOutlined,
    FormOutlined,
    CloudUploadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import {request} from "@/utils/request";
export default function NewsDraft() {
    const [draftList, setDraftList] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate()
    // 获取草稿箱文章列表
    const getDraftList = () => {
        request.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            // console.log(res.data);

            setDraftList(res.data)
        })
    }

    const deleteNews = item => {
        Modal.confirm({
            title: '您确定要删除此条新闻吗？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                deleteOK(item)
            },
            onCancel: () => {
                message.info('已取消删除')
            }
        })
    }
    const deleteOK = (item) => {
        request.delete(`/news/${item.id}`).then(res => {
            message.success('删除文章成功')
            getDraftList()
        }).catch(err => {
            message.error('删除文章失败')
        })
    }

    // 提交审核
    const clickPublish = item => {
        request.patch(`/news/${item.id}`, {
            auditState: 1
        }).then(res => {
            message.success('提交审核成功')
            navigate('/audit-manage/list')
        }).catch(err => {
            message.error('提交审核失败')
        })
    }
    useEffect(() => {

        getDraftList()
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            ellipsis: true,
            render: (title, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`} >{title}</NavLink>
                // return <div>{title}</div>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            align: 'center',
        },
        {
            title: '新闻分类',
            align: 'center',
            dataIndex: 'category',
            render: (category) => {
                return <span>{category.title}</span>
            }
            //categoryId => findCategoryName(categoryId)
        },
        {
            title: '操作',
            align: 'center',
            render: item => {
                return (
                    <Space>
                        <Tooltip title="delete">
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                                    onClick={() => {
                                        deleteNews(item)
                                    }}
                            />
                        </Tooltip>
                        <Tooltip title="edit">
                            <Button type="primary" shape="circle" icon={<FormOutlined />} onClick={() => {
                                navigate(`/news-manage/update/${item.id}`)
                            }} />
                        </Tooltip>
                        <Tooltip title="publish">
                            <Button type="primary" shape="circle" icon={<CloudUploadOutlined />}
                                    onClick={() => {
                                        clickPublish(item)
                                    }} />
                        </Tooltip>
                    </Space>
                )
            }
        }
    ];
    return (
        <div>
            <Table
                dataSource={draftList}
                columns={columns}
                rowKey={item => item.id}
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}
