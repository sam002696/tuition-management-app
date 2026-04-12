class UrlBuilderHelper {
  tuitionManagementApi() {
    // return `http://localhost:8000/api`; // local connection
    return `http://192.168.68.103:8000/api`; // sami home connection ip
    // return `http://localhost:8080/api`; // docker connection
    // return `http://43.204.236.19:8080/api`; // live connection
  }
  tuitionManagementBroadcastingApi() {
    return `http://localhost:8000/broadcasting/auth`; // local broadcasting auth
    // return `http://192.168.1.243:8000/broadcasting/auth`; // local broadcasting auth ip
  }
}
export const UrlBuilder = new UrlBuilderHelper();
