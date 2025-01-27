// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_dict from "../../../node_modules/rescript/lib/es6/js_dict.js";
import * as Js_json from "../../../node_modules/rescript/lib/es6/js_json.js";
import * as $$Promise from "../../../node_modules/@ryyppy/rescript-promise/src/Promise.js";
import * as Belt_Int from "../../../node_modules/rescript/lib/es6/belt_Int.js";
import * as Belt_Array from "../../../node_modules/rescript/lib/es6/belt_Array.js";
import * as Caml_array from "../../../node_modules/rescript/lib/es6/caml_array.js";
import * as Belt_Option from "../../../node_modules/rescript/lib/es6/belt_Option.js";
import * as Caml_option from "../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Webapi__Fetch from "../../../node_modules/rescript-webapi/src/Webapi/Webapi__Fetch.js";
import * as Caml_exceptions from "../../../node_modules/rescript/lib/es6/caml_exceptions.js";
import * as Js_null_undefined from "../../../node_modules/rescript/lib/es6/js_null_undefined.js";

var DiscordRateLimited = /* @__PURE__ */Caml_exceptions.create("DiscordServer.DiscordRateLimited");

var botToken = process.env.DISCORD_API_TOKEN;

function mapGuildOauthRecord(decodedGuilds) {
  return Belt_Option.map(decodedGuilds, (function (guilds) {
                return guilds.map(function (guild) {
                            var guild$1 = Js_json.decodeObject(guild);
                            return {
                                    id: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild$1, "id"), Js_json.decodeString)),
                                    name: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild$1, "name"), Js_json.decodeString)),
                                    icon: Belt_Option.flatMap(Js_dict.get(guild$1, "icon"), Js_json.decodeString)
                                  };
                          });
              }));
}

function mapGuildRecord(decodedGuild) {
  if (decodedGuild === undefined) {
    return ;
  }
  var guild = Caml_option.valFromOption(decodedGuild);
  return {
          id: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild, "id"), Js_json.decodeString)),
          name: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild, "name"), Js_json.decodeString)),
          icon: Belt_Option.flatMap(Js_dict.get(guild, "icon"), Js_json.decodeString),
          roles: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild, "roles"), Js_json.decodeArray)),
          owner_id: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(guild, "owner_id"), Js_json.decodeString))
        };
}

function mapGuildMemberRecord(decodedGuildMember) {
  if (decodedGuildMember !== undefined) {
    return {
            roles: Belt_Option.getExn(Belt_Option.map(Belt_Option.flatMap(Js_dict.get(Caml_option.valFromOption(decodedGuildMember), "roles"), Js_json.decodeArray), (function (roles) {
                        return roles.map(function (role) {
                                    return Belt_Option.getExn(Js_json.decodeString(role));
                                  });
                      })))
          };
  }
  
}

function mapRoleRecord(decodedRoles) {
  return Belt_Option.map(decodedRoles, (function (roles) {
                return roles.map(function (role) {
                            var role$1 = Js_json.decodeObject(role);
                            return {
                                    id: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(role$1, "id"), Js_json.decodeString)),
                                    name: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(role$1, "name"), Js_json.decodeString)),
                                    permissions: Belt_Option.getExn(Belt_Option.flatMap(Js_dict.get(role$1, "permissions"), Js_json.decodeNumber))
                                  };
                          });
              }));
}

function sleep(ms) {
  return (new Promise((resolve) => setTimeout(resolve, ms)));
}

function fetchBotGuilds(afterOpt, allGuildsOpt, param) {
  var after = afterOpt !== undefined ? afterOpt : 0;
  var allGuilds = allGuildsOpt !== undefined ? allGuildsOpt : [];
  var headers = {
    Authorization: "Bot " + botToken + ""
  };
  var init = Webapi__Fetch.RequestInit.make(/* Get */0, Caml_option.some(headers), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined);
  return $$Promise.$$catch(fetch(new Request("https://discord.com/api/users/@me/guilds?after=" + String(after) + "", init)).then(function (res) {
                    return res.json();
                  }).then(function (json) {
                  if (Js_json.test(json, /* Array */3)) {
                    var guilds = mapGuildOauthRecord(Js_json.decodeArray(json));
                    if (guilds.length <= 1) {
                      return Promise.resolve(Belt_Array.concat(allGuilds, guilds));
                    }
                    var last = guilds.length - 1 | 0;
                    var after$1 = Belt_Int.fromString(Caml_array.get(guilds, last).id);
                    var allGuilds$1 = Belt_Array.concat(allGuilds, guilds);
                    return fetchBotGuilds(after$1, allGuilds$1, undefined);
                  }
                  var rateLimit = Js_json.decodeObject(json);
                  var retry_after = Belt_Option.flatMap(Js_dict.get(rateLimit, "retry_after"), Js_json.decodeNumber);
                  var retry_after$1;
                  if (retry_after !== undefined) {
                    retry_after$1 = (retry_after | 0) + 100 | 0;
                  } else {
                    throw {
                          RE_EXN_ID: DiscordRateLimited,
                          Error: new Error()
                        };
                  }
                  console.log("Discord Rate Limited: Retrying fetch for guilds after: " + String(after) + " in " + String(retry_after$1) + "ms");
                  return sleep(retry_after$1).then(function (param) {
                              return fetchBotGuilds(after, allGuilds, undefined);
                            });
                }), (function (e) {
                if (e.RE_EXN_ID === DiscordRateLimited) {
                  throw e;
                }
                return Promise.resolve(allGuilds);
              }));
}

