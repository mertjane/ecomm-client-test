'use client';

import { useState, useEffect } from 'react';
import { Loader2, Package, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { accountApi, type Order } from '@/lib/api/account';

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await accountApi.getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-border rounded-lg p-4 hover:border-emperador/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Order #{order.id}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date_created).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{order.currency_symbol}{order.total}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="uppercase tracking-wide"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.replace('-', ' ')}
    </span>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-sm text-emperador hover:underline mb-4 inline-flex items-center"
      >
        ← Back to Orders
      </button>

      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold uppercase tracking-wide">Order #{order.id}</h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold uppercase tracking-wide text-sm mb-2">Order Details</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Date: {new Date(order.date_created).toLocaleDateString('en-GB')}</p>
            <p>Payment Method: {order.payment_method_title}</p>
            <p>Total: {order.currency_symbol}{order.total}</p>
          </div>
        </div>

        {order.shipping && (
          <div>
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-2">Shipping Address</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.shipping.first_name} {order.shipping.last_name}</p>
              <p>{order.shipping.address_1}</p>
              {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
              <p>{order.shipping.city}, {order.shipping.postcode}</p>
              <p>{order.shipping.country}</p>
            </div>
          </div>
        )}
      </div>

      <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">Items</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium uppercase tracking-wide">Product</th>
              <th className="text-center p-3 font-medium uppercase tracking-wide">Qty</th>
              <th className="text-right p-3 font-medium uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.line_items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{order.currency_symbol}{item.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted">
            <tr className="border-t border-border">
              <td colSpan={2} className="p-3 text-right font-medium uppercase tracking-wide">
                Total
              </td>
              <td className="p-3 text-right font-semibold">
                {order.currency_symbol}{order.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
