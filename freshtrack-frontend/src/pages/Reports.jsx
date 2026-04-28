import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  fetchEntries,
  fetchSummary,
  updateEntry,
  deleteEntry,
} from '../features/stock/stockSlice';
import { toast } from 'sonner';
import {
  ListOrdered,
  DollarSign,
  Package,
  Download,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Edit Schema
const editSchema = z.object({
  product_name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.enum(['Fruits', 'Vegetables'], {
    required_error: 'Please select a category',
  }),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((val) => parseFloat(val) > 0, 'Must be greater than 0'),
  unit: z.enum(['kg', 'pieces'], { required_error: 'Please select a unit' }),
  unit_price: z
    .string()
    .min(1, 'Unit price is required')
    .refine((val) => parseFloat(val) > 0, 'Must be greater than 0'),
  date_added: z.string().min(1, 'Date is required'),
});

// Helpers
const formatCurrency = (value) =>
  `$${parseFloat(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// const formatDate = (dateStr) => {
//   if (!dateStr) return '—';
//   return new Date(dateStr).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// Stat Card
const ReportStatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1">
    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-3xl font-semibold text-gray-900">{value ?? '—'}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

// Edit Modal
const EditModal = ({ entry, open, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.stock);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    if (entry) {
      reset({
        product_name: entry.product_name,
        category: entry.category,
        quantity: String(entry.quantity),
        unit: entry.unit,
        unit_price: String(entry.unit_price),
        date_added: entry.date_added,
      });
    }
  }, [entry, reset]);

  const onSubmit = async (data) => {
    const result = await dispatch(
      updateEntry({
        id: entry.id,
        data: {
          ...data,
          quantity: parseFloat(data.quantity),
          unit_price: parseFloat(data.unit_price),
        },
      })
    );
    if (updateEntry.fulfilled.match(result)) {
      toast.success('Entry updated successfully');
      onClose();
    } else {
      toast.error('Failed to update entry');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Edit Stock Entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">

          {/* Product Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input className="h-10 border-gray-200" {...register('product_name')} />
            {errors.product_name && (
              <p className="text-xs text-red-500">{errors.product_name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-10 border-gray-200 w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                className="h-10 border-gray-200"
                {...register('quantity')}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500">{errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Unit <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-10 border-gray-200 w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="pieces">pieces</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.unit && (
                <p className="text-xs text-red-500">{errors.unit.message}</p>
              )}
            </div>
          </div>

          {/* Unit Price */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Unit Price <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                className="h-10 pl-7 border-gray-200"
                {...register('unit_price')}
              />
            </div>
            {errors.unit_price && (
              <p className="text-xs text-red-500">{errors.unit_price.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input type="date" className="h-10 border-gray-200" {...register('date_added')} />
            {errors.date_added && (
              <p className="text-xs text-red-500">{errors.date_added.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 bg-gray-900 hover:bg-gray-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Modal
const DeleteModal = ({ entry, open, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.stock);

  const handleDelete = async () => {
    const result = await dispatch(deleteEntry(entry.id));
    if (deleteEntry.fulfilled.match(result)) {
      toast.success('Entry deleted successfully');
      onClose();
    } else {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Delete Entry
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">
              {entry?.product_name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="h-10">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="h-10 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Reports Page
const Reports = () => {
  const dispatch = useDispatch();
  const { entries, summary, loading, total, pages } = useSelector(
    (state) => state.stock
  );

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const limit = 10;

  const loadData = (pageNum = 1) => {
    const params = { page: pageNum, limit };
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    dispatch(fetchEntries(params));
    dispatch(fetchSummary(fromDate || toDate ? { from: fromDate, to: toDate } : {}));
  };

  useEffect(() => {
    loadData(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleFilter = () => {
    setPage(1);
    loadData(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadData(newPage);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.error('No data to export');
      return;
    }
    const headers = ['Date', 'Product', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Total Value'];
    const rows = entries.map((e) => [
      e.date_added,
      e.product_name,
      e.category,
      e.quantity,
      e.unit,
      e.unit_price,
      e.total_value,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freshtrack-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  // Pagination helpers
  const getPaginationPages = () => {
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, '...', pages];
    if (page >= pages - 2) return [1, '...', pages - 2, pages - 1, pages];
    return [1, '...', page - 1, page, page + 1, '...', pages];
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">View and analyze your inventory data</p>
      </div>

      {/* Date Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">From Date</Label>
            <Input
              type="date"
              className="h-10 border-gray-200"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">To Date</Label>
            <Input
              type="date"
              className="h-10 border-gray-200"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <Button
            onClick={handleFilter}
            className="h-10 bg-gray-900 hover:bg-gray-700 text-white px-6 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        <ReportStatCard
          icon={ListOrdered}
          label="Total Entries"
          value={parseInt(summary?.total_entries || 0).toLocaleString()}
          sub="+12% from last month"
        />
        <ReportStatCard
          icon={DollarSign}
          label="Total Stock Value"
          value={summary?.total_stock_value
            ? formatCurrency(summary.total_stock_value)
            : '—'}
          sub="+8% from last month"
        />
        <ReportStatCard
          icon={Package}
          label="Most Stocked Item"
          value={summary?.most_stocked_item ?? '—'}
          sub={summary?.most_stocked_item ? 'units in stock' : undefined}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Inventory Reports</h2>
          <Button
            onClick={handleExportCSV}
            className="h-9 bg-gray-900 hover:bg-gray-700 text-white text-sm flex items-center gap-2 px-4"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package className="w-10 h-10 mb-3" />
            <p className="text-sm">No entries found for the selected period</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Product</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Category</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Total Value</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.date_added}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.product_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{entry.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {entry.quantity} {entry.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(entry.unit_price)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(entry.total_value)}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => setEditEntry(entry)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(entry)}
                              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {entries.map((entry) => (
                <div key={entry.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{entry.product_name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => setEditEntry(entry)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(entry)}
                          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-gray-600">{entry.date_added}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Category</p>
                      <p className="text-gray-600">{entry.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Quantity</p>
                      <p className="text-gray-600">{entry.quantity} {entry.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Unit Price</p>
                      <p className="text-gray-600">{formatCurrency(entry.unit_price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total Value</p>
                      <p className="text-gray-600">{formatCurrency(entry.total_value)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{' '}
                {total} entries
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                {getPaginationPages().map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        entry={editEntry}
        open={!!editEntry}
        onClose={() => setEditEntry(null)}
      />

      {/* Delete Modal */}
      <DeleteModal
        entry={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Reports;