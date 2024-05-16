"use strict";

/**
 * project controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::project.project", ({ strapi }) => ({
  async description(ctx) {
    const projectID = ctx.params.id;

    try {
      const description = await strapi
        .service("api::project.project")
        .findProjectsDesription(projectID);

      return (ctx.body = description);
    } catch (e) {
      return (
        (ctx.body = { message: "This project was not found" }),
        (ctx.status = 404)
      );
    }
  },
}));
