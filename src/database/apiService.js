import axios from 'axios';

const API_URL = 'http://localhost:91/lucas/'; 
const TIMEOUT = 15000;

export const fetchShiftData = async () => {
  try {
    const response = await axios.get(`${API_URL}shift-info`, {
      timeout: TIMEOUT,
      headers: {'Accept': 'application/json'}
    });
    const responseData = response.data;
    return {
      shift: responseData.shift || '1',
      time: responseData.time || new Date().toLocaleTimeString(),
      date: responseData.date || new Date().toLocaleDateString(),
      status: responseData.status || 'ok',
      startTime: responseData.startHour,
      endTime: responseData.endHour
    };
  } catch (error) {
    console.error('Error fetching shift data:', {
      message: error.message,
      url: API_URL,
      response: error.response?.data
    });
    return {
      shift: '1',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      status: 'error',
      errorMessage: error.message
    };
  }
};

export const fetchProductionData = async (mainLine, subLine) => {
  try {
    const response = await axios.get(`${API_URL}production-data`, {
      timeout: TIMEOUT,
      params: {
        line: mainLine,
        subline: subLine
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log(console.data);
    return response.data;
  } catch (error){
    console.error('Error fetching production data: ', {
      message : error.message,
      url: `${API_URL}production-data`,
      response: error.response?.data
    });
    throw error;
  }
};

export const updateLineSelection = async (mainLine, subLine) => {
  try {
    const response = await axios.post(`${API_URL}update-line`, {
      timeout: TIMEOUT,
      params: {
        line: mainLine,
        subline: subLine
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    console.log(console.data);
    return response.data;
  } catch (error){
    console.error('Error fetching production data: ', {
      message : error.message,
      url: `${API_URL}update-line`,
      response: error.response?.data
    });
    throw error;
  }
};