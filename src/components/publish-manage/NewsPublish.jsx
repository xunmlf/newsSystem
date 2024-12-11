import React from 'react'
import { Table } from 'antd'
import { NavLink } from 'react-router-dom'
export default function NewsPublish(props) {
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, { id }) => <NavLink to={`/news-manage/preview/${id}`}>{title}</NavLink>
        },
        {
            title: '作者',
            dataIndex: 'author',

        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            align: 'center',
            render: category => category.title
        },
        {
            title: '操作',
            align: 'center',
            // 渲染时，调用props传来的button方法，得到返回值（也就是Button组件）
            // 点击时，record.id传入onClick方法内部，获取点击的新闻id
            render: (item) => props.button(item.id)


        }
    ]
    return (
        <div>
            <Table
                dataSource={props.datasource}
                columns={columns}
                rowKey={item => item.id}
                pagination={{ pageSize: 5 }}
            />
        </div>
    )
}
