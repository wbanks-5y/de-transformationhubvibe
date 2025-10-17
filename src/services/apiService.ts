
/**
 * API Service - Provides functions for making API calls to the backend
 * This will be used when a backend is implemented
 */

// Base URL for API calls - using environment variable safely
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Default request headers
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Type for API options
interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

/**
 * API service object with methods for different HTTP methods
 */
export const apiService = {
  /**
   * Make a GET request
   */
  get: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { headers = {}, params = {} } = options;
    
    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Make the request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { ...defaultHeaders, ...headers },
    });
    
    // Handle response
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Make a POST request
   */
  post: async <T>(endpoint: string, data: any, options: ApiOptions = {}): Promise<T> => {
    const { headers = {} } = options;
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(data),
    });
    
    // Handle response
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Make a PUT request
   */
  put: async <T>(endpoint: string, data: any, options: ApiOptions = {}): Promise<T> => {
    const { headers = {} } = options;
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(data),
    });
    
    // Handle response
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Make a PATCH request
   */
  patch: async <T>(endpoint: string, data: any, options: ApiOptions = {}): Promise<T> => {
    const { headers = {} } = options;
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { ...defaultHeaders, ...headers },
      body: JSON.stringify(data),
    });
    
    // Handle response
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Make a DELETE request
   */
  delete: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { headers = {} } = options;
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...defaultHeaders, ...headers },
    });
    
    // Handle response
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
};
