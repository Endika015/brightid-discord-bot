// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Discord_Role = require("./Discord_Role.bs.js");

function add(guildMemberRoleManager, role, reason) {
  return guildMemberRoleManager.t.add(role.t, Discord_Role.validateReason(reason));
}

exports.add = add;
/* No side effect */