function fetchUserGuilds(user) {
  var headers = {
    Authorization: "Bearer " + user.accessToken + ""
  };
  var init = Webapi__Fetch.RequestInit.make(/* Get */0, Caml_option.some(headers), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined);
  return $$Promise.$$catch(fetch(new Request("https://discord.com/api/users/@me/guilds", init)).then(function (res) {
                    return res.json();
                  }).then(function (json) {
                  if (Js_json.test(json, /* Array */3)) {
                    return Promise.resolve(mapGuildOauthRecord(Js_json.decodeArray(json)));
                  }
                  var rateLimit = Js_json.decodeObject(json);
                  var retry_after = Belt_Option.flatMap(Js_dict.get(rateLimit, "retry_after"), Js_json.decodeNumber);
                  var retry_after$1;
                  if (retry_after !== undefined) {
                    retry_after$1 = (retry_after | 0) + 100 | 0;
                  } else {
                    throw {
                          RE_EXN_ID: DiscordRateLimited,
                          Error: new Error()
                        };
                  }
                  console.log("Discord Rate Limited: Retrying fetch user guilds in " + String(retry_after$1) + "ms");
                  return sleep(retry_after$1).then(function (param) {
                              return fetchUserGuilds(user);
                            });
                }), (function (e) {
                if (e.RE_EXN_ID === DiscordRateLimited) {
                  throw e;
                }
                return Promise.resolve([]);
              }));
}

function fetchGuildFromId(guildId) {
  var headers = {
    Authorization: "Bot " + botToken + ""
  };
  var init = Webapi__Fetch.RequestInit.make(/* Get */0, Caml_option.some(headers), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined);
  return fetch(new Request("https://discord.com/api/guilds/" + guildId + "", init)).then(function (res) {
                return res.json();
              }).then(function (json) {
              return Promise.resolve(Js_null_undefined.fromOption(mapGuildRecord(Js_json.decodeObject(json))));
            });
}

function fetchGuildMemberFromId(guildId, userId) {
  var headers = {
    Authorization: "Bot " + botToken + ""
  };
  var init = Webapi__Fetch.RequestInit.make(/* Get */0, Caml_option.some(headers), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined);
  return fetch(new Request("https://discord.com/api/guilds/" + guildId + "/members/" + userId + "", init)).then(function (res) {
                return res.json();
              }).then(function (json) {
              return Promise.resolve(Js_null_undefined.fromOption(mapGuildMemberRecord(Js_json.decodeObject(json))));
            });
}

function fetchGuildRoles(guildId) {
  var headers = {
    Authorization: "Bot " + botToken + ""
  };
  var init = Webapi__Fetch.RequestInit.make(/* Get */0, Caml_option.some(headers), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined)(undefined);
  return $$Promise.$$catch(fetch(new Request("https://discord.com/api/guilds/" + guildId + "/roles", init)).then(function (res) {
                    return res.json();
                  }).then(function (json) {
                  if (Js_json.test(json, /* Array */3)) {
                    return Promise.resolve(mapRoleRecord(Js_json.decodeArray(json)));
                  }
                  var rateLimit = Js_json.decodeObject(json);
                  var retry_after = Belt_Option.flatMap(Js_dict.get(rateLimit, "retry_after"), Js_json.decodeNumber);
                  var retry_after$1;
                  if (retry_after !== undefined) {
                    retry_after$1 = (retry_after | 0) + 100 | 0;
                  } else {
                    throw {
                          RE_EXN_ID: DiscordRateLimited,
                          Error: new Error()
                        };
                  }
                  console.log("Discord Rate Limited: Retrying fetch guild: " + guildId + " roles in " + String(retry_after$1) + "ms");
                  return sleep(retry_after$1).then(function (param) {
                              return fetchGuildRoles(guildId);
                            });
                }), (function (e) {
                if (e.RE_EXN_ID === DiscordRateLimited) {
                  throw e;
                }
                return Promise.resolve([]);
              }));
}

function memberIsAdmin(guildRoles, memberRoles) {
  var adminPerm = 0x0000000000000008;
  var memberRoles$1 = guildRoles.filter(function (role) {
        return memberRoles.includes(role.id);
      });
  return memberRoles$1.some(function (role) {
              return ((role.permissions & adminPerm)) === adminPerm;
            });
}

export {
  DiscordRateLimited ,
  botToken ,
  mapGuildOauthRecord ,
  mapGuildRecord ,
  mapGuildMemberRecord ,
  mapRoleRecord ,
  sleep ,
  fetchBotGuilds ,
  fetchUserGuilds ,
  fetchGuildFromId ,
  fetchGuildMemberFromId ,
  fetchGuildRoles ,
  memberIsAdmin ,
}
/* botToken Not a pure module */
