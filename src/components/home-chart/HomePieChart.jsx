import React, {useEffect, useRef, useState} from 'react';
import _ from "lodash";
import * as echarts from "echarts";
import {request} from "@/utils/request";

function HomePieChart(props) {

    const [pieChart, setPieChart] = useState(null)

    const [myNewsCategory, setMyNewsCategory] = useState([]);
    const pieRef = useRef(null);
    const { username } = JSON.parse(localStorage.getItem('token'))


    const getMyNewsCategory = async () => {
        const { data } = await request.get(`/news?publishState=2&_expand=category`)
        // console.log(data)
        setMyNewsCategory(data)
    }
    useEffect(()=>{
        getMyNewsCategory()
    },[])


    const renderPie = () => {
        // 数据处理
        let currentList = myNewsCategory.filter(item => item.author === username)
        console.log(currentList)
        let groupObj = _.groupBy(currentList, item => item.category.title)
        let list = [];
        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        // 基于准备好的dom，初始化echarts实例
        let myChart;
        if (!pieChart) {
            myChart = echarts.init(pieRef.current);
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '当前用户新闻分类图示',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '新闻数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
        // 窗口大小改变，调用eCharts实例的resize方法
        window.onresize = () => {
            myChart.resize()
        }
        return () => {
            // 组件销毁时，销毁echarts实例
            window.onresize = null
        }
    }
    useEffect(()=>{
        setTimeout(()=>{
            renderPie()
        },0)

    })
    return (
        <div ref={pieRef} style={{width: '100%', height: '300px', marginTop: '20px'}}></div>
    );
}

export default HomePieChart;
