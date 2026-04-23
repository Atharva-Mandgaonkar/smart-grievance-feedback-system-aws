import axios from "axios";

const API_BASE_URL = "https://023zdujud7.execute-api.us-east-1.amazonaws.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;