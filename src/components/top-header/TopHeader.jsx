import React from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';

import { Button, Layout, theme, Dropdown, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {changeCollapsed} from "@/store/modules/collapsedReducer";

const { Header } = Layout;
export default function TopHeader() {
    // 设置展开列表
    const isCollapsed = useSelector(state => state.collapsed.isCollapsed)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const { username, role: { roleName } } = JSON.parse(localStorage.getItem('token'))

    const items = [
        {
            key: '1',
            label: roleName
        },
        {
            key: '2',
            danger: true,
            label: '退出',
            onClick: () => {
                localStorage.removeItem('token')
                navigate('/login')
            }
        },
    ];
    const handleCollapse = () => {
        dispatch(changeCollapsed())
    }

    return (
        <div>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                    position: 'relative'
                }}
            >
                <Button
                    type="text"
                    icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => handleCollapse()}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <div style={{ position: 'absolute', right: '30px', top: '0px' }}>
                    <span>欢迎<span style={{color:'#3875f6'}}>{username}</span>回来</span>
                    <Dropdown
                        menu={{
                            items,
                        }}
                    >

                        <Space>
                            <Avatar size={48} icon={<UserOutlined />} />
                            {/* <DownOutlined /> */}
                        </Space>

                    </Dropdown>
                </div>
            </Header >
        </div >
    )
}
