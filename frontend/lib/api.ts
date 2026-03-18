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

// Dados locais de backup (vazio no estoque/dashboard)
function getLocalProducts(): Product[] {
  return [];
}

// Lista de produtos para dropdown na entrada (so para selecionar)
export function getDropdownProducts(): Product[] {
  return [
    // VESTUÁRIO
    { id: 'local-1', name: 'Camisa Social', sku: 'CAM001', barcode: '7998765432101', price: 89.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-2', name: 'Camisa Casual', sku: 'CAM002', barcode: '7998765432102', price: 69.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-3', name: 'Blusa de Frio', sku: 'BLU001', barcode: '7998765432103', price: 79.90, minimum_quantity: 4, quantity: 0 },
    { id: 'local-4', name: 'Bermuda', sku: 'BER001', barcode: '7998765432104', price: 59.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-5', name: 'Calça Jeans', sku: 'CAL001', barcode: '7998765432105', price: 99.90, minimum_quantity: 3, quantity: 0 },
    { id: 'local-6', name: 'Vestido Festa', sku: 'VES001', barcode: '7998765432106', price: 149.90, minimum_quantity: 2, quantity: 0 },
    { id: 'local-7', name: 'Jaqueta', sku: 'JAC001', barcode: '7998765432107', price: 129.90, minimum_quantity: 2, quantity: 0 },
    
    // ACESSÓRIOS
    { id: 'local-8', name: 'Relógio Analógico', sku: 'REL001', barcode: '7998765432108', price: 89.90, minimum_quantity: 3, quantity: 0 },
    { id: 'local-9', name: 'Óculos de Sol UV', sku: 'OCU001', barcode: '7998765432109', price: 149.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-10', name: 'Relógio Digital Led', sku: 'REL002', barcode: '7998765432110', price: 59.90, minimum_quantity: 4, quantity: 0 },
    { id: 'local-11', name: 'Óculos Estilo Wayfarer', sku: 'OCU002', barcode: '7998765432111', price: 129.90, minimum_quantity: 3, quantity: 0 },
    { id: 'local-12', name: 'Pulseira Relógio LED', sku: 'PUL001', barcode: '7998765432112', price: 45.90, minimum_quantity: 8, quantity: 0 },
    { id: 'local-13', name: 'Corrente de Aço Inox', sku: 'COR001', barcode: '7998765432113', price: 79.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-14', name: 'Anel Aço Inox', sku: 'ANE001', barcode: '7998765432114', price: 34.90, minimum_quantity: 10, quantity: 0 },
    { id: 'local-15', name: 'Bolsa Feminina', sku: 'BOL001', barcode: '7998765432115', price: 119.90, minimum_quantity: 2, quantity: 0 },
    { id: 'local-16', name: 'Sapato Feminino', sku: 'SAP001', barcode: '7998765432116', price: 139.90, minimum_quantity: 3, quantity: 0 },
    { id: 'local-17', name: 'Chinelo Masculino', sku: 'CHI001', barcode: '7998765432117', price: 39.90, minimum_quantity: 8, quantity: 0 },
    { id: 'local-18', name: 'Meia Social', sku: 'MEI001', barcode: '7998765432118', price: 12.90, minimum_quantity: 20, quantity: 0 },
    { id: 'local-19', name: 'Cinto Couro', sku: 'CIN001', barcode: '7998765432119', price: 69.90, minimum_quantity: 5, quantity: 0 },
    { id: 'local-20', name: 'Chapéu', sku: 'CHA001', barcode: '7998765432120', price: 49.90, minimum_quantity: 4, quantity: 0 },
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
