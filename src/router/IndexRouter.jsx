import React,{useEffect,useState} from 'react'

import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import {request} from "@/utils/request";


import Login from '@/views/login/Login'
import NewsSandBox from '@/views/sendbox/NewsSandBox'
import Home from '@/views/sendbox/home/Home'
import UserList from '@/views/sendbox/user-manage/UserList'
import RightList from '@/views/sendbox/right-manage/RightList'
import Nopermission from '@/views/sendbox/nopermission/Nopermission'
import RoleList from '@/views/sendbox/right-manage/RoleList'
import NewsPreview from "@/views/sendbox/news-manage/NewsPreview";
import NewsAdd from "@/views/sendbox/news-manage/NewsAdd";
import NewsCategory from "@/views/sendbox/news-manage/NewsCategory";
import NewsDraft from "@/views/sendbox/news-manage/NewsDraft";
import NewsUpdate from "@/views/sendbox/news-manage/NewsUpdate";
import Audit from "@/views/sendbox/audit-manage/Audit";
import AuditList from "@/views/sendbox/audit-manage/AuditList";
import Unpublished from "@/views/sendbox/pubilsh-manage/Unpublished";
import Published from "@/views/sendbox/pubilsh-manage/Published";
import Sunset from "@/views/sendbox/pubilsh-manage/Sunset";


const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}


export default function IndexRouter() {
    const loginToken = localStorage.getItem('token')
    const [BackRouterList, setBackRouterList] = useState([])

    useEffect(() => {
        Promise.all([
            request.get('/rights'),
            request.get('/children')
        ]).then(res => {
            setBackRouterList([...res[0].data, ...res[1].data])
        })
    }, [])

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    const userInfo = JSON.parse(localStorage.getItem('token'))
    // 检查当前用户权限
    const checkUserPermission = (item) => {
        return userInfo?.role?.rights.includes(item.key)
    }
    return (
        <HashRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={loginToken ? <NewsSandBox /> : <Navigate to='/login' />} >

                    {
                        BackRouterList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key} element={LocalRouterMap[item.key]} key={item.key} />
                            }

                        })
                    }

                    <Route path='/' element={<Navigate to='/home' />} />
                    {
                        BackRouterList.length > 0 && <Route path='*' element={<Nopermission />} />
                    }

                </Route>
            </Routes>
        </HashRouter>
    )
}
