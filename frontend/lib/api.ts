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
  return [];
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

// Criar produto + adicionar estoque de uma vez (para entrada rápida)
export async function createProductWithStock(
  data: {
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    barcode?: string;
    minimum_quantity?: number;
    notes?: string;
  }
): Promise<ApiResponse<Product>> {
  try {
    // 1. Criar produto
    const productResult = await createProduct({
      name: data.name,
      price: data.price,
      sku: data.sku || `SKU-${Date.now()}`,
      barcode: data.barcode || '',
      minimum_quantity: data.minimum_quantity || 1,
    });

    if (!productResult.success || !productResult.data) {
      return {
        success: false,
        error: 'Erro ao criar produto: ' + productResult.error,
      };
    }

    // 2. Adicionar estoque
    const stockResult = await addStock(
      productResult.data.id,
      data.quantity,
      data.notes || ''
    );

    if (!stockResult.success) {
      return {
        success: false,
        error: 'Produto criado mas erro ao adicionar estoque: ' + stockResult.error,
      };
    }

    return productResult;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
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
