
import { message } from "antd"
import {request} from "@/utils/request";

import { useEffect, useState } from "react"

function usePublish(type) {
    const [datasource, setDatasource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        request.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            setDatasource(res.data)
        })
    }, [username, type])


    const handleDelete = (id) => {
        // console.log(id);
        request.delete(`/news/${id}`).then(res => {
            setDatasource(datasource.filter(data => data.id !== id))
            message.success('删除成功')
        }).catch(err => {
            message.error('删除失败')
        })

    }

    const handleSunset = (id) => {
        // console.log(id);
        request.patch(`/news/${id}`, {
            publishState: 3
        })
            .then(() => {
                setDatasource(datasource.filter(item => item.id !== id))
                message.success('新闻已下线！', 2)
            })
            .catch(() => {
                message.error('新闻下线失败！', 2)
            })
    }
    const handlePublish = (id) => {
        // console.log(id);
        request.patch(`/news/${id}`, {
            publishState: 2
        })
            .then(() => {
                setDatasource(datasource.filter(item => item.id !== id))
                message.success('新闻已上线！', 2)
            })
            .catch(() => {
                message.error('新闻上线失败！', 2)
            })
    }

    return {
        datasource,
        handleDelete,
        handleSunset,
        handlePublish
    }
}

export default usePublish
