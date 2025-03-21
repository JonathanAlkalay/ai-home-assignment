import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to inject token
    this.api.interceptors.request.use(
      (config) => {
        // Try to get token from localStorage first, then cookies
        const token = localStorage.getItem('token') || Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request Config:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response Error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request Error:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      console.log('Making login request with data:', {
        email,
        password: '[REDACTED]'
      });
      const response = await this.api.post('/auth/login', {
        email,
        password
      });
      
      // Store the token in both localStorage and cookies for redundancy
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        Cookies.set('token', response.data.access_token);
      }
      
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
      } else {
        console.error('Non-Axios error during login:', error);
      }
      throw error;
    }
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string }) {
    try {
      console.log('Making registration request with data:', {
        ...data,
        password: '[REDACTED]'
      });
      const response = await this.api.post('/auth/signup', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
      } else {
        console.error('Non-Axios error during registration:', error);
      }
      throw error;
    }
  }

  // Posts endpoints
  async generatePost(data: { topic: string; style: string }) {
    try {
      const response = await this.api.post('/generate', data);
      
      if (!response.data) {
        throw new Error('No content was generated');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          'Failed to generate content. Please try again.'
        );
      }
      throw error;
    }
  }

  async savePost(data: { title: string; content: string; isDraft?: boolean }) {
    try {
      console.log('Making save post request:', {
        title: data.title,
        contentLength: data.content.length,
        isDraft: data.isDraft,
        headers: this.api.defaults.headers
      });

      const response = await this.api.post('/posts/create', {
        title: data.title,
        content: data.content,
        isDraft: data.isDraft || false
      });

      console.log('Save post response:', {
        status: response.status,
        data: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Save post error:', {
        error,
        isAxiosError: axios.isAxiosError(error),
        response: axios.isAxiosError(error) ? {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        } : undefined,
        request: axios.isAxiosError(error) ? {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        } : undefined
      });

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 
          `Failed to save post: ${error.message}`
        );
      }
      throw error;
    }
  }

  async getUserPosts() {
    const response = await this.api.get('/posts/user');
    return response.data;
  }

  async getPost(id: string | number) {
    try {
      console.log('Making get post request for id:', id);
      const response = await this.api.get(`/posts/${id}`);
      console.log('Get post response:', response.data);
      
      // Validate the response data
      if (!response.data || !response.data.id) {
        throw new Error('Invalid post data received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get post failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        response: axios.isAxiosError(error) ? {
          data: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        } : undefined
      });
      throw error;
    }
  }

  async deletePost(id: string | number) {
    const response = await this.api.delete(`/posts/${id}`);
    return response.data;
  }

  async updateDraftStatus(id: string | number, isDraft: boolean) {
    try {
      console.log('Updating draft status:', { id, isDraft });
      const response = await this.api.patch(`/posts/${id}/draft`, { isDraft });
      console.log('Update draft status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update draft status failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        response: axios.isAxiosError(error) ? {
          data: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        } : undefined
      });
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to update draft status'
          : 'Failed to update draft status'
      );
    }
  }

  async updatePost(id: string | number, data: { title: string; content: string }) {
    try {
      console.log('Updating post:', { id, ...data });
      const response = await this.api.patch(`/posts/${id}`, data);
      console.log('Update post response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update post failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 