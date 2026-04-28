import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries, fetchSummary } from '../features/stock/stockSlice';
import {
    Package,
    DollarSign,
    AlertTriangle,
    CalendarDays,
    Apple,
    Carrot,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatCard = ({ icon: Icon, label, value }) => (
    <Card className="border border-gray-200 shadow-none rounded-xl">
        <CardContent className="p-5">
            <div className="flex flex-col gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{value ?? '—'}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const getCategoryIcon = (category) => {
    const icons = {
        Fruits: Apple,
        Vegetables: Carrot,
    };
    return icons[category] || Package;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const formatCurrency = (value) => {
    if (!value) return '—';
    return `$${parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const { entries, summary, loading } = useSelector((state) => state.stock);

    useEffect(() => {
        dispatch(fetchSummary());
        dispatch(fetchEntries({ limit: 10 }));
    }, [dispatch]);

    return (
        <div className="space-y-6">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Package}
                    label="Total Products"
                    value={summary?.total_products?.toLocaleString() ?? '—'}
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Stock Value"
                    value={summary?.total_stock_value
                        ? `KES ${parseFloat(summary.total_stock_value).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                        })}`
                        : '—'}
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Low Stock Alerts"
                    value={summary?.low_stock_alerts ?? '—'}
                />
                <StatCard
                    icon={CalendarDays}
                    label="Today's Entries"
                    value={summary?.today_entries ?? '—'}
                />
            </div>

            {/* Recent Stock Entries Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">
                        Recent Stock Entries
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <svg className="animate-spin h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Package className="w-10 h-10 mb-3" />
                        <p className="text-sm">No stock entries yet</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Unit Price
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Date Added
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {(() => {
                                                        const Icon = getCategoryIcon(entry.category);
                                                        return (
                                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                                                <Icon className="w-4 h-4 text-gray-600" />
                                                            </div>
                                                        );
                                                    })()}
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {entry.product_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {entry.category}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {entry.quantity} {entry.unit}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatCurrency(entry.unit_price)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(entry.date_added)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {entries.map((entry) => (
                                <div key={entry.id} className="px-4 py-4 space-y-2">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = getCategoryIcon(entry.category);
                                            return (
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <Icon className="w-4 h-4 text-gray-600" />
                                                </div>
                                            );
                                        })()}
                                        <span className="text-sm font-medium text-gray-900">
                                            {entry.product_name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pl-11">
                                        <div>
                                            <p className="text-xs text-gray-400">Category</p>
                                            <p className="text-sm text-gray-600">{entry.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Quantity</p>
                                            <p className="text-sm text-gray-600">{entry.quantity} {entry.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Unit Price</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(entry.unit_price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Date Added</p>
                                            <p className="text-sm text-gray-600">{formatDate(entry.date_added)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-400">
                                Showing {entries.length} most recent entries
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;