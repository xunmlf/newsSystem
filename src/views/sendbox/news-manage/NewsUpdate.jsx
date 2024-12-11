import React, { createRef, useCallback, useEffect, useState } from 'react'
import { Typography, Steps, Space, Button, Form, Select, Input, message, notification } from "antd";
import { ProfileOutlined, MessageOutlined, CloudUploadOutlined, ExclamationOutlined } from '@ant-design/icons';

import style from './NewsAdd.module.css'
import {request} from "@/utils/request";
import NewsEditor from '@/components/news-editor/NewsEditor';
import { useNavigate, useParams } from 'react-router-dom';
const { Title } = Typography;

const { Step } = Steps

const { Option } = Select
export default function NewsUpdate() {
    const navigate = useNavigate()
    // 当前在第几步
    const [current, setCurrent] = useState(0)
    // 新闻分类数据
    const [newsCategory, setNewsCategory] = useState([])


    // 第一步表单数据
    const [formData, setFormData] = useState({})
    // 第二步 富文本数据
    const [content, setContent] = useState('')

    const formRef = createRef()

    // 获取当前需要更新的文章信息
    const { id } = useParams()
    const getNewsInfo = useCallback(async () => {
        const { data } = await request.get(`/news?id=${id}&_expand=category&_expand=role`)
        // console.log(data[0]);
        formRef.current.setFieldsValue({
            title: data[0].title,
            categoryId: data[0].categoryId,
        })
        setContent(data[0].content)

    }, [id,formRef])

    const getNewsCategory = async () => {
        const { data } = await request.get('/categories')
        setNewsCategory(data)
    }
    useEffect(() => {
        getNewsCategory()
        getNewsInfo()
    }, [])


    useEffect(() => {
        // console.log(formData);
    }, [formData])
    const handelNext = () => {
        if (current === 0) {
            formRef.current.validateFields().then(res => {
                console.log(res);
                setFormData(res)
                setCurrent(current + 1)
            })
                .catch(err => {
                    message.info('请检查表单项')
                })
        } else {
            if (content === "" || content === "<p></p>\n") {
                message.error('新闻内容不能为空！')
            } else {
                setCurrent(current + 1)
            }
        }

    }
    const handelPreview = () => {
        setCurrent(current - 1)
    }

    // 获取登陆用户信息
    const user = JSON.parse(localStorage.getItem('token'))
    const handelSave = (auditState) => {
        console.log(formData);

        request.patch(`/news/${id}`, {
            ...formData,
            "content": content,
            "auditState": auditState,  // auditState 0草稿箱  1待审核  2审核通过  3审核不通过
        }).then(res => {
            message.success(auditState === 0 ? '保存到草稿箱成功！' : '提交审核成功！')
            if (auditState === 0) {
                navigate('/news-manage/draft')
            } else {
                navigate('/audit-manage/list')
            }
            notification.open({
                message: '通知',
                icon: <ExclamationOutlined />,
                description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                duration: 3,
                placement: 'bottomRight'
            })

        })
    }

    return (
        <div>
            <Typography>
                <Title level={3}>更新新闻</Title>
                <Steps current={current}>
                    <Step title="基本信息" description="新闻标题，新闻分类" icon={<ProfileOutlined />} />
                    <Step title="新闻内容" description="新闻主体内容" icon={<MessageOutlined />} />
                    <Step title="新闻提交" description="保存草稿或提交审核" icon={<CloudUploadOutlined />} />
                </Steps>

                {/* 步骤内容 */}
                <div style={{ marginTop: '30px' }}>
                    {/* 第一步 */}
                    <div className={current === 0 ? '' : style.hidden}>
                        <Form
                            ref={formRef}
                            name='basic'
                            labelCol={{
                                span: 2,
                            }}
                            wrapperCol={{
                                span: 22,
                            }}
                        >
                            <Form.Item
                                label="新闻标题"
                                name="title"
                                rules={[{ required: true, message: '请输入新闻标题' }]}
                            >
                                <Input placeholder="请输入新闻标题" />
                            </Form.Item>

                            <Form.Item
                                label="新闻分类"
                                name="categoryId"
                                rules={[{ required: true, message: '请选择新闻分类' }]}
                            >
                                <Select>
                                    {
                                        newsCategory.map(item => {
                                            return <Option key={item.id} value={item.id}>{item.title}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>

                        </Form>
                    </div>

                    {/* 第二步 */}
                    <div className={current === 1 ? '' : style.hidden}>
                        <NewsEditor getContent={(value) => {
                            // console.log(value);
                            setContent(value)

                        }} content={content}></NewsEditor>
                    </div>

                    {/* 第三步 */}
                    <div className={current === 2 ? '' : style.hidden}>

                    </div>

                </div>

                {/* 按钮 */}
                <div style={{ margin: '40px 0' }}>
                    <Space>
                        {
                            current === 2 && <Space>
                                <Button type="primary" onClick={() => {
                                    handelSave(0)
                                }}>保存草稿</Button>
                                <Button danger onClick={() => {
                                    handelSave(1)
                                }}>提交审核</Button>
                            </Space>
                        }

                        {
                            current < 2 && <Button type="primary" onClick={() => {
                                handelNext()
                            }}>下一步</Button>
                        }

                        {
                            current > 0 && <Button onClick={() => {
                                handelPreview()
                            }}>上一步</Button>
                        }


                    </Space>
                </div>

            </Typography >
        </div >
    )
}
