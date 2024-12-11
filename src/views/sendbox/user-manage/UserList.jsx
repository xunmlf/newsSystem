import React, {useState, useEffect, createRef, useMemo, useCallback} from 'react';
import {Button, message, Space, Switch, Table, Modal} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {request} from "@/utils/request";

import UserForm from "@/components/user-manage/UserForm";

const {confirm} = Modal

function UserList(props) {

    // 用户列表数据
    const [userListData, setUserListData] = useState([])
    // 获取区域列表 -- 添加用户下拉框
    const [regionList, setRegionList] = useState([])
    // 角色列表数据
    const [roleList, setRoleList] = useState([])
    // 添加用户弹框显示与隐藏
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    // 添加用户表单ref
    const addFormRef = createRef()
    // 添加用户弹框
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const updateFormRef = createRef()

    const roleObj = useMemo(() => {
        return {
            "1": "superAdmin",
            "2": "admin",
            "3": "editor"
        }
    }, [])
    // 获取到现在登陆用户信息
    const users = JSON.parse(localStorage.getItem('token'))
    // console.log(users)
    // 获取用户列表
    const getUserList = useCallback( async () => {
        const {data} = await   request.get('/users?_expand=role')
        // console.log(data)
        setUserListData(roleObj[users.roleId] ==='superAdmin' ?data:[
            ...data.filter(item =>item.username === users.username),
            ...data.filter(item =>item.region === users.region && roleObj[item.roleId] ==='editor' )
        ])
    },[users,roleObj])
    // 获取区域列表
    const getRegionList = () => {
        request.get('/regions').then(res => {
            setRegionList(res.data)
        })
    }
    // 角色列表数据
    const getRoleList = () => {
        request.get('/roles').then(res => {
            setRoleList(res.data)
        })
    }
    useEffect(() => {
        getUserList()
        getRegionList()
        getRoleList()
    }, [])



    // 切换用户状态
    const switchMethod = (item) => {
        // console.log(item)
        item.roleState = !item.roleState
        setUserListData([...userListData])
        request.patch(`/users/${item.id}`, {
            roleState: item.roleState
        }).then(res => {
            if (item.roleState) {
                message.success('用户已启用')
            } else {
                message.warning('用户已禁用')
            }

        }).catch(err => {
            message.error('修改失败')
        })
    }
    // 删除确认框
    const deleteConfirm = (item) => {
        confirm({
            title: '确定删除此用户吗?',
            icon: <ExclamationCircleFilled/>,
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            onOk() {
                deleteUser(item)
            },
            onCancel() {
                message.info('已取消删除')
            }
        })
    }

    // 删除用户
    const deleteUser = (item) => {
        // console.log(item)
        request.delete(`/users/${item.id}`).then(res => {
            setUserListData(userListData.filter(data => item.id !== data.id))
            message.success('删除成功')
        }).catch(err => {
            message.error('删除失败')
        })
    }

    // 添加用户
    const addFormOk = () => {
        addFormRef.current.validateFields().then(res => {
            // console.log(res)
            request.post('/users', {
                ...res,
                roleState: true,
                default: false
            }).then(res => {
                // 关闭弹框
                setIsAddModalOpen(false)
                // 清空表单
                addFormRef.current.resetFields()
                message.success('添加用户成功')
                getUserList()
            }).catch(err => {
                message.error('添加用户失败')
            })
        })
    }

    // 更新用户相关操作

    const [currentInfo, setCurrentInfo] = useState(null) // 当前用户信息，用于数据回显
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false) // 是否禁用区域框
    const handelUpdate = (item) => {
        setIsUpdateOpen(true)
        setCurrentInfo(item)
        if (item.roleId === 1) {
            setIsUpdateDisabled(true)
        } else {
            setIsUpdateDisabled(false)
        }
        // console.log(item)
    }
    useEffect(() => {
        if (isUpdateOpen && updateFormRef.current) {
            updateFormRef.current.setFieldsValue(currentInfo)
        }
    }, [isUpdateOpen, currentInfo, updateFormRef]);

    // 更新用户
    const updateFormOk = () => {
        updateFormRef.current.validateFields().then(res => {
            setIsUpdateOpen(false)
            setIsUpdateDisabled(!isUpdateDisabled)
            request.patch(`/users/${currentInfo.id}`, res).then(res => {
                message.success('更新用户成功')
                getUserList()
            }).catch(err => {
                message.error('更新用户失败')
            })

        })
    }

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                {text: '全球', value: '全球'},
                ...regionList.map(item => ({text: item.title, value: item.value}))
            ],
            onFilter: (value, item) => {
                // console.log(value,item)
                if(value === '全球'){
                    return item.region === ''
                }else{
                    return item.region === value
                }
            },
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <b>{role?.roleName}</b>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (username) => {
                return <b>{username}</b>
            }
        }
        ,
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default || item.username === users.username}
                               checkedChildren="启用" unCheckedChildren="禁用" onClick={() => {
                    switchMethod(item)
                }}></Switch>
            }
        }
        ,
        {
            title: '操作',
            align: 'center',
            render: (item) => {
                return <Space>
                    <Button danger shape="circle" disabled={item.default || item.username === users.username}
                            icon={<DeleteOutlined/>} onClick={() => {
                        deleteConfirm(item)
                    }}/>
                    <Button type="primary" disabled={item.default} shape="circle"
                            icon={<EditOutlined/>} onClick={() => {
                        handelUpdate(item)
                    }}/>
                </Space>
            }
        }
    ]
    return (
        <div>
            <Button type='primary' onClick={() => {
                setIsAddModalOpen(true)
            }}>添加用户</Button>
            <Table rowKey={item => item.id} dataSource={userListData} columns={columns} pagination={{
                pageSize: 5
            }}></Table>

            {/* 添加用户弹框*/}
            <Modal
                open={isAddModalOpen}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsAddModalOpen(false)
                    addFormRef.current.resetFields()
                }
                }
                onOk={() => {
                    addFormOk()
                }}>

                <UserForm ref={addFormRef} regionList={regionList} roleList={roleList}></UserForm>
            </Modal>

            {/* 编辑用户弹框*/}
            {isUpdateOpen && <Modal
                open={isUpdateOpen}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateOpen(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }
                }
                onOk={() => {
                    updateFormOk()
                }}>

                <UserForm isUpdate={true} ref={updateFormRef} regionList={regionList} roleList={roleList}
                          isUpdateDisabled={isUpdateDisabled}></UserForm>
            </Modal>}

        </div>
    );
}

export default UserList;
