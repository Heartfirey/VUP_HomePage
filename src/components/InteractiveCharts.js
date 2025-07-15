import React, { useMemo } from 'react';
import EChartsReact from 'echarts-for-react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';

const formatDate = (timestamp) => dayjs(timestamp).format('MM-DD');

const InteractiveEchartsBar = ({ infoList, barName = "数值变化" }) => {
    const computedData = useMemo(() => {
        return infoList.map((item, index) => {
            const delta = index === 0 ? 'N/A' : item.guardNum - infoList[index - 1].guardNum;
            return {
                ...item,
                date: formatDate(item.time),
                delta
            };
        });
    }, [infoList]);

    const xAxisData = computedData.map(item => item.date);
    const seriesData = computedData.map(item => ({ value: item.guardNum, delta: item.delta }));

    const totalPoints = computedData.length;
    const defaultStart = totalPoints > 14 ? ((totalPoints - 14) / totalPoints) * 100 : 0;

    const chartOption = {
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const { value, delta } = params.data;
                let deltaText = delta === 'N/A' ? 'N/A' : (delta >= 0 ? `+${delta}` : delta);
                return `<div style="line-height:1.5;">
                  <strong>${barName}</strong><br/>
                  <span>值: ${value}</span><br/>
                  <span>变化: ${deltaText}</span>
                </div>`;
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                interval: 'auto',
            },
            splitLine: {
                show: false,
              }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true,
                lineStyle: {
                  color: '#777', 
                  width: 1, 
                  type: 'solid'
                }
              }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        series: [
            {
                name: barName,
                type: 'bar',
                data: seriesData,
                barMaxWidth: '50%',
                itemStyle: {
                    color: 'rgba(130, 177, 255, 0.5)',
                    borderColor: '#2962FF',
                    borderWidth: 1
                }
            }
        ],
        dataZoom: [
            {
                type: 'slider',
                xAxisIndex: 0,
                start: defaultStart,
                end: 100,
                height: 40,
                bottom: 10,
                showDataShadow: true,
                dataBackground: {
                    areaStyle: {
                        color: '#FFD180'
                    },
                    lineStyle: {
                        color: '#FF3D00'
                    }
                },
                handleStyle: {
                    color: 'rgb(255, 158, 128)',
                    borderColor: 'rgb(255, 61, 0)',
                    borderWidth: 1
                },
                moveHandleStyle: {
                    color: 'rgb(255, 158, 128)',
                    borderColor: 'rgb(255, 61, 0)',
                    borderWidth: 1
                },
                areaStyle:{
                    color: 'rgba(255, 158, 128, 0.5)' 
                },
                fillerColor: 'rgba(132, 255, 255, 0.5)',
                borderColor: 'transparent'
            }
        ]
    };

    return (
        <div className="w-full">
            <Box sx={{ width: '100%', height: 400 }}>
                <EChartsReact className="pb-4" option={chartOption} style={{ height: '100%', width: '100%' }} />
            </Box>
        </div>
    );
};

export default InteractiveEchartsBar;
