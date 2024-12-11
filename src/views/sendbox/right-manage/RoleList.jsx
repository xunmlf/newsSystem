import React, {useState, useEffect} from 'react';
import {Button, Space, Table, Modal, message, Tree} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {request} from "@/utils/request";

const {confirm} = Modal

function RoleList(props) {

    // 用户列表数据
    const [roleListData, setRoleListData] = useState([])
    // 控制弹框显示与隐藏
    const [isModalOpen, setIsModalOpen] = useState(false)
    // 获取所有权限列表
    const [rightsList, setRightsList] = useState([])
    // 获取当前用户所拥有的权限
    const [currentRights, setCurrentRights] = useState([])
    // 获取当前要修改用户权限的id
    const [currentId, setCurrentId] = useState(0)

    const getRoleList = () => {
        request.get('/roles').then(res => {
            setRoleListData(res.data)
        })
    }

    const getRightsList = () => {
        request.get('/rights?_embed=children').then(res => {
            setRightsList(res.data)
        })
    }
    useEffect(() => {
        getRoleList()
        getRightsList()
    }, [])


    // 删除确认框
    const deleteConfirm = (item) => {
        // console.log(item)
        confirm({
            title: '确定删除此角色吗?',
            icon: <ExclamationCircleFilled/>,
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            onOk() {
                deleteRole(item)
            },
            onCancel() {
                message.info('取消删除')
            },
        })
    }
    // 确认删除
    const deleteRole = (item) => {
        setRoleListData(roleListData.filter(data => data.id !== item.id))
        request.delete(`/roles/${item.id}`).then(res => {
            message.success('成功删除该用户')
        })
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            render: (roleName) => {
                return <b>{roleName}</b>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <Space>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => {
                        deleteConfirm(item)
                    }}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={() => {
                        setIsModalOpen(true)
                        setCurrentRights(item.rights)
                        setCurrentId(item.id)
                    }}/>
                </Space>
            }
        }
    ]

    // 点击弹框中的确认
    const handleOk = () => {
        setIsModalOpen(false)

        setRoleListData( roleListData.map(data => {
            if (data.id === currentId) {
                return {
                    ...data,
                    rights: currentRights
                }
            }
            return data
        }) )
        request.patch(`/roles/${currentId}`, {rights: currentRights}).then(res=>{
            // console.log(res)
            message.success('权限分配成功！')
        })
    }
    // 点击弹框中的取消
    const handleCancel = () => {
        setIsModalOpen(false)
        message.info('取消分配')
    }

    const checkMethod = (checkedKeys) => {
        setCurrentRights(checkedKeys.checked)
        // console.log(currentRights)
    }
    return (
        <div>
            <Table dataSource={roleListData} columns={columns} rowKey={item => item.id}></Table>

            {/* 弹框*/}
            <Modal title="权限分配" okText={"确认"} cancelText={"取消"} open={isModalOpen} onOk={() => {
                handleOk()
            }} onCancel={() => {
                handleCancel()
            }}>
                <Tree
                    checkable
                    checkStrictly={true}
                    treeData={rightsList}
                    checkedKeys={currentRights}
                    onCheck={(checkedKeys) => {
                        checkMethod(checkedKeys)
                    }}

                />
            </Modal>
        </div>
    );
}

export default RoleList;
