import React, {useRef,useEffect} from 'react';
import * as echarts from "echarts";
import {request} from "@/utils/request";
import _ from "lodash";

function HomeBarChart(props) {
    const barRef = useRef(null);
    const getNewsCategory = async () => {
        const { data } = await request.get('/news?publishState=2&_expand=category')
        // setNewsCategory(data)
        renderBar(_.groupBy(data, item => item.category.title))

    }

    useEffect(()=>{
        getNewsCategory()
    },[])

    const renderBar = (obj) => {


        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(barRef.current);

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['新闻数量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: Object.keys(obj),
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        rotate: '30',  // x轴的标签旋转30度
                        interval: 0  // 设置为0，强制显示所有x轴的标签，不会因为缩放而不显示
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    minInterval: 1
                },



            ],
            series: [
                {
                    name: '新闻数量',
                    type: 'bar',
                    barWidth: '50%',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // 窗口大小改变，调用eCharts实例的resize方法
        window.onresize = () => {
            myChart.resize()
        }

        return () => {
            // 组件销毁时，销毁echarts实例
            window.onresize = null
        }
    }
    return (
        <div ref={barRef} style={{width: '90%', height: '280px', marginTop: '20px'}}></div>
    );
}

export default HomeBarChart;
