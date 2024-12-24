import axios  from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function generateFutureTimestamp({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 }) {
  const now = new Date();
  now.setFullYear(now.getFullYear() + years);
  now.setMonth(now.getMonth() + months);
  now.setDate(now.getDate() + days);
  now.setHours(now.getHours() + hours);
  now.setMinutes(now.getMinutes() + minutes);
  now.setSeconds(now.getSeconds() + seconds);
  return Math.floor(now.getTime());
}

export default instance;
