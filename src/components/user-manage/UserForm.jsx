import React, {forwardRef, useEffect, useState} from 'react'

import {Form, Input, Select} from 'antd'

const {Option} = Select;
const UserForm = forwardRef((props, ref) => {
        const [isDisabled, setDisAbled] = useState(false)
        useEffect(() => {
            if (props.isUpdateDisabled !== undefined) {
                setDisAbled(props.isUpdateDisabled)
            }
        }, [props.isUpdateDisabled])

        // 从token 中拿到用户角色
        const {roleId, region} = JSON.parse(localStorage.getItem('token'))
        const roleObj = {
            "1": "superAdmin",
            "2": "admin",
            "3": "editor"
        }

        // 是否禁用区域下拉框
        const checkRegionDisabled = (item) => {
            // 如果是更新
            if (props.isUpdate) {
                // 如果是超级管理员
                if (roleObj[roleId] === 'superAdmin') {
                    return false
                } else {
                    // 区域管理员
                    return item.value !== region
                }
            } else { // 添加用户
                if (roleObj[roleId] === 'superAdmin') {
                    return false
                } else {
                    // 区域管理员 -- 展示本区域
                    return item.value !== region
                }

            }
        }
        // 是否禁用角色下拉框
        const checkRoleDisabled = (item) => {
            if (props.isUpdate) {
                if (roleObj[roleId] === 'superAdmin') {
                    return false
                } else {
                    return true
                }
            } else {
                if (roleObj[roleId] === 'superAdmin') {
                    return false
                } else {
                    // 区域管理员
                    return roleObj[roleId] !== 'editor'
                }

            }
        }
        // 如果是区域管理员的话，只能修改本区域，只能添加区域编辑员
        useEffect(() => {
            if (!props.isUpdate && ref.current ) {
                if(roleId !== 1){
                    ref.current.setFieldsValue({
                        region: region,
                        roleId: 3,
                    });
                }
            }
        }, [props.isUpdate, region, ref,roleId])
        return (
            <div>
                <Form layout="vertical" ref={ref}>
                    <Form.Item name='username' label="用户名" rules={[
                        {
                            required: true,
                            message: '请输入用户名',
                        },
                    ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name='password' label="密码" rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item name='region' label="区域" rules={isDisabled ? [] : [
                        {
                            required: true,
                            message: '请选择区域',
                        },
                    ]}
                    >
                        <Select disabled={isDisabled}>
                            {
                                props.regionList.map(item => {
                                    return <Option disabled={checkRegionDisabled(item)} key={item.id}
                                                   value={item.value}>{item.title}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name='roleId' label="角色" rules={[
                        {
                            required: true,
                            message: '请选择角色',
                        },
                    ]}
                    >
                        <Select onChange={(value) => {
                            console.log(value);
                            if (value === 1) {
                                setDisAbled(true)
                                ref.current.setFieldsValue({
                                    region: ''
                                })
                            } else {
                                setDisAbled(false)
                            }


                        }}>
                            {props.roleList.map(item => {
                                return <Select.Option disabled={checkRoleDisabled(item)} key={item.id}
                                                      value={item.id}>{item.roleName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>

                </Form>
            </div>
        )
    }
)
export default UserForm
