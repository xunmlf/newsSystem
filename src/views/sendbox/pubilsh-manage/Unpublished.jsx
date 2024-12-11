import React from 'react'
import NewsPublish from '@/components/publish-manage/NewsPublish'
import usePublish from "@/hooks/usePublish";
import { Button } from 'antd'
export default function Unpublished() {
    const { datasource, handlePublish } = usePublish(1)
    return (
        <div>
            <NewsPublish datasource={datasource} button={(id) =>
                <Button danger onClick={() => handlePublish(id)}>上线</Button>
            }></NewsPublish>
        </div>
    )
}
