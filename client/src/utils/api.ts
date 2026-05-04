import axios from "axios";

const API = axios.create({
  baseURL: "https://ticketsystem-4ygo.vercel.app/",
});

export default API;