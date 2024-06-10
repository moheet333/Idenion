import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000/api/v1/";

axios.interceptors.request.use(function (req) {
  req.withCredentials = true;
  return req;
});
