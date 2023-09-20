import axios from "axios";

import { userAPI } from "../Constants/Api";

const userInstance =axios.create({
    baseURL:userAPI,
    withCredentials:true
})
export default userInstance

