
import { useEffect, useState, useCallback, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Table, Space, Button, Tooltip, message } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {request} from "@/utils/request";

export default function Audit() {
    const [auditList, setAuditList] = useState([])  // 审核列表数据

    const { roleId, username, region } = JSON.parse(localStorage.getItem('token'))

    const roleObj = useMemo(() => {
        return {
            "1": "superAdmin",
            "2": "admin",
            "3": "editor"
        }
    }, [])

    const getAuditNews = useCallback(async () => {
        //auditState=1代表只有待审核的新闻才会进入到列表中
        const { data } = await request.get(`/news?auditState=1&_expand=category`)
        setAuditList(roleObj[roleId] === "superAdmin" ? data : [  // 区域管理员；区域编辑没有audit审核新闻侧边栏权限
            ...data.filter(item => item.author === username),
            ...data.filter(item => item.region === region && roleObj[item.roleId] === "editor")
        ])
    }, [roleObj, roleId, region, username])


    useEffect(() => {
        getAuditNews()
    }, [getAuditNews])


    const onClickAccess = (item) => {
        request.patch(`/news/${item.id}`, {
            auditState: 2,
            publishState: 1
        })
            .then(() => {
                setAuditList(auditList.filter(i => i.id !== item.id))
                message.success('文章通过审核，现已可发布！', 2)
            })
            .catch(() => {
                message.success('request失败！', 2)
            })
    }

    const onClickDeny = (item) => {
        request.patch(`/news/${item.id}`, {
            auditState: 3
        })
            .then(() => {
                setAuditList(auditList.filter(i => i.id !== item.id))
                message.success('文章拒绝通过！', 2)
            })
            .catch(() => {
                message.success('request失败！', 2)
            })
    }
    const columns = [
        {
            title: '新闻标题',
            ellipsis: true,
            dataIndex: 'title',
            render: (title, { id }) => <NavLink to={`/news-manage/preview/${id}`}>{title}</NavLink>
        },
        {
            title: '作者',

            dataIndex: 'author'
        },
        {
            title: '新闻分类',

            dataIndex: 'category',
            render: category => category.title
        },
        {
            title: '操作',

            render: item => {
                return <Space>
                    <Tooltip title="通过">
                        <Button type="primary" shape="circle" icon={<CheckOutlined />}
                                onClick={() => onClickAccess(item)} />
                    </Tooltip>
                    <Tooltip title="拒绝">
                        <Button danger type="primary" shape="circle" icon={<CloseOutlined />}
                                onClick={() => onClickDeny(item)} />
                    </Tooltip>
                </Space>
            }
        }
    ]

    return (
        <div>
            <Table
                dataSource={auditList}
                columns={columns}
                rowKey={item => item.id}
            />
        </div>
    )
}
