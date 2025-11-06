/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosCommon, { AxiosOptions } from "../Axios";

class ClientService extends AxiosCommon {
  constructor(options: AxiosOptions) {
    super(options);

    // handle response
    this.axiosInstance.interceptors.response.use(
      async function (response: any) {
        return response.data;
      },
      async function (error: any) {
        return {
          code: error?.status || error.code || 500,
          message: error.message,
          data: error?.response?.data || error?.data || error,
        };
      }
    );
  }

  // protected override async setHeaders(): Promise<void> {
  //   const token = ""; // TODO: lấy token nếu cần
  //   if (token) {
  //     this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   }
  // }
  // handle response
}

export default ClientService;
