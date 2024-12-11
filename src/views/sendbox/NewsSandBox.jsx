import React from 'react'
import SiderMenu from '@/components/sider-menu/SiderMenu'
import TopHeader from '@/components/top-header/TopHeader'
import { Outlet } from 'react-router-dom'

import { Layout, theme } from 'antd';
import './NewsSandBox.scss'
const { Content } = Layout;

export default function NewsSandBox() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <SiderMenu />

            <Layout>

                <TopHeader />
                {/* 路由占位符 */}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet></Outlet>
                </Content>


            </Layout>
        </Layout>
    )
}
