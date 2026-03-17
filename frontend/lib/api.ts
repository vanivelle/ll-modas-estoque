const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  minimum_quantity: number;
  tenant_id?: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

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
export async function getProducts(): Promise<ApiResponse<Product[]>> {
  const result = await apiCall<Product[]>('/api/products', 'GET');
  
  // Se API falhar ou retornar vazio, usar dados locais
  if (!result.success || !result.data || result.data.length === 0) {
    console.log('API vazia ou indisponível, carregando dados locais...');
    return {
      success: true,
      data: getLocalProducts()
    };
  }
  return result;
}

// Dados locais de backup
function getLocalProducts(): Product[] {
  return [
    { id: 'local-1', name: 'Relógio Analógico', sku: 'REL001', barcode: '7998765432101', price: 89.90, minimum_quantity: 3, quantity: 12 },
    { id: 'local-2', name: 'Óculos de Sol UV', sku: 'OCU001', barcode: '7998765432102', price: 149.90, minimum_quantity: 5, quantity: 18 },
    { id: 'local-3', name: 'Relógio Digital Led', sku: 'REL002', barcode: '7998765432103', price: 59.90, minimum_quantity: 4, quantity: 25 },
    { id: 'local-4', name: 'Óculos Estilo Wayfarer', sku: 'OCU002', barcode: '7998765432104', price: 129.90, minimum_quantity: 3, quantity: 14 },
    { id: 'local-5', name: 'Pulseira Relógio LED', sku: 'PUL001', barcode: '7998765432105', price: 45.90, minimum_quantity: 8, quantity: 32 },
    { id: 'local-6', name: 'Corrente de Aço Inox', sku: 'COR001', barcode: '7998765432106', price: 79.90, minimum_quantity: 5, quantity: 20 },
    { id: 'local-7', name: 'Anel Aço Inox', sku: 'ANE001', barcode: '7998765432107', price: 34.90, minimum_quantity: 10, quantity: 45 },
  ];
}

// Seed para criar produtos de teste
export async function seedProducts(): Promise<ApiResponse<Product[]>> {
  const products = [
    { name: 'Camisa', sku: 'CAM001', barcode: '7998765432101', price: 49.90, minimum_quantity: 5 },
    { name: 'Calça', sku: 'CAL001', barcode: '7998765432102', price: 79.90, minimum_quantity: 3 },
    { name: 'Bermuda', sku: 'BER001', barcode: '7998765432103', price: 59.90, minimum_quantity: 4 },
    { name: 'Jaqueta', sku: 'JAC001', barcode: '7998765432104', price: 129.90, minimum_quantity: 2 },
    { name: 'Sotaque', sku: 'SOT001', barcode: '7998765432105', price: 34.90, minimum_quantity: 10 },
  ];

  const results = await Promise.all(
    products.map(p => createProduct(p))
  );
  
  return {
    success: true,
    data: results.map(r => r.data).filter(Boolean) as Product[],
  };
}

export async function getProduct(productId: string): Promise<ApiResponse<Product>> {
  return apiCall<Product>(`/api/products/${productId}`, 'GET');
}

export async function createProduct(
  data: {
    name: string;
    sku?: string;
    barcode?: string;
    price: number;
    minimum_quantity?: number;
  }
): Promise<ApiResponse<Product>> {
  return apiCall<Product>('/api/products', 'POST', data);
}

export async function updateProduct(
  productId: string,
  data: any
): Promise<ApiResponse<Product>> {
  return apiCall<Product>(`/api/products/${productId}`, 'PUT', data);
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
