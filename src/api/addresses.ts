import apiClient from './client';

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await apiClient.get('/auth/addresses/');
  return response.data;
}

export async function addAddress(address: Omit<Address, 'id' | 'isDefault'>): Promise<Address> {
  const response = await apiClient.post('/auth/addresses/', address);
  return response.data;
}

export async function updateAddress(id: string, address: Partial<Address>): Promise<Address> {
  const response = await apiClient.put(`/auth/addresses/${id}/`, address);
  return response.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await apiClient.delete(`/auth/addresses/${id}/`);
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const response = await apiClient.post(`/auth/addresses/${id}/set_default/`);
  return response.data;
}
