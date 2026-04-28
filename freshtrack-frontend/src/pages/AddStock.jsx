import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEntry } from '../features/stock/stockSlice';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
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

const stockSchema = z.object({
  product_name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name too long'),
  category: z.enum(['Fruits', 'Vegetables'], {
    required_error: 'Please select a category',
  }),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .refine((val) => parseFloat(val) > 0, 'Quantity must be greater than 0'),
  unit: z.enum(['kg', 'pieces'], {
    required_error: 'Please select a unit',
  }),
  unit_price: z
    .string()
    .min(1, 'Unit price is required')
    .refine((val) => parseFloat(val) > 0, 'Unit price must be greater than 0'),
  date_added: z.string().min(1, 'Date is required'),
});

const AddStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.stock);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      date_added: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      createEntry({
        ...data,
        quantity: parseFloat(data.quantity),
        unit_price: parseFloat(data.unit_price),
      })
    );

    if (createEntry.fulfilled.match(result)) {
      toast.success('Stock entry added successfully');
      reset();
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to add stock entry');
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Stock Entry</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter new inventory items into the system
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Product Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter product name"
              className="h-11 border-gray-200"
              {...register('product_name')}
            />
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
                  <SelectTrigger className="h-11 border-gray-200 w-full">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="0"
                step="0.01"
                min="0"
                className="h-11 border-gray-200"
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
                    <SelectTrigger className="h-11 border-gray-200 w-full">
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                K
              </span>
              <Input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="h-11 pl-7 border-gray-200"
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
            <Input
              type="date"
              className="h-11 border-gray-200"
              {...register('date_added')}
            />
            {errors.date_added && (
              <p className="text-xs text-red-500">{errors.date_added.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-700 text-white h-11 px-6 rounded-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Submit
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="h-11 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <span className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </span>
            </Button>
          </div>

        </form>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
        <span className="text-gray-400">ℹ</span>
        All fields marked with * are required. Please ensure all information is accurate before submitting.
      </p>

    </div>
  );
};

export default AddStock;