import React, {useEffect, useState} from 'react'
import './index.css'

import {Layout, Menu} from 'antd';
// import axios from "axios";
import {request} from "@/utils/request";
import {useLocation, useNavigate} from 'react-router-dom';
import {
    HomeOutlined,
    UserOutlined,
    LockOutlined,
    SendOutlined,
    MessageOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import {useSelector} from "react-redux";

const {Sider} = Layout;
export default function SiderMenu() {
    const navigate = useNavigate()
    const location = useLocation()
    // 左侧侧边栏原始数据
    const [menuList, setMenuList] = useState([])

    const isCollapsed = useSelector(state => state.collapsed.isCollapsed)

    // 获取菜单数据
    const getMenuList = () => {
        request.get('/rights?_embed=children').then(res => {
            // console.log(res.data)
            setMenuList(res.data)
        })
    }

    // 因为antd 的菜单组件，需要将title替换为label，否则无法正常显示
    function titleToLabel(arr) {
        arr.map(item => {
            item.label = item.title
            if (item.children && item.children.length > 0) {
                titleToLabel(item.children)
            }
            return item
        })
    }

    titleToLabel(menuList)


    // 只有 pagepermisson 字段才显示成菜单
    function filterMenuList(arr) {
        return arr
            .filter(item => item.pagepermisson === 1)
            .map(child => {
                if (child.children && child.children.length > 0) {
                    return {
                        ...child,
                        children: filterMenuList(child.children)
                    }
                }
                return child
            })
    }

    // 过滤完 pagepermisson 字段的菜单列表
    const newMenuList = filterMenuList(menuList)


    // 根据登陆的用户所具有的权限来展示 相应的菜单
    // 首先获取登陆用户所具有的权限
    const {role: {rights}} = JSON.parse(localStorage.getItem('token'))
    // const rightArray = Array.isArray(rights)
    // console.log(rights) // rights 返回的是一个数组
    // 然后跟所有列表中的key比较，包含，就展示出来，不包含就说明该用户不具备该权限
    const showMenuList = newMenuList
        .filter(item => item.pagepermisson && rights.includes(item.key)) // 过滤顶层菜单
        .map(item => {
            if (item.children && item.children.length > 0) {
                // 过滤子菜单
                item.children = item.children.filter(child =>
                    child.pagepermisson && rights.includes(child.key)
                );
            }
            return item; // 返回修改后的菜单项
        });

    //  showMenuList  -- 设置图标
    showMenuList.forEach(item => {
        switch (item.label) {
            case '首页':
                item.icon = <HomeOutlined/>
                item.children = ''
                break;
            case '用户管理':
                item.icon = <UserOutlined/>
                break;
            case '权限管理':
                item.icon = <LockOutlined/>
                break;
            case '新闻管理':
                item.icon = <MessageOutlined/>
                break;
            case '审核管理':
                item.icon = <ThunderboltOutlined/>
                break;
            case '发布管理':
                item.icon = <SendOutlined/>
                break;
            default:
                break;
        }
    })


    useEffect(() => {
        getMenuList()
    }, []);

    // 浏览器提醒，需要将rightId 转成小写的 rightid
    function toRightId(arr) {
        arr.map(item=>{
            if(item.rightId){
                item.rightid = item.rightId
                delete item.rightId
            }
            if (item.children && item.children.length>0){
                toRightId(item.children)
            }
            return item
        })
    }
    toRightId(newMenuList)


    // 当前选中的菜单项
    const selectKeys = [location.pathname]
    // 默认展开的菜单项
    const openKeys = ['/' + location.pathname.split('/')[1]]


    // console.log(selectKeys)
    return (
        <div>
            <Sider trigger={null} collapsible collapsed={isCollapsed}>
                <div style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
                    <div className="demo-logo-vertical">全球新闻发布系统</div>
                    <div style={{flex: '1', overflow: 'auto'}}>
                        <Menu
                            onClick={(eve) => {
                                // console.log(eve.key);
                                navigate(eve.key)
                            }}
                            theme="dark"
                            mode="inline"
                            selectedKeys={selectKeys}
                            defaultOpenKeys={openKeys}
                            items={showMenuList}
                        />
                    </div>
                </div>

            </Sider>
        </div>
    )
}
