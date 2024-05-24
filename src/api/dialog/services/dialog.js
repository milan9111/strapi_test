"use strict";

/**
 * dialog service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::dialog.dialog", ({ strapi }) => ({
  async update(id, newMessage) {
    const dialog = await strapi.entityService.findOne(
      "api::dialog.dialog",
      id,
      {
        populate: ["content"],
      }
    );

    if (!dialog) {
      throw new Error("Dialog not found");
    }

    dialog.content.unshift(newMessage);

    const updatedDialog = await strapi.entityService.update(
      "api::dialog.dialog",
      id,
      {
        data: {
          content: dialog.content,
        },
        populate: {
          content: {
            fields: ["id", "author", "message", "date"],
            sort: "id",
          },
        },
      }
    );

    return updatedDialog;
  },
}));
