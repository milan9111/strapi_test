'use strict';

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/projects/:id/description",
      handler: "project.description",
    },
  ],
};
