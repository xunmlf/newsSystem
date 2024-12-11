import React from 'react'
import NewsPublish from '@/components/publish-manage/NewsPublish'
import usePublish from "@/hooks/usePublish";
import { Button } from 'antd'

export default function Published() {
    const { datasource, handleSunset } = usePublish(2)
    return (
        <div>
            <NewsPublish
                datasource={datasource}
                button={(id) =>
                    <Button type="primary" onClick={() => handleSunset(id)}>下线</Button>
                }
            ></NewsPublish>


        </div>
    )
}
