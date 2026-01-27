'use client';

import { useState, useEffect } from 'react';
import { MapPin, Edit2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { cn } from '@/lib/utils';
import type { Address } from '@/lib/redux/slices/checkoutSlice';

export function CheckoutAddressStep() {
  const {
    billingAddress,
    shippingAddress,
    sameAsShipping,
    user,
    error,
    updateBillingAddress,
    updateShippingAddress,
    toggleSameAsShipping,
    completeAddresses,
    goBack,
    clearError,
  } = useCheckout();

  const [editingBilling, setEditingBilling] = useState(!billingAddress?.address_1);
  const [editingShipping, setEditingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize addresses from user data if not set
  useEffect(() => {
    if (!billingAddress && user?.billing?.address_1) {
      updateBillingAddress({
        first_name: user.billing.first_name || '',
        last_name: user.billing.last_name || '',
        company: user.billing.company,
        address_1: user.billing.address_1 || '',
        address_2: user.billing.address_2,
        city: user.billing.city || '',
        postcode: user.billing.postcode || '',
        country: user.billing.country || 'GB',
        state: user.billing.state,
        email: user.billing.email,
        phone: user.billing.phone,
      });
      setEditingBilling(false);
    }

    if (!shippingAddress && user?.shipping?.address_1) {
      updateShippingAddress({
        first_name: user.shipping.first_name || '',
        last_name: user.shipping.last_name || '',
        company: user.shipping.company,
        address_1: user.shipping.address_1 || '',
        address_2: user.shipping.address_2,
        city: user.shipping.city || '',
        postcode: user.shipping.postcode || '',
        country: user.shipping.country || 'GB',
        state: user.shipping.state,
      });
    }
  }, [user, billingAddress, shippingAddress, updateBillingAddress, updateShippingAddress]);

  const handleContinue = () => {
    setIsSubmitting(true);
    const success = completeAddresses();
    if (!success) {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-2">
          Delivery Details
        </h2>
        <p className="text-muted-foreground">
          Enter your billing and shipping addresses.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Billing Address */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold uppercase tracking-wide text-sm">
              Billing Address
            </h3>
            {billingAddress?.address_1 && !editingBilling && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingBilling(true)}
                className="text-emperador"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {editingBilling ? (
            <AddressForm
              address={billingAddress}
              type="billing"
              onSave={(address) => {
                updateBillingAddress(address);
                setEditingBilling(false);
                clearError();
              }}
              onCancel={
                billingAddress?.address_1
                  ? () => setEditingBilling(false)
                  : undefined
              }
            />
          ) : billingAddress?.address_1 ? (
            <AddressDisplay address={billingAddress} />
          ) : (
            <div className="border border-dashed border-border rounded-lg p-6 text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                No billing address set
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingBilling(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </Button>
            </div>
          )}
        </div>

        {/* Same as Shipping Checkbox */}
        <div className="flex items-center space-x-2 py-2 border-y border-border">
          <Checkbox
            id="sameAsShipping"
            checked={sameAsShipping}
            onCheckedChange={(checked) => toggleSameAsShipping(checked as boolean)}
          />
          <label
            htmlFor="sameAsShipping"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Shipping address same as billing
          </label>
        </div>

        {/* Shipping Address - Only show if different from billing */}
        {!sameAsShipping && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold uppercase tracking-wide text-sm">
                Shipping Address
              </h3>
              {shippingAddress?.address_1 && !editingShipping && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingShipping(true)}
                  className="text-emperador"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {editingShipping ? (
              <AddressForm
                address={shippingAddress}
                type="shipping"
                onSave={(address) => {
                  updateShippingAddress(address);
                  setEditingShipping(false);
                  clearError();
                }}
                onCancel={
                  shippingAddress?.address_1
                    ? () => setEditingShipping(false)
                    : undefined
                }
              />
            ) : shippingAddress?.address_1 ? (
              <AddressDisplay address={shippingAddress} />
            ) : (
              <div className="border border-dashed border-border rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  No shipping address set
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingShipping(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Address
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="uppercase tracking-wide"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Address Display Component
function AddressDisplay({ address }: { address: Address }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-muted/20">
      <p className="font-medium">
        {address.first_name} {address.last_name}
      </p>
      {address.company && (
        <p className="text-sm text-muted-foreground">{address.company}</p>
      )}
      <p className="text-sm text-muted-foreground">{address.address_1}</p>
      {address.address_2 && (
        <p className="text-sm text-muted-foreground">{address.address_2}</p>
      )}
      <p className="text-sm text-muted-foreground">
        {address.city}, {address.postcode}
      </p>
      <p className="text-sm text-muted-foreground">
        {address.state && `${address.state}, `}
        {address.country}
      </p>
      {address.phone && (
        <p className="text-sm text-muted-foreground mt-2">
          Phone: {address.phone}
        </p>
      )}
      {address.email && (
        <p className="text-sm text-muted-foreground">Email: {address.email}</p>
      )}
    </div>
  );
}

// Address Form Component
interface AddressFormProps {
  address: Address | null;
  type: 'billing' | 'shipping';
  onSave: (address: Address) => void;
  onCancel?: () => void;
}

function AddressForm({ address, type, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
    first_name: address?.first_name || '',
    last_name: address?.last_name || '',
    company: address?.company || '',
    address_1: address?.address_1 || '',
    address_2: address?.address_2 || '',
    city: address?.city || '',
    postcode: address?.postcode || '',
    country: address?.country || 'GB',
    state: address?.state || '',
    phone: address?.phone || '',
    email: address?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${type}_first_name`}>First Name *</Label>
          <Input
            id={`${type}_first_name`}
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}_last_name`}>Last Name *</Label>
          <Input
            id={`${type}_last_name`}
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}_company`}>Company (optional)</Label>
        <Input
          id={`${type}_company`}
          name="company"
          value={formData.company || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}_address_1`}>Address Line 1 *</Label>
        <Input
          id={`${type}_address_1`}
          name="address_1"
          value={formData.address_1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}_address_2`}>Address Line 2 (optional)</Label>
        <Input
          id={`${type}_address_2`}
          name="address_2"
          value={formData.address_2 || ''}
          onChange={handleChange}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${type}_city`}>City *</Label>
          <Input
            id={`${type}_city`}
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}_postcode`}>Postcode *</Label>
          <Input
            id={`${type}_postcode`}
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${type}_state`}>County/State</Label>
          <Input
            id={`${type}_state`}
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${type}_country`}>Country *</Label>
          <Input
            id={`${type}_country`}
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {type === 'billing' && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${type}_phone`}>Phone</Label>
            <Input
              id={`${type}_phone`}
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}_email`}>Email</Label>
            <Input
              id={`${type}_email`}
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="flex gap-4 pt-2">
        <Button type="submit" className="uppercase tracking-wide">
          Save Address
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="uppercase tracking-wide"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
