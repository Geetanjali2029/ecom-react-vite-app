import { API_BASE_URL } from '../Constants';

export const callAPI = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };