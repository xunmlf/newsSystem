import React from 'react'

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import {
    Form,
    Input,
    Button,
    message,
} from 'antd'

import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons'

import './Login.scss'
import {request} from "@/utils/request";
import { useNavigate } from 'react-router-dom';
export default function Login() {

    const navigate = useNavigate()
    const onFinish = (values) => {
        console.log('Success:', values)
        request.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => {
                // console.log(res.data);
                if (res.data.length === 0) {
                    message.error('用户名或密码错误')
                } else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    navigate('/home')
                    message.open({
                        content: (
                            <div>
                                <SmileOutlined
                                    style={{
                                        color: '#108ee9',
                                        marginRight: '8px'
                                    }}
                                />
                                欢迎来到在线新闻发布管理系统！
                            </div>
                        ),
                        duration: 2,
                    });
                }

            }).catch(err => {
                // console.log(err)
                message.error('登录失败')
            })

    }
    const options = {
        "background": {
            "color": {
                "value": "#232741"
            },
            "position": "50% 50%",
            "repeat": "no-repeat",
            "size": "cover"
        },
        // 帧数，越低越卡,默认60
        "fpsLimit": 120,
        "fullScreen": {
            "zIndex": 1
        },
        "interactivity": {
            "events": {
                "onClick": {
                    "enable": true,
                    "mode": "push"
                },
                "onHover": {
                    "enable": true,
                    "mode": "slow"
                }
            },
            "modes": {
                "push": {
                    //点击是添加1个粒子
                    "quantity": 3,
                },
                "bubble": {
                    "distance": 200,
                    "duration": 2,
                    "opacity": 0.8,
                    "size": 20,
                    "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "mix": false,
                        "selectors": []
                    }
                },
                "grab": {
                    "distance": 400
                },
                //击退
                "repulse": {
                    "divs": {
                        //鼠标移动时排斥粒子的距离
                        "distance": 200,
                        //翻译是持续时间
                        "duration": 0.4,
                        "factor": 100,
                        "speed": 1,
                        "maxSpeed": 50,
                        "easing": "ease-out-quad",
                        "selectors": []
                    }
                },
                //缓慢移动
                "slow": {
                    //移动速度
                    "factor": 2,
                    //影响范围
                    "radius": 200,
                },
                //吸引
                "attract": {
                    "distance": 200,
                    "duration": 0.4,
                    "easing": "ease-out-quad",
                    "factor": 3,
                    "maxSpeed": 50,
                    "speed": 1

                },
            }
        },
        //  粒子的参数
        "particles": {
            //粒子的颜色
            "color": {
                "value": "#ffffff"
            },
            //是否启动粒子碰撞
            "collisions": {
                "enable": true,
            },
            //粒子之间的线的参数
            "links": {
                "color": {
                    "value": "#ffffff"
                },
                "distance": 150,
                "enable": true,
                "warp": true
            },
            "move": {
                "attract": {
                    "rotate": {
                        "x": 600,
                        "y": 1200
                    }
                },
                "enable": true,
                "outModes": {
                    "bottom": "out",
                    "left": "out",
                    "right": "out",
                    "top": "out"
                },
                "speed": 6,
                "warp": true
            },
            "number": {
                "density": {
                    "enable": true
                },
                //初始粒子数
                "value": 40
            },
            //透明度
            "opacity": {
                "value": 0.5,
                "animation": {
                    "speed": 3,
                    "minimumValue": 0.1
                }
            },
            //大小
            "size": {
                "random": {
                    "enable": true
                },
                "value": {
                    "min": 1,
                    "max": 3
                },
                "animation": {
                    "speed": 20,
                    "minimumValue": 0.1
                }
            }
        }
    }
    return (
        <div>
            <Particles init={async main => loadFull(main)} options={options} />
            <div className='login-container'>
                <div className='login-title'>全球新闻发布管理系统</div>
                <Form
                    className='login-form'
                    name="login"
                    initialValues={{
                        remember: true,
                    }}
                    style={{
                        maxWidth: 360,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            登陆
                        </Button>
                    </Form.Item>
                </Form>

            </div>


        </div >
    )
}
