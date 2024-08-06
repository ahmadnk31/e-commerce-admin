import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getTotalProductsInStock } from "@/actions/get-total-products-in-stock";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { formatPrice } from "@/lib/format-price";
import { Separator } from "@radix-ui/react-separator";
import { get } from "http";
import { CreditCard, DollarSign, Package, Warehouse } from "lucide-react";

interface DashboardPageProps {
    params:{
        storeId:string
    }
}


export default async function DashboardPage({params}:DashboardPageProps) {
    const totalRevenue=await getTotalRevenue(params.storeId)
    const totalSales=await getTotalSales(params.storeId)
    const totalProductsInStock=await getTotalProductsInStock(params.storeId)
    const graphRevenue=await getGraphRevenue(params.storeId)
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading
                    title="Dashboard"
                    description="Overview of your store"
                />
                <Separator/>
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
                            <DollarSign className="size-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatPrice(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                            <CreditCard className="size-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalSales}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center flex-row justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products in stock</CardTitle>
                            <Package className="size-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalProductsInStock}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphRevenue}/>
                     </CardContent>
                </Card>
            </div>
        </div>
    )
}