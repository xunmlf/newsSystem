import React, {useEffect, useState} from 'react';
import {Button, Space, Table, Tag, Modal, message,Popover,Switch} from "antd"
import {request} from "@/utils/request";

import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'

const {confirm} = Modal;

function RightList(props) {

    const [rightListDataSource, setRightListDataSource] = useState([])

    // 获取权限列表
    const getRightList = () => {
        request.get('/rights?_embed=children').then(res => {
            // console.log(res.data)
            // antd 组件库，Table组件，如果有children组件
            const resultData = res.data
            resultData.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ''
                }
            })
            setRightListDataSource(resultData)
        })
    }

    //删除某一权限
    const deleteRight = (item) => {
        // 如果删除的是一级权限
        if (item.grade === 1) {
            setRightListDataSource(rightListDataSource.filter(data => item.id !== data.id))
            request.delete(`/rights/${item.id}`).then(res => {
                message.success('删除成功')
            })
        } else { // 删除的是二级权限
            const newRightListDataSource = rightListDataSource.map(data => {
                if (item.id === data.rightId) {
                    data.children = data.children.filter(child => item.id !== child.id)
                }
                return data
            })
            setRightListDataSource(newRightListDataSource)

            request.delete(`/children/${item.id}`).then(r => {
                message.success('删除成功')
            })
        }

    }

    // 删除权限确认框
    const showDeleteConfirm = (item) => {
        console.log(item)
        confirm({
            title: '确定删除此权限吗?',
            icon: <ExclamationCircleFilled/>,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteRight(item)
            },
            onCancel() {
                message.info('已取消删除')
            },
        });
    }

    // 修改权限状态  1选中，0未选中
    const switchMethod =(item)=>{
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setRightListDataSource([...rightListDataSource])
        // console.log(item)
        if(item.grade === 1){
            // console.log(1)
            request.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            }).then(res=>{
                // console.log(res)
                if(res.data.pagepermisson ===1 ){
                    message.success('权限开启成功！')
                }else{
                    message.success('权限禁用成功！')
                }

            }).catch(err=>{
                message.error('修改失败')
            })
        }else{
            request.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            }).then(res=>{
                if(res.data.pagepermisson ===1 ){
                    message.success('权限开启成功！')
                }else{
                    message.success('权限禁用成功！')
                }
            }).catch(err=>{
                message.error('修改失败')
            })
        }
    }

    // 副作用函数
    useEffect(() => {
        getRightList()
    }, []);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            render: (title) => {
                return <b>{title}</b>
            }
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <Space>

                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
                        showDeleteConfirm(item)
                    }}/>

                    <Popover  content={ <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={item.pagepermisson} onClick={()=>{
                        switchMethod(item)
                    }}/>} title="是否禁用该权限" trigger="click">
                        <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.pagepermisson === undefined}/>
                    </Popover>


                </Space>
            }
        },
    ]
    return (
        <div>
            <Table dataSource={rightListDataSource} columns={columns} pagination={{
                pageSize: 5
            }}/>
        </div>
    );
}

export default RightList;
