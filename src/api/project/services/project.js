"use strict";

/**
 * project service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::project.project", ({ strapi }) => ({
  async findProjectsDesription(id) {
    const { description } = await strapi.entityService.findOne(
      "api::project.project",
      id
    );

    return description;
  },
}));
