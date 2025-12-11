// 第8章高级数据可视化 - 核心JavaScript代码
class AdvancedDataVisualization {
    constructor() {
        this.charts = {};
        this.currentDatasets = {
            vector: 0,
            lollipop: 0,
            dumbbell: 0,
            gantt: 0,
            pyramid: 0,
            funnel: 0,
            sankey: 0,
            treemap: 0,
            waffle: 0
        };
        this.init();
    }

    async init() {
        // 检查ECharts是否加载
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载，请检查CDN链接');
            return;
        }

        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // 初始化所有图表
        await this.initAllCharts();
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 添加平滑滚动
        this.initSmoothScroll();
        
        console.log('第8章高级数据可视化应用初始化完成');
    }

    // 初始化所有图表
    async initAllCharts() {
        try {
            console.log('开始初始化第8章高级图表...');
            
            // 初始化9个高级图表
            await this.initVectorFieldChart();
            await this.initLollipopChart();
            await this.initDumbbellChart();
            await this.initGanttChart();
            await this.initPopulationPyramidChart();
            await this.initFunnelChart();
            await this.initSankeyChart();
            await this.initTreemapChart();
            await this.initWaffleChart();
            
            console.log('所有高级图表初始化成功');
        } catch (error) {
            console.error('图表初始化失败:', error);
        }
    }

    // 8.1 矢量场流线图 (经典样式)
    async initVectorFieldChart() {
        const chartDom = document.getElementById('vector-field-chart');
        if (!chartDom) {
            console.error('找不到vector-field-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 生成矢量场流线数据
        const generateVectorData = (type = 0) => {
            const lines = [];
            const gridPoints = 15;
            
            // 在均匀网格上生成起始点
            for (let i = 0; i < gridPoints; i++) {
                for (let j = 0; j < gridPoints; j++) {
                    const startX = (i / (gridPoints - 1)) * 8 - 4;
                    const startY = (j / (gridPoints - 1)) * 8 - 4;
                    
                    const line = [];
                    let x = startX;
                    let y = startY;
                    const stepSize = 0.15;
                    const maxSteps = 50;
                    
                    for (let step = 0; step < maxSteps; step++) {
                        line.push([x, y]);
                        
                        // 根据类型选择矢量场
                        let dx, dy;
                        
                        if (type === 0) {
                            // 场1: 源汇场
                            dx = (x * x - y * y - 1) * 0.1;
                            dy = 2 * x * y * 0.1;
                        } else if (type === 1) {
                            // 场2: 旋转场
                            const r = Math.sqrt(x * x + y * y) + 0.01;
                            dx = -y / r * 0.2;
                            dy = x / r * 0.2;
                        } else {
                            // 场3: 双曲场
                            dx = Math.sin(y * 0.5) * 0.2;
                            dy = Math.cos(x * 0.5) * 0.2;
                        }
                        
                        x += dx;
                        y += dy;
                        
                        // 边界检查
                        if (Math.abs(x) > 4.5 || Math.abs(y) > 4.5) {
                            break;
                        }
                    }
                    
                    if (line.length > 3) {
                        lines.push(line);
                    }
                }
            }
            
            return lines;
        };

        const option = {
            title: {
                text: '矢量场流线图',
                left: 'center',
                textStyle: { fontSize: 16 }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.value && params.value.length >= 2) {
                        return `坐标: (${params.value[0].toFixed(2)}, ${params.value[1].toFixed(2)})`;
                    }
                    return '流线';
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                top: '15%',
                bottom: '12%'
            },
            xAxis: {
                type: 'value',
                name: 'X',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { fontSize: 12 },
                min: -4,
                max: 4,
                axisLabel: { color: '#666', fontSize: 11 },
                axisLine: { lineStyle: { color: '#333' } },
                splitLine: { 
                    show: true, 
                    lineStyle: { color: '#ddd', type: 'solid', width: 0.5 } 
                }
            },
            yAxis: {
                type: 'value',
                name: 'Y',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { fontSize: 12 },
                min: -4,
                max: 4,
                axisLabel: { color: '#666', fontSize: 11 },
                axisLine: { lineStyle: { color: '#333' } },
                splitLine: { 
                    show: true, 
                    lineStyle: { color: '#ddd', type: 'solid', width: 0.5 } 
                }
            },
            series: [{
                name: '流线',
                type: 'lines',
                coordinateSystem: 'cartesian2d',
                data: generateVectorData(0),
                lineStyle: {
                    width: 1.5,
                    opacity: 0.7,
                    curveness: 0,
                    color: '#1f77b4'
                },
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    symbolSize: 6,
                    color: '#ff7f0e'
                },
                progressive: 500,
                progressiveThreshold: 300
            }]
        };

        chart.setOption(option);
        this.charts.vector = { chart, generateVectorData };
    }

    // 8.2 棉棒图
    async initLollipopChart() {
        const chartDom = document.getElementById('lollipop-chart');
        if (!chartDom) {
            console.error('找不到lollipop-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        const categories = ['产品A', '产品B', '产品C', '产品D', '产品E', '产品F', '产品G', '产品H'];
        const data = [120, 200, 150, 80, 70, 110, 130, 90];

        // 为散点图创建正确的数据格式
        const scatterData = data.map((value, index) => ({
            value: [value, index],
            name: categories[index]
        }));

        const option = {
            title: {
                text: '棉棒图 - 产品销量对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesType === 'scatter') {
                        return `${params.name}: ${params.value[0]}件`;
                    }
                    return `${params.name}: ${params.value}件`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '销量（件）',
                nameTextStyle: { color: '#666' }
            },
            yAxis: {
                type: 'category',
                data: categories,
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [
                {
                    name: '棉棒',
                    type: 'bar',
                    data: data,
                    itemStyle: {
                        color: '#3498db',
                        opacity: 0.4
                    },
                    barWidth: '30%'
                },
                {
                    name: '数据点',
                    type: 'scatter',
                    data: scatterData,
                    itemStyle: {
                        color: '#e74c3c',
                        borderColor: '#c0392b',
                        borderWidth: 2
                    },
                    symbolSize: 15,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{@[0]}'
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.lollipop = { chart, categories, data, scatterData };
    }

    // 8.3 哑铃图
    async initDumbbellChart() {
        const chartDom = document.getElementById('dumbbell-chart');
        if (!chartDom) {
            console.error('找不到dumbbell-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        const categories = ['指标A', '指标B', '指标C', '指标D', '指标E', '指标F'];
        const data2020 = [65, 75, 82, 70, 88, 76];
        const data2021 = [72, 83, 78, 85, 92, 88];

        // 使用custom render实现哑铃图
        const barData = categories.map((category, index) => ({
            name: category,
            value: [data2020[index], index, data2021[index], index],
            change: data2021[index] - data2020[index],
            itemStyle: {
                color: data2021[index] > data2020[index] ? '#2ecc71' : '#e74c3c'
            }
        }));

        const option = {
            title: {
                text: '哑铃图 - 年度指标对比',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.seriesType === 'custom') {
                        const index = params.dataIndex;
                        const change = data2021[index] - data2020[index];
                        const changeSymbol = change > 0 ? '↑' : '↓';
                        const changeColor = change > 0 ? '#2ecc71' : '#e74c3c';
                        return `${categories[index]}<br/>2020年: ${data2020[index]}<br/>2021年: ${data2021[index]}<br/>变化: <span style="color:${changeColor}">${changeSymbol}${Math.abs(change)}</span>`;
                    }
                    return `${params.name}: ${params.value}`;
                }
            },
            legend: {
                data: ['2020年', '2021年'],
                top: '10%'
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '数值',
                min: 50,
                max: 100,
                nameTextStyle: { color: '#666' }
            },
            yAxis: {
                type: 'category',
                data: categories,
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [
                {
                    name: '变化区间',
                    type: 'custom',
                    renderItem: function(params, api) {
                        const categoryIndex = api.value(1);
                        const start = api.coord([api.value(0), categoryIndex]);
                        const end = api.coord([api.value(2), categoryIndex]);
                        const height = api.size([0, 1])[1] * 0.4;
                        
                        return {
                            type: 'group',
                            children: [
                                {
                                    type: 'line',
                                    shape: {
                                        x1: start[0], y1: start[1],
                                        x2: end[0], y2: end[1]
                                    },
                                    style: {
                                        stroke: api.visual('color'),
                                        lineWidth: 3
                                    }
                                }
                            ]
                        };
                    },
                    data: barData,
                    encode: {
                        x: [0, 2],
                        y: 1
                    }
                },
                {
                    name: '2020年',
                    type: 'scatter',
                    data: data2020.map((value, index) => ({
                        value: [value, index],
                        name: categories[index]
                    })),
                    itemStyle: {
                        color: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 2
                    },
                    symbolSize: 12
                },
                {
                    name: '2021年',
                    type: 'scatter',
                    data: data2021.map((value, index) => ({
                        value: [value, index],
                        name: categories[index]
                    })),
                    itemStyle: {
                        color: '#e74c3c',
                        borderColor: '#c0392b',
                        borderWidth: 2
                    },
                    symbolSize: 12
                }
            ]
        };

        chart.setOption(option);
        this.charts.dumbbell = { chart, categories, data2020, data2021, barData };
    }

    // 8.4 甘特图
    async initGanttChart() {
        const chartDom = document.getElementById('gantt-chart');
        if (!chartDom) {
            console.error('找不到gantt-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        const tasks = [
            { name: '需求分析', start: 0, duration: 15, progress: 100, color: '#3498db' },
            { name: '系统设计', start: 12, duration: 20, progress: 90, color: '#9b59b6' },
            { name: 'UI设计', start: 15, duration: 25, progress: 85, color: '#2ecc71' },
            { name: '前端开发', start: 35, duration: 45, progress: 60, color: '#e74c3c' },
            { name: '后端开发', start: 40, duration: 50, progress: 55, color: '#f39c12' },
            { name: '集成测试', start: 75, duration: 30, progress: 25, color: '#1abc9c' },
            { name: '部署上线', start: 90, duration: 15, progress: 10, color: '#34495e' }
        ];

        // 创建背景条和进度条数据
        const bgData = tasks.map((task, index) => ({
            name: task.name,
            value: [task.start, index, task.start + task.duration, index],
            itemStyle: { color: task.color, opacity: 0.3 }
        }));

        const progressData = tasks.map((task, index) => ({
            name: task.name,
            value: [task.start, index, task.start + task.duration * task.progress / 100, index],
            itemStyle: { color: task.color, opacity: 0.8 }
        }));

        const option = {
            title: {
                text: '甘特图 - 项目进度管理',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const task = tasks[params.dataIndex];
                    return `
                        <div style="font-weight:bold;margin-bottom:5px">${task.name}</div>
                        <div>开始: 第${task.start}天</div>
                        <div>持续: ${task.duration}天</div>
                        <div>进度: ${task.progress}%</div>
                        <div style="margin-top:5px">
                            <div style="background:#ddd;width:100px;height:8px;border-radius:4px;position:relative">
                                <div style="background:${task.color};width:${task.progress}%;height:8px;border-radius:4px"></div>
                            </div>
                        </div>
                    `;
                }
            },
            grid: {
                left: '10%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '项目天数',
                min: 0,
                max: 120,
                nameTextStyle: { color: '#666' },
                axisLabel: {
                    formatter: '{value}天'
                }
            },
            yAxis: {
                type: 'category',
                data: tasks.map(t => t.name),
                axisLine: { show: false },
                axisTick: { show: false }
            },
            series: [
                {
                    name: '任务背景',
                    type: 'custom',
                    renderItem: function(params, api) {
                        const categoryIndex = api.value(1);
                        const start = api.coord([api.value(0), categoryIndex]);
                        const end = api.coord([api.value(2), categoryIndex]);
                        const height = api.size([0, 1])[1] * 0.5;
                        
                        return {
                            type: 'rect',
                            shape: {
                                x: start[0],
                                y: start[1] - height/2,
                                width: end[0] - start[0],
                                height: height
                            },
                            style: {
                                fill: api.visual('color'),
                                opacity: api.visual('opacity')
                            }
                        };
                    },
                    data: bgData,
                    encode: { x: [0, 2], y: 1 },
                    z: 1
                },
                {
                    name: '任务进度',
                    type: 'custom',
                    renderItem: function(params, api) {
                        const categoryIndex = api.value(1);
                        const start = api.coord([api.value(0), categoryIndex]);
                        const end = api.coord([api.value(2), categoryIndex]);
                        const height = api.size([0, 1])[1] * 0.5;
                        
                        return {
                            type: 'rect',
                            shape: {
                                x: start[0],
                                y: start[1] - height/2,
                                width: end[0] - start[0],
                                height: height
                            },
                            style: {
                                fill: api.visual('color'),
                                opacity: api.visual('opacity')
                            }
                        };
                    },
                    data: progressData,
                    encode: { x: [0, 2], y: 1 },
                    z: 2
                },
                {
                    name: '进度文字',
                    type: 'scatter',
                    data: tasks.map((task, index) => ({
                        value: [task.start + task.duration/2, index],
                        name: `${task.progress}%`
                    })),
                    itemStyle: { opacity: 0 },
                    label: {
                        show: true,
                        position: 'inside',
                        color: '#fff',
                        fontWeight: 'bold'
                    },
                    symbolSize: 0,
                    z: 3
                }
            ]
        };

        chart.setOption(option);
        this.charts.gantt = { chart, tasks };
    }

    // 8.5 人口金字塔图 (经典样式)
    async initPopulationPyramidChart() {
        const chartDom = document.getElementById('population-pyramid-chart');
        if (!chartDom) {
            console.error('找不到population-pyramid-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 标准人口年龄分组
        const ageGroups = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', 
                         '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'];
        
        // 人口数据（万人）
        const male = [32, 34, 33, 31, 38, 45, 52, 48, 42, 38, 35, 28, 22, 18, 12, 8, 5];
        const female = [30, 32, 31, 29, 36, 43, 50, 46, 40, 36, 33, 26, 20, 16, 11, 7, 4];

        // 将男性数据转为负值用于左侧显示
        const maleNegative = male.map(value => -value);

        const option = {
            title: {
                text: '人口金字塔',
                left: 'center',
                textStyle: { fontSize: 18 }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(params) {
                    const ageGroup = params[0].axisValue + '岁';
                    let result = `<div style="font-weight:bold;margin-bottom:5px">${ageGroup}</div>`;
                    params.forEach(param => {
                        const value = Math.abs(param.value);
                        result += `<div style="color:${param.color}">${param.seriesName}: ${value}万人</div>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['男性', '女性'],
                top: '8%',
                itemGap: 30
            },
            grid: {
                left: '8%',
                right: '8%',
                top: '18%',
                bottom: '8%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: '人口（万人）',
                nameLocation: 'middle',
                nameGap: 40,
                nameTextStyle: { fontSize: 12 },
                axisLabel: {
                    formatter: function(value) {
                        return Math.abs(value);
                    },
                    fontSize: 11
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#333'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd',
                        type: 'solid'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: ageGroups,
                name: '年龄组',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: { fontSize: 12 },
                axisLine: { show: true, lineStyle: { color: '#333' } },
                axisTick: { show: false },
                axisLabel: {
                    margin: 8,
                    fontSize: 11,
                    formatter: function(value) {
                        return value + '岁';
                    }
                }
            },
            series: [
                {
                    name: '男性',
                    type: 'bar',
                    stack: 'population',
                    data: maleNegative,
                    itemStyle: {
                        color: '#4A90E2',
                        borderColor: '#2E5C8A',
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        position: 'left',
                        distance: 5,
                        formatter: function(params) {
                            return Math.abs(params.value);
                        },
                        color: '#333',
                        fontSize: 10,
                        fontWeight: 'normal'
                    },
                    barWidth: '80%',
                    emphasis: {
                        itemStyle: {
                            color: '#5BA0F2'
                        }
                    }
                },
                {
                    name: '女性',
                    type: 'bar',
                    stack: 'population',
                    data: female,
                    itemStyle: {
                        color: '#E85D75',
                        borderColor: '#B73E56',
                        borderWidth: 1
                    },
                    label: {
                        show: true,
                        position: 'right',
                        distance: 5,
                        formatter: '{c}',
                        color: '#333',
                        fontSize: 10,
                        fontWeight: 'normal'
                    },
                    barWidth: '80%',
                    emphasis: {
                        itemStyle: {
                            color: '#F86D85'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);
        this.charts.pyramid = { chart, ageGroups, male, female, maleNegative };
    }

    // 8.6 漏斗图
    async initFunnelChart() {
        const chartDom = document.getElementById('funnel-chart');
        if (!chartDom) {
            console.error('找不到funnel-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 销售漏斗数据
        const salesData = [
            { value: 1000, name: '访问网站', itemStyle: { color: '#3498db' } },
            { value: 600, name: '浏览商品', itemStyle: { color: '#9b59b6' } },
            { value: 300, name: '加入购物车', itemStyle: { color: '#2ecc71' } },
            { value: 150, name: '提交订单', itemStyle: { color: '#f39c12' } },
            { value: 80, name: '支付成功', itemStyle: { color: '#e74c3c' } },
            { value: 50, name: '完成购买', itemStyle: { color: '#e67e22' } }
        ];

        const option = {
            title: {
                text: '漏斗图 - 销售转化分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const percent = ((params.value / salesData[0].value) * 100).toFixed(1);
                    return `
                        <div style="font-weight:bold;margin-bottom:5px">${params.name}</div>
                        <div>用户数: ${params.value}人</div>
                        <div>转化率: ${percent}%</div>
                    `;
                }
            },
            legend: {
                data: ['销售漏斗'],
                top: '10%'
            },
            series: [
                {
                    name: '销售漏斗',
                    type: 'funnel',
                    left: '10%',
                    width: '80%',
                    height: '70%',
                    minSize: '15%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 2,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}: {c}人'
                    },
                    labelLine: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    emphasis: {
                        label: {
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: salesData
                }
            ]
        };

        chart.setOption(option);
        this.charts.funnel = { chart, salesData };
    }

    // 8.7 桑基图
    async initSankeyChart() {
        const chartDom = document.getElementById('sankey-chart');
        if (!chartDom) {
            console.error('找不到sankey-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 使用更丰富的桑基图数据
        const option = {
            title: {
                text: '桑基图 - 能源流向分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        return `<div style="font-weight:bold">${params.name}</div>能源总量: ${params.value}MW`;
                    } else if (params.dataType === 'edge') {
                        return `<div>${params.data.source} → ${params.data.target}</div>流量: ${params.data.value}MW`;
                    }
                    return params.data.value;
                }
            },
            series: [{
                type: 'sankey',
                data: [
                    { name: '太阳能', itemStyle: { color: '#f39c12' } },
                    { name: '风能', itemStyle: { color: '#3498db' } },
                    { name: '水能', itemStyle: { color: '#1abc9c' } },
                    { name: '核能', itemStyle: { color: '#9b59b6' } },
                    { name: '化石能源', itemStyle: { color: '#e74c3c' } },
                    { name: '地热能', itemStyle: { color: '#2ecc71' } },
                    { name: '生物质', itemStyle: { color: '#f1c40f' } },
                    { name: '发电厂', itemStyle: { color: '#34495e' } },
                    { name: '工业用电', itemStyle: { color: '#2c3e50' } },
                    { name: '居民用电', itemStyle: { color: '#7f8c8d' } },
                    { name: '商业用电', itemStyle: { color: '#95a5a6' } },
                    { name: '交通运输', itemStyle: { color: '#16a085' } },
                    { name: '损失', itemStyle: { color: '#c0392b' } },
                    { name: '储能系统', itemStyle: { color: '#27ae60' } }
                ],
                links: [
                    // 能源输入到发电厂
                    { source: '太阳能', target: '发电厂', value: 150 },
                    { source: '风能', target: '发电厂', value: 200 },
                    { source: '水能', target: '发电厂', value: 180 },
                    { source: '核能', target: '发电厂', value: 250 },
                    { source: '化石能源', target: '发电厂', value: 300 },
                    { source: '生物质', target: '发电厂', value: 70 },
                    
                    // 发电厂输出
                    { source: '发电厂', target: '工业用电', value: 400 },
                    { source: '发电厂', target: '居民用电', value: 300 },
                    { source: '发电厂', target: '商业用电', value: 200 },
                    { source: '发电厂', target: '储能系统', value: 60 },
                    { source: '发电厂', target: '损失', value: 80 },
                    
                    // 直接能源利用
                    { source: '太阳能', target: '储能系统', value: 50 },
                    { source: '太阳能', target: '居民用电', value: 30 },
                    { source: '地热能', target: '居民用电', value: 90 },
                    { source: '化石能源', target: '交通运输', value: 100 },
                    { source: '生物质', target: '工业用电', value: 40 }
                ],
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        curveness: 0.5,
                        opacity: 1
                    }
                },
                lineStyle: {
                    curveness: 0.5,
                    opacity: 0.6
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#aaa'
                },
                label: {
                    position: 'right',
                    fontSize: 12
                },
                left: '10%',
                right: '20%',
                nodeWidth: 20,
                nodeGap: 8,
                layoutIterations: 32
            }]
        };

        chart.setOption(option);
        this.charts.sankey = { chart };
    }

    // 8.8 树状图
    async initTreemapChart() {
        const chartDom = document.getElementById('treemap-chart');
        if (!chartDom) {
            console.error('找不到treemap-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 简化的树状图数据结构
        const treeData = {
            name: '销售数据',
            children: [
                {
                    name: '电子产品',
                    value: 3200,
                    children: [
                        { name: '手机', value: 1500 },
                        { name: '电脑', value: 1200 },
                        { name: '平板', value: 500 }
                    ]
                },
                {
                    name: '服装',
                    value: 2800,
                    children: [
                        { name: '男装', value: 1400 },
                        { name: '女装', value: 1100 },
                        { name: '童装', value: 300 }
                    ]
                },
                {
                    name: '食品',
                    value: 2200,
                    children: [
                        { name: '零食', value: 800 },
                        { name: '饮料', value: 900 },
                        { name: '生鲜', value: 500 }
                    ]
                },
                {
                    name: '家居',
                    value: 1800,
                    children: [
                        { name: '家具', value: 1000 },
                        { name: '装饰', value: 500 },
                        { name: '厨具', value: 300 }
                    ]
                }
            ]
        };

        const option = {
            title: {
                text: '树状图 - 销售数据分布',
                left: 'center',
                textStyle: { fontSize: 16 }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const data = params.data;
                    const percentage = ((params.value / 10000) * 100).toFixed(1);
                    return `
                        <div style="padding:8px;">
                            <div style="font-weight:bold;margin-bottom:5px;color:#333;">${data.name}</div>
                            <div style="color:#666;">销售额: ${params.value}万元</div>
                            <div style="color:#999;font-size:11px;margin-top:3px;">占比: ${percentage}%</div>
                        </div>
                    `;
                }
            },
            series: [{
                name: '销售数据',
                type: 'treemap',
                roam: false,
                nodeClick: null,
                visibleMin: 200,
                breadcrumb: {
                    show: false
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function(params) {
                        const name = params.name;
                        const value = params.value;
                        const percentage = ((value / 10000) * 100).toFixed(1);
                        return `${name}\n${value}万\n${percentage}%`;
                    },
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#fff',
                    textBorderColor: 'transparent',
                    textBorderWidth: 0
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 3,
                    gapWidth: 3,
                    color: function(params) {
                        const colors = [
                            '#5470c6', '#91cc75', '#fac858', '#ee6666', 
                            '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
                        ];
                        return colors[params.dataIndex % colors.length];
                    }
                },
                emphasis: {
                    label: {
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        borderWidth: 4,
                        borderColor: '#fff'
                    }
                },
                levels: [
                    {
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 4,
                            gapWidth: 4
                        },
                        upperLabel: {
                            show: true,
                            height: 40,
                            formatter: '{b}\n{c}万元',
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#fff'
                        }
                    },
                    {
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 3,
                            gapWidth: 3
                        }
                    }
                ],
                data: [treeData]
            }]
        };

        chart.setOption(option);
        this.charts.treemap = { chart, treeData };
    }

    // 8.9 华夫饼图
    async initWaffleChart() {
        const chartDom = document.getElementById('waffle-chart');
        if (!chartDom) {
            console.error('找不到waffle-chart容器');
            return;
        }

        chartDom.style.width = '100%';
        chartDom.style.height = '100%';

        const chart = echarts.init(chartDom);

        // 华夫饼图数据
        const categories = [
            { name: '产品A', value: 35, color: '#3498db' },
            { name: '产品B', value: 25, color: '#e74c3c' },
            { name: '产品C', value: 20, color: '#2ecc71' },
            { name: '产品D', value: 15, color: '#f39c12' },
            { name: '其他', value: 5, color: '#95a5a6' }
        ];

        // 创建华夫饼图网格数据
        const gridSize = 10;
        const totalCells = gridSize * gridSize;
        const waffleData = [];

        let cellIndex = 0;
        categories.forEach(category => {
            const cells = Math.round((category.value / 100) * totalCells);
            for (let i = 0; i < cells; i++) {
                waffleData.push({
                    value: [cellIndex % gridSize, Math.floor(cellIndex / gridSize)],
                    name: category.name,
                    itemStyle: { color: category.color }
                });
                cellIndex++;
            }
        });

        // 计算合适的方块大小
        const containerWidth = chartDom.clientWidth || 600;
        const containerHeight = chartDom.clientHeight || 400;
        const symbolSize = Math.min(containerWidth / gridSize * 0.9, containerHeight / gridSize * 0.9, 40);

        const option = {
            title: {
                text: '华夫饼图 - 产品市场份额',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const category = categories.find(c => c.name === params.name);
                    return `
                        <div style="font-weight:bold">${params.name}</div>
                        <div>占比: ${category.value}%</div>
                        <div>方块数: ${waffleData.filter(d => d.name === params.name).length}</div>
                    `;
                }
            },
            legend: {
                data: categories.map(c => ({
                    name: c.name,
                    icon: 'rect',
                    itemStyle: { color: c.color }
                })),
                bottom: '5%',
                itemGap: 20,
                textStyle: { fontSize: 12 }
            },
            grid: {
                left: '5%',
                right: '5%',
                top: '15%',
                bottom: '20%',
                containLabel: false
            },
            xAxis: {
                type: 'category',
                data: Array.from({length: gridSize}, (_, i) => i),
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: Array.from({length: gridSize}, (_, i) => i),
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            },
            series: [{
                name: '市场份额',
                type: 'scatter',
                symbolSize: symbolSize,
                symbol: 'rect',
                data: waffleData,
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1.5
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 8,
                        shadowColor: 'rgba(0, 0, 0, 0.4)',
                        borderColor: '#333',
                        borderWidth: 2
                    }
                },
                animationDelay: function (idx) {
                    return idx * 10;
                },
                animationDuration: 1000
            }]
        };

        chart.setOption(option);
        this.charts.waffle = { chart, categories, waffleData, symbolSize };
    }

    // 绑定事件监听器
    bindEvents() {
        // 矢量场控制按钮
        document.getElementById('vector-btn1')?.addEventListener('click', () => {
            this.currentDatasets.vector = (this.currentDatasets.vector + 1) % 3;
            const { chart, generateVectorData } = this.charts.vector;
            chart.setOption({
                series: [{
                    data: generateVectorData(this.currentDatasets.vector)
                }]
            });
        });

        document.getElementById('vector-btn2')?.addEventListener('click', () => {
            const { chart, generateVectorData } = this.charts.vector;
            const currentType = this.currentDatasets.vector;
            
            // 调整密度 - 在当前类型的不同密度之间切换
            const densities = [8, 12, 18];
            const currentIndex = this.vectorDensityIndex || 0;
            this.vectorDensityIndex = (currentIndex + 1) % densities.length;
            const newDensity = densities[this.vectorDensityIndex];
            
            // 重新生成不同密度的数据
            const generateDenseVectorData = (type = currentType, density = newDensity) => {
                const lines = [];
                for (let i = 0; i < density; i++) {
                    const line = [];
                    const startY = (i / density) * 10 - 5;
                    
                    for (let j = 0; j < 30; j++) {
                        let x = (j / 30) * 10 - 5;
                        let y = startY;
                        
                        if (type === 0) {
                            // 螺旋流场
                            const theta = Math.atan2(y, x);
                            const r = Math.sqrt(x * x + y * y) + 0.1;
                            const dx = Math.cos(theta + r * 0.3) * 0.2;
                            const dy = Math.sin(theta + r * 0.3) * 0.2;
                            x = x + dx;
                            y = y + dy;
                        } else if (type === 1) {
                            // 环形流场
                            const theta = Math.atan2(y, x);
                            const r = Math.sqrt(x * x + y * y);
                            if (r > 0.5) {
                                x = x + Math.sin(theta) * 0.15;
                                y = y - Math.cos(theta) * 0.15;
                            }
                        } else {
                            // 湍流场
                            x = x + Math.sin(y * 1.5) * 0.1;
                            y = y + Math.cos(x * 1.5) * 0.1;
                        }
                        
                        line.push([x, y]);
                    }
                    lines.push(line);
                }
                return lines;
            };
            
            chart.setOption({
                series: [{
                    data: generateDenseVectorData(currentType, newDensity)
                }]
            });
        });

        document.getElementById('vector-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.vector;
            const option = chart.getOption();
            const currentEffect = option.series[0].effect.show;
            option.series[0].effect.show = !currentEffect;
            chart.setOption(option);
        });

        // 棉棒图控制按钮
        document.getElementById('lollipop-btn1')?.addEventListener('click', () => {
            const { chart, categories, data } = this.charts.lollipop;
            const option = chart.getOption();
            const isHorizontal = option.xAxis[0].type === 'value';
            
            if (isHorizontal) {
                option.xAxis[0].type = 'category';
                option.yAxis[0].type = 'value';
                option.xAxis[0].data = categories;
                option.series[0].data = data;
                option.series[1].data = data.map((v, i) => ({
                    value: [i, v],
                    name: categories[i]
                }));
            } else {
                option.xAxis[0].type = 'value';
                option.yAxis[0].type = 'category';
                option.yAxis[0].data = categories;
                option.series[0].data = data;
                option.series[1].data = data.map((v, i) => ({
                    value: [v, i],
                    name: categories[i]
                }));
            }
            chart.setOption(option);
        });

        document.getElementById('lollipop-btn2')?.addEventListener('click', () => {
            const { chart } = this.charts.lollipop;
            const option = chart.getOption();
            const colors = [
                ['#3498db', '#e74c3c'],
                ['#2ecc71', '#9b59b6'],
                ['#f39c12', '#1abc9c']
            ];
            const colorIndex = this.currentDatasets.lollipop % colors.length;
            this.currentDatasets.lollipop++;
            
            option.series[0].itemStyle.color = colors[colorIndex][0];
            option.series[1].itemStyle.color = colors[colorIndex][1];
            chart.setOption(option);
        });

        document.getElementById('lollipop-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.lollipop;
            const option = chart.getOption();
            const currentShow = option.series[1].label.show;
            option.series[1].label.show = !currentShow;
            chart.setOption(option);
        });

        // 哑铃图控制按钮
        document.getElementById('dumbbell-btn1')?.addEventListener('click', () => {
            // 切换不同数据集
            const datasets = [
                { name: '年度对比', data2020: [65, 75, 82, 70, 88, 76], data2021: [72, 83, 78, 85, 92, 88] },
                { name: '季度对比', data2020: [58, 72, 68, 81, 75, 83], data2021: [65, 78, 74, 87, 81, 90] },
                { name: '区域对比', data2020: [71, 69, 85, 73, 80, 78], data2021: [78, 74, 82, 79, 86, 84] }
            ];
            
            this.currentDatasets.dumbbell = (this.currentDatasets.dumbbell + 1) % datasets.length;
            const dataset = datasets[this.currentDatasets.dumbbell];
            
            // 更新图表数据
            // 这里简化处理，实际应该重新生成完整的数据
            console.log(`切换到${dataset.name}数据集`);
        });

        // 甘特图控制按钮
        document.getElementById('gantt-btn1')?.addEventListener('click', () => {
            console.log('添加任务功能');
        });

        document.getElementById('gantt-btn2')?.addEventListener('click', () => {
            const { chart } = this.charts.gantt;
            const option = chart.getOption();
            console.log('显示/隐藏进度');
        });

        // 人口金字塔图控制按钮
        document.getElementById('pyramid-btn1')?.addEventListener('click', () => {
            // 切换年份的数据
            const yearData = [
                { year: '2020年', male: [1200, 1000, 900, 850, 800, 750, 600, 400, 200], female: [1100, 950, 850, 820, 780, 730, 580, 380, 180] },
                { year: '2021年', male: [1180, 980, 890, 840, 790, 740, 590, 390, 190], female: [1090, 940, 840, 810, 770, 720, 570, 370, 170] },
                { year: '2022年', male: [1160, 960, 880, 830, 780, 730, 580, 380, 180], female: [1080, 930, 830, 800, 760, 710, 560, 360, 160] }
            ];
            
            this.currentDatasets.pyramid = (this.currentDatasets.pyramid + 1) % yearData.length;
            const data = yearData[this.currentDatasets.pyramid];
            
            const { chart } = this.charts.pyramid;
            chart.setOption({
                series: [
                    { data: data.male.map(v => -v) },
                    { data: data.female }
                ],
                title: {
                    text: `人口金字塔图 - ${data.year}年龄结构分析`
                }
            });
        });

        // 漏斗图控制按钮
        document.getElementById('funnel-btn1')?.addEventListener('click', () => {
            const datasets = [
                { name: '销售漏斗', data: [{ value: 1000, name: '访问网站' }, { value: 600, name: '浏览商品' }, { value: 300, name: '加入购物车' }, { value: 150, name: '提交订单' }, { value: 80, name: '支付成功' }, { value: 50, name: '完成购买' }] },
                { name: '招聘漏斗', data: [{ value: 500, name: '投递简历' }, { value: 200, name: '筛选通过' }, { value: 100, name: '初试通过' }, { value: 50, name: '复试通过' }, { value: 20, name: '终试通过' }, { value: 10, name: '发放offer' }] },
                { name: '用户转化', data: [{ value: 800, name: '下载应用' }, { value: 400, name: '注册账户' }, { value: 200, name: '完善资料' }, { value: 100, name: '首次使用' }, { value: 60, name: '活跃用户' }, { value: 30, name: '付费用户' }] }
            ];
            
            this.currentDatasets.funnel = (this.currentDatasets.funnel || 0 + 1) % datasets.length;
            const dataset = datasets[this.currentDatasets.funnel];
            
            const { chart } = this.charts.funnel;
            chart.setOption({
                series: [{
                    data: dataset.data,
                    name: dataset.name
                }],
                title: {
                    text: `漏斗图 - ${dataset.name}分析`
                }
            });
        });

        document.getElementById('funnel-btn2')?.addEventListener('click', () => {
            const { chart } = this.charts.funnel;
            const option = chart.getOption();
            const currentSort = option.series[0].sort;
            option.series[0].sort = currentSort === 'descending' ? 'ascending' : 'descending';
            chart.setOption(option);
        });

        document.getElementById('funnel-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.funnel;
            const option = chart.getOption();
            const currentShow = option.series[0].label.show;
            option.series[0].label.show = !currentShow;
            chart.setOption(option);
        });

        // 桑基图控制按钮
        document.getElementById('sankey-btn1')?.addEventListener('click', () => {
            console.log('切换数据集功能');
        });

        document.getElementById('sankey-btn2')?.addEventListener('click', () => {
            const { chart } = this.charts.sankey;
            const option = chart.getOption();
            const currentCurveness = option.series[0].lineStyle.curveness;
            option.series[0].lineStyle.curveness = currentCurveness === 0.5 ? 0.8 : 0.5;
            chart.setOption(option);
        });

        document.getElementById('sankey-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.sankey;
            const option = chart.getOption();
            const currentLabel = option.series[0].label.show;
            option.series[0].label.show = !currentLabel;
            chart.setOption(option);
        });

        // 树状图控制按钮
        document.getElementById('treemap-btn1')?.addEventListener('click', () => {
            const datasets = [
                { 
                    name: '销售数据', 
                    title: '树状图 - 销售数据分布',
                    data: {
                        name: '销售数据',
                        children: [
                            {
                                name: '电子产品',
                                value: 3200,
                                children: [
                                    { name: '手机', value: 1500 },
                                    { name: '电脑', value: 1200 },
                                    { name: '平板', value: 500 }
                                ]
                            },
                            {
                                name: '服装',
                                value: 2800,
                                children: [
                                    { name: '男装', value: 1400 },
                                    { name: '女装', value: 1100 },
                                    { name: '童装', value: 300 }
                                ]
                            },
                            {
                                name: '食品',
                                value: 2200,
                                children: [
                                    { name: '零食', value: 800 },
                                    { name: '饮料', value: 900 },
                                    { name: '生鲜', value: 500 }
                                ]
                            }
                        ]
                    }
                },
                { 
                    name: '市场份额', 
                    title: '树状图 - 市场份额分布',
                    data: {
                        name: '市场份额',
                        children: [
                            {
                                name: '亚洲市场',
                                value: 4500,
                                children: [
                                    { name: '中国', value: 2800 },
                                    { name: '日本', value: 1200 },
                                    { name: '韩国', value: 500 }
                                ]
                            },
                            {
                                name: '欧洲市场',
                                value: 3200,
                                children: [
                                    { name: '德国', value: 1200 },
                                    { name: '法国', value: 1000 },
                                    { name: '英国', value: 1000 }
                                ]
                            },
                            {
                                name: '北美市场',
                                value: 2300,
                                children: [
                                    { name: '美国', value: 1800 },
                                    { name: '加拿大', value: 500 }
                                ]
                            }
                        ]
                    }
                },
                { 
                    name: '预算分配', 
                    title: '树状图 - 预算分配情况',
                    data: {
                        name: '总预算',
                        children: [
                            {
                                name: '研发部门',
                                value: 5000,
                                children: [
                                    { name: '产品设计', value: 2000 },
                                    { name: '技术开发', value: 2500 },
                                    { name: '测试验证', value: 500 }
                                ]
                            },
                            {
                                name: '市场部门',
                                value: 3000,
                                children: [
                                    { name: '广告宣传', value: 1500 },
                                    { name: '渠道推广', value: 1000 },
                                    { name: '品牌建设', value: 500 }
                                ]
                            },
                            {
                                name: '运营部门',
                                value: 2000,
                                children: [
                                    { name: '日常运营', value: 1000 },
                                    { name: '客户服务', value: 600 },
                                    { name: '物流配送', value: 400 }
                                ]
                            }
                        ]
                    }
                }
            ];
            
            this.currentDatasets.treemap = (this.currentDatasets.treemap + 1) % datasets.length;
            const dataset = datasets[this.currentDatasets.treemap];
            
            const { chart } = this.charts.treemap;
            chart.setOption({
                series: [{
                    data: [dataset.data]
                }],
                title: {
                    text: dataset.title
                }
            });
        });

        document.getElementById('treemap-btn2')?.addEventListener('click', () => {
            const { chart } = this.charts.treemap;
            const option = chart.getOption();
            const currentLabel = option.series[0].label.show;
            option.series[0].label.show = !currentLabel;
            chart.setOption(option);
        });

        document.getElementById('treemap-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.treemap;
            const option = chart.getOption();
            const currentFormatter = option.series[0].label.formatter;
            
            if (typeof currentFormatter === 'function') {
                // 如果是函数，切换为简单格式
                option.series[0].label.formatter = '{b}';
            } else {
                // 如果是字符串，切换为详细格式
                option.series[0].label.formatter = function(params) {
                    const name = params.name;
                    const value = params.value;
                    const percentage = ((value / 10000) * 100).toFixed(1);
                    return `${name}\n${value}万\n${percentage}%`;
                };
            }
            chart.setOption(option);
        });

        // 华夫饼图控制按钮
        document.getElementById('waffle-btn1')?.addEventListener('click', () => {
            const datasets = [
                { name: '市场份额', data: [{ name: '产品A', value: 35 }, { name: '产品B', value: 25 }, { name: '产品C', value: 20 }] },
                { name: '预算分配', data: [{ name: '研发', value: 40 }, { name: '市场', value: 30 }, { name: '运营', value: 20 }] },
                { name: '时间分配', data: [{ name: '工作', value: 45 }, { name: '学习', value: 25 }, { name: '休息', value: 20 }] }
            ];
            
            this.currentDatasets.waffle = (this.currentDatasets.waffle || 0 + 1) % datasets.length;
            const dataset = datasets[this.currentDatasets.waffle];
            
            // 重新生成华夫饼图数据
            const gridSize = 10;
            const totalCells = gridSize * gridSize;
            const waffleData = [];
            
            let cellIndex = 0;
            dataset.data.forEach(category => {
                const cells = Math.round((category.value / 100) * totalCells);
                const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#95a5a6'];
                for (let i = 0; i < cells; i++) {
                    waffleData.push({
                        value: [cellIndex % gridSize, Math.floor(cellIndex / gridSize)],
                        name: category.name,
                        itemStyle: { color: colors[dataset.data.indexOf(category)] }
                    });
                    cellIndex++;
                }
            });
            
            const { chart } = this.charts.waffle;
            chart.setOption({
                series: [{
                    data: waffleData
                }],
                title: {
                    text: `华夫饼图 - ${dataset.name}分析`
                },
                legend: {
                    data: dataset.data.map(c => c.name)
                }
            });
        });

        document.getElementById('waffle-btn2')?.addEventListener('click', () => {
            const gridSizes = [10, 8, 12];
            this.currentDatasets.waffleGrid = (this.currentDatasets.waffleGrid || 0 + 1) % gridSizes.length;
            const gridSize = gridSizes[this.currentDatasets.waffleGrid];
            
            // 重新生成网格
            // 这里简化处理，实际应该重新计算数据分布
            const { chart } = this.charts.waffle;
            const option = chart.getOption();
            option.xAxis.data = Array.from({length: gridSize}, (_, i) => i);
            option.yAxis.data = Array.from({length: gridSize}, (_, i) => i);
            chart.setOption(option);
            
            console.log(`切换到${gridSize}x${gridSize}网格`);
        });

        document.getElementById('waffle-btn3')?.addEventListener('click', () => {
            const { chart } = this.charts.waffle;
            const option = chart.getOption();
            const currentSymbol = option.series[0].symbol;
            option.series[0].symbol = currentSymbol === 'rect' ? 'circle' : 'rect';
            chart.setOption(option);
        });
    }

    // 平滑滚动
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // 数据加载方法
    async loadData(filename) {
        try {
            const response = await fetch(`data/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('数据加载失败:', error);
            return null;
        }
    }

    // 清理资源
    destroy() {
        Object.values(this.charts).forEach(chartObj => {
            if (chartObj.chart && !chartObj.chart.isDisposed()) {
                chartObj.chart.dispose();
            }
        });
        this.charts = {};
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.advancedViz = new AdvancedDataVisualization();
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        if (window.advancedViz) {
            window.advancedViz.destroy();
        }
    });
});