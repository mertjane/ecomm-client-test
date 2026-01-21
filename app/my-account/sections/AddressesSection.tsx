'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { MapPin, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { accountApi } from '@/lib/api/account';

type AddressType = 'billing' | 'shipping';

export function AddressesSection() {
  const { user, refreshUser } = useAuth();
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);

  const billingAddress = user?.billing;
  const shippingAddress = user?.shipping;

  if (editingAddress) {
    return (
      <AddressForm
        type={editingAddress}
        address={editingAddress === 'billing' ? billingAddress : shippingAddress}
        onCancel={() => setEditingAddress(null)}
        onSave={async () => {
          await refreshUser?.();
          setEditingAddress(null);
        }}
      />
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">Addresses</h2>

      <p className="text-muted-foreground mb-8">
        The following addresses will be used on the checkout page by default.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold uppercase tracking-wide text-sm">Billing Address</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingAddress('billing')}
              className="text-emperador"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {billingAddress?.address_1 ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground font-medium">
                {billingAddress.first_name} {billingAddress.last_name}
              </p>
              {billingAddress.company && <p>{billingAddress.company}</p>}
              <p>{billingAddress.address_1}</p>
              {billingAddress.address_2 && <p>{billingAddress.address_2}</p>}
              <p>{billingAddress.city}, {billingAddress.postcode}</p>
              <p>{billingAddress.state} {billingAddress.country}</p>
              {billingAddress.phone && <p>Phone: {billingAddress.phone}</p>}
              {billingAddress.email && <p>Email: {billingAddress.email}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">No billing address set</span>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold uppercase tracking-wide text-sm">Shipping Address</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingAddress('shipping')}
              className="text-emperador"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          {shippingAddress?.address_1 ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground font-medium">
                {shippingAddress.first_name} {shippingAddress.last_name}
              </p>
              {shippingAddress.company && <p>{shippingAddress.company}</p>}
              <p>{shippingAddress.address_1}</p>
              {shippingAddress.address_2 && <p>{shippingAddress.address_2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.postcode}</p>
              <p>{shippingAddress.state} {shippingAddress.country}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">No shipping address set</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AddressFormProps {
  type: AddressType;
  address: any;
  onCancel: () => void;
  onSave: () => void;
}

function AddressForm({ type, address, onCancel, onSave }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: address?.first_name || '',
    last_name: address?.last_name || '',
    company: address?.company || '',
    address_1: address?.address_1 || '',
    address_2: address?.address_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postcode: address?.postcode || '',
    country: address?.country || 'GB',
    phone: address?.phone || '',
    email: address?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await accountApi.updateAddress(type, formData);
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold uppercase tracking-wide mb-6">
        Edit {type === 'billing' ? 'Billing' : 'Shipping'} Address
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_1">Address Line 1 *</Label>
          <Input
            id="address_1"
            name="address_1"
            value={formData.address_1}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_2">Address Line 2 (optional)</Label>
          <Input
            id="address_2"
            name="address_2"
            value={formData.address_2}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">County/State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {type === 'billing' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="uppercase tracking-wide">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Address'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="uppercase tracking-wide"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
