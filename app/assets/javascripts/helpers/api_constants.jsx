(() => {
  class ApiConstants {

    get joints() {
      return {
        home:             '/api/joints',
        filter: (type) => `/api/joints/filter/${type}`,
        show:   (id)   => `/api/joints/${id}`,
      };
    }

    get recents() {
      return {
        show:        '/api/recents',
        add: (id) => `/api/recents/add/${id}`,
      }
    }
  }

  this.ApiConstants = new ApiConstants();
})();
