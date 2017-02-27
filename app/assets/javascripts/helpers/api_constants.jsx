(() => {
  class ApiConstants {

    get joints() {
      return {
        home: '/api/joints',
        show: (id) => `/api/joints/${id}`,
      };
    }
  }

  this.ApiConstants = new ApiConstants();
})();
