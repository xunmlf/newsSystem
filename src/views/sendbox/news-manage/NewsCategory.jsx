import { Table, Button, message, Form, Input, Modal } from 'antd'
import {
    useState,
    useEffect,
    createContext,
    useRef,
    useContext
} from 'react';
import {request} from "@/utils/request";
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons'

const { confirm } = Modal


const EditableContext = createContext(null);

export default function NewsCategory() {
    const [categoryList, setCategoryList] = useState([])
    useEffect(() => {
        request.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])


    const onClickDelete = (id) => {
        confirm({
            title: '您确定要删除此栏目吗?',
            content: '删除后不可恢复',
            icon: <ExclamationCircleFilled />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                onClickDeleteOk(id)
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    const onClickDeleteOk = (id) => {
        request.delete(`/categories/${id}`).then(res => {
            // console.log(res);
            setCategoryList(categoryList.filter(item => item.id !== id))
            message.success('删除成功')
        }).catch(err => {
            message.error('删除失败')
        })
    }

    const handleSave = (record) => {
        const index = categoryList.findIndex(item => item.id === record.id)
        record.title === categoryList[index].title
            ?
            message.info('栏目名称未修改')
            :

            // console.log(record);
            request.patch(`/categories/${record.id}`, {
                title: record.title,
                value: record.title,
            }).then(res => {
                setCategoryList(categoryList.map(item => {
                    if (item.id === record.id) {
                        return {
                            ...item,
                            title: record.title,
                            value: record.title,

                        }
                    }
                    return item
                }))
                message.success('更新成功')
            }).catch(err => {
                message.error('更新失败')
            })

    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: record => ({
                record,
                title: '栏目名称',
                dataIndex: 'title',
                editable: true,  // 可编辑的单元格
                handleSave,
            }),
        },
        {
            title: '操作',
            render: ({ id }) => <div>
                <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onClickDelete(id)} />
            </div>
        }
    ]

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };



    // 可编辑单元格
    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingInlineEnd: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };






    return (
        <div>

            <Table
                dataSource={categoryList}
                columns={columns}
                rowKey={item => item.id}
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    }
                }}
                pagination={{ pageSize: 5 }} />


        </div >
    )
}
