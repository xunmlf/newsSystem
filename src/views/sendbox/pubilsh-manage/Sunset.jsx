import React from 'react'
import NewsPublish from '@/components/publish-manage/NewsPublish'
import usePublish from "@/hooks/usePublish";
import { Button } from 'antd'
export default function Sunset() {
    const { datasource, handleDelete } = usePublish(3)
    return (
        <div>
            <NewsPublish datasource={datasource} button={(id) =>
                <Button danger onClick={() => handleDelete(id)}>删除</Button>
            }></NewsPublish>


        </div>
    )
}
