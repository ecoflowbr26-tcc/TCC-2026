/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Product, Report, Comment } from '../types';

// Read backend URL from Vite environment variables (fallback to empty string)
const API_BASE_URL = 'http://localhost:8080';

/**
 * Checks if the external Node.js backend configuration is provided and looks accessible.
 */
export const isBackendConfigured = (): boolean => {
  return typeof API_BASE_URL === 'string' && API_BASE_URL.trim().length > 0;
};

/**
 * Helper to perform fetch calls to the Node.js API with timeout and error handling.
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Erro na requisicao API (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * API Service for EcoFlow NodeJS + SQL Server
 */
export const EcoApi = {
  // 1. Health check or server status
  async checkHealth(): Promise<{ status: string; database: string }> {
    return request<{ status: string; database: string }>('/api/health');
  },

  // 2. Auth Endpoints
  async login(email: string, pass: string) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: pass
      }),
    });
  },

  async register(userData: Omit<User, 'followersCount' | 'followingCount' | 'postsCount'> & { pass: string }): Promise<{ token?: string; user: User }> {
    return request<{ token?: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 3. Users Endpoints
  async getUsers(): Promise<User[]> {
    return request<User[]>('/api/users');
  },

  async updateUser(userId: string, fields: Partial<User>): Promise<User> {
    return request<User>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(fields),
    });
  },

  async toggleUserActivation(userId: string): Promise<{ success: boolean; isInactive: boolean }> {
    return request<{ success: boolean; isInactive: boolean }>(`/api/users/${userId}/toggle-activation`, {
      method: 'POST',
    });
  },

  // 4. Products Endpoints
  async getProducts(): Promise<Product[]> {
    return request<Product[]>('/api/products');
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'likesCount' | 'comments' | 'interestsCount'>): Promise<Product> {
    return request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(productId: string, updatedFields: Partial<Product>): Promise<Product> {
    return request<Product>(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    });
  },

  async deleteProduct(productId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/products/${productId}`, {
      method: 'DELETE',
    });
  },

  async clearAllProducts(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/products/clear-all', {
      method: 'POST',
    });
  },

  // 5. Social Interactions (Likes, Saved, Interests)
  async toggleLikeProduct(productId: string, userId: string): Promise<{ likesCount: number; isLiked: boolean }> {
    return request<{ likesCount: number; isLiked: boolean }>(`/api/products/${productId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async toggleSaveProduct(productId: string, userId: string): Promise<{ isSaved: boolean }> {
    return request<{ isSaved: boolean }>(`/api/products/${productId}/save`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async expressInterestInProduct(productId: string, userId: string): Promise<{ interestsCount: number; isInterested: boolean }> {
    return request<{ interestsCount: number; isInterested: boolean }>(`/api/products/${productId}/interest`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // 6. Comments System
  async addComment(productId: string, commentData: { authorId: string; authorName: string; authorAvatar: string; text: string; rating: number }): Promise<Comment> {
    return request<Comment>(`/api/products/${productId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // 7. Mod Moderation Reports
  async getReports(): Promise<Report[]> {
    return request<Report[]>('/api/reports');
  },

  async createReport(reportData: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    return request<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  async deleteReport(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/reports/${id}`, {
      method: 'DELETE',
    });
  },

  // 8. General System Reset
  async resetAllSystemData(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/system/reset', {
      method: 'POST',
    });
  }
};


