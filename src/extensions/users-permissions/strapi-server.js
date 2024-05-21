module.exports = (plugin) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }
    await strapi.entityService
      .update("plugin::users-permissions.user", ctx.state.user.id, {
        data: ctx.request.body,
      })
      .then((res) => {
        ctx.response.status = 200;
        ctx.response.body = res;
      });
  };

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  plugin.controllers.user.findApiKey = async (ctx) => {
    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { api_key: ctx.params.id },
      });
    if (entry) {
      ctx.response.body = {
        success: true,
        message: "Access to the virtual assistant is allowed!",
      };
      ctx.response.status = 200;
    } else {
      ctx.response.body = {
        success: false,
        message:
          "Access to the virtual assistant is not allowed! The API key is incorrect!",
      };
      ctx.response.status = 403;
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "GET",
    path: "/user/api-key/:id",
    handler: "user.findApiKey",
    config: {
      auth: false,
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
