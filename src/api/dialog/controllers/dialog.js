"use strict";

/**
 * dialog controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dialog.dialog", ({ strapi }) => ({
  async update(ctx) {
    const dialogID = ctx.params.id;
    // @ts-ignore
    const { data: newMessage } = ctx.request.body;

    if (!newMessage) {
      return (ctx.response.status = 422);
    }

    try {
      const updatedDialog = await strapi
        .service("api::dialog.dialog")
        .update(dialogID, newMessage);

      return (ctx.body = updatedDialog), (ctx.status = 200);
    } catch (e) {
      return (
        (ctx.body = { message: e.response.message || "Something went wrong!" }),
        (ctx.status = 404)
      );
    }
  },
}));
