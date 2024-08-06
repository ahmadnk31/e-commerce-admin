'use client'

import {ResponsiveContainer
    , XAxis
    , YAxis
    , Tooltip,
    BarChart,
    Bar

} from 'recharts'
interface OverviewProps {
    data:any[]
}

export function Overview({data}:OverviewProps) {
    return(
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis 
            stroke='#0891b2'
            fontSize={18}
            tickLine={false}
            axisLine={false}
            dataKey="name"/>
            <YAxis
            stroke='#0891b2'
            fontSize={18}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value)=>`$${value}`}
            />
            <Tooltip/>
            <Bar dataKey="total" fill="#164e63" radius={[4,4,0,0]}/>
        </BarChart>
    </ResponsiveContainer>
    )
}