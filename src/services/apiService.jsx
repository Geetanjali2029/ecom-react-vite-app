import { BASE_URL } from '../Constants';

export const getData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };