const chance = require("chance").Chance();
const velocityUtil = require("amplify-appsync-simulator/lib/velocity/util");
const { sign_user_up, sign_user_in } = require("./shared");

const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.last({ nationality: "en" });

  const suffix = chance.string({
    length: 4,
    pool: "abcdefghijklmnopqrstuvwxyz",
  });
  const name = `${firstName} ${lastName} ${suffix}`;

  const password = chance.string({ length: 8 });
  const email = `${firstName}-${lastName}@appsyncmc.com`;

  return {
    name,
    password,
    email,
  };
};

const an_appsync_context = (identity, args) => {
  const util = velocityUtil.create([], new Date(), Object());
  const context = {
    identity,
    args,
    arguments: args,
  };

  return {
    context,
    ctx: context,
    util,
    utils: util,
  };
};

const an_authenticated_user = async () => {
  const { name, email, password } = a_random_user();

  const profile = await sign_user_up(name, email, password);
  const credentials = await sign_user_in(profile.username, password);

  return {
    ...profile,
    ...credentials,
  };
};

module.exports = {
  a_random_user,
  an_appsync_context,
  an_authenticated_user,
};
