import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, AreaChart, CartesianGrid, Area, Tooltip, Legend, Line, LineChart } from "recharts"
import { PriceData } from "../interfaces/crypto"

interface HistoryChartProps {
    priceHistory: PriceData[];
}



export default function HistoryChart({ priceHistory }: HistoryChartProps) {

    return (
        <ResponsiveContainer width="100%" height={400}>

            <AreaChart
                width={90000}
                height={250}
                data={priceHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#051aff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#230ec2" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" interval={60} />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="price"
                    fill="url(#chartColor)" // Set fill color to primary color
                    name="BTC Price"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

