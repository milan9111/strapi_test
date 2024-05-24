const axios = require("axios");

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
      const dialogs = await strapi.entityService.findMany(
        "api::dialog.dialog",
        {
          populate: {
            content: {
              fields: ["id", "author", "message", "date"],
              sort: 'id',
            },
          },
          filters: {
            user: {
              api_key: ctx.params.id,
            },
          },
          sort: { id: 'desc' },
        }
      );

      ctx.response.body = {
        success: true,
        dialogs: dialogs,
        user_id: entry.id,
        message: "Access to the virtual assistant is allowed!",
      };
      ctx.response.status = 200;
    } else {
      ctx.response.body = {
        success: false,
        dialogs: [],
        user_id: 0,
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

  plugin.controllers.user.sendAssistantMessage = async (ctx) => {
    const { message = "" } = ctx.request.body;

    if (!message.length) {
      return (ctx.response.status = 422);
    }

    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GPT_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      ctx.response.body = {
        success: true,
        message: result.data.choices[0].message.content,
      };
      ctx.response.status = 200;
    } catch (error) {
      console.error("Error fetching data:", error);
      ctx.response.body = {
        success: false,
        message: "Error: Something went wrong! Try again, please!",
      };
      ctx.response.status = 401;
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/user/assistant/message",
    handler: "user.sendAssistantMessage",
    config: {
      auth: false,
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
