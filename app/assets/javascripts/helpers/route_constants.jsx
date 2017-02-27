(() => {
  class RouteConstants {

    get joints() {
      return {
        home: '/',
        show: (id) => `/joints/${id}`,
      };
    }
  }

  this.RouteConstants = new RouteConstants();
})();
