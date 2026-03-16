const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper para fazer requests SEM tenantId
async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: `Erro ${response.status}: ${error}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// PRODUTOS
export async function getProducts() {
  return apiCall('/api/products', 'GET');
}

export async function getProduct(productId: string) {
  return apiCall(`/api/products/${productId}`, 'GET');
}

export async function createProduct(
  data: {
    name: string;
    sku?: string;
    barcode?: string;
    price: number;
    minimum_quantity?: number;
  }
) {
  return apiCall('/api/products', 'POST', data);
}

export async function updateProduct(
  productId: string,
  data: any
) {
  return apiCall(`/api/products/${productId}`, 'PUT', data);
}

export async function deleteProduct(productId: string) {
  return apiCall(`/api/products/${productId}`, 'DELETE');
}

// ESTOQUE
export async function addStock(
  productId: string,
  quantity: number,
  notes?: string
) {
  return apiCall(
    '/api/inventory/add',
    'POST',
    { productId, quantity, notes }
  );
}

export async function removeStock(
  productId: string,
  quantity: number,
  notes?: string
) {
  return apiCall(
    '/api/inventory/remove',
    'POST',
    { productId, quantity, notes }
  );
}

export async function getInventoryHistory(
  productId?: string,
  limit?: number
) {
  const params = new URLSearchParams();
  if (productId) params.append('productId', productId);
  if (limit) params.append('limit', limit.toString());

  return apiCall(
    `/api/inventory/history?${params.toString()}`,
    'GET'
  );
}

export async function getLowStockProducts() {
  return apiCall('/api/inventory/low-stock', 'GET');
}
