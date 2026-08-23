// Pre-bundled EJS templates for serverless/edge environments (Cloudflare Workers)
// Generated from the files in views/. Templates are compiled at build time because Workers disallow runtime code generation.

const templates = {
  "admin-panel": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"theme-color\" content=\"#f3f5f2\" />\n  <title>Administration | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/admin-panel\" aria-label=\"EcoSync administration\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Administration</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/auth/logout\">")
    ; __append(escapeFn( isDemo ? 'Exit demo' : 'Sign out' ))
    ; __append("</a>\n    </div>\n  </header>\n\n  <main class=\"page\" id=\"main-content\">\n    <div class=\"page-heading page-heading--split\">\n      <div>\n        <p class=\"eyebrow\">Administration</p>\n        <h1>Manage access</h1>\n        <p class=\"lede\">Create user accounts and maintain role-based access to EcoSync workspaces.</p>\n      </div>\n      <div class=\"actions\" aria-label=\"Administration shortcuts\">\n        <a class=\"btn btn--secondary\" href=\"/users\">User directory</a>\n        <a class=\"btn btn--secondary\" href=\"/users/roles\">System roles</a>\n        <a class=\"btn btn--secondary\" href=\"/profile\">My profile</a>\n      </div>\n    </div>\n\n    ")
    ;  if (isDemo) {
    ; __append("\n      <div class=\"demo-notice\" role=\"status\"><strong>Client preview</strong><span>Explore the complete workflow. Changes are demonstrated without touching live data.</span><a href=\"/#workspaces\">Switch role</a></div>\n    ")
    ;  }
    ; __append("\n\n    <section class=\"surface\" aria-labelledby=\"create-user-title\">\n      <div class=\"surface__header\">\n        <p class=\"eyebrow\">New account</p>\n        <h2 id=\"create-user-title\">Create a user</h2>\n      </div>\n      <form action=\"/users\" method=\"POST\">\n        <div class=\"surface__body\">\n          <div class=\"form-grid form-grid--two\">\n            <div class=\"field\">\n              <label for=\"name\">Full name</label>\n              <input class=\"input\" type=\"text\" id=\"name\" name=\"name\" autocomplete=\"name\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"email\">Email</label>\n              <input class=\"input\" type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"username\">Username</label>\n              <input class=\"input\" type=\"text\" id=\"username\" name=\"username\" autocomplete=\"username\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"password\">Temporary password</label>\n              <input class=\"input\" type=\"password\" id=\"password\" name=\"password\" autocomplete=\"new-password\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"gender\">Gender</label>\n              <select class=\"select\" id=\"gender\" name=\"gender\" required>\n                <option value=\"Male\">Male</option>\n                <option value=\"Female\">Female</option>\n                <option value=\"Other\">Other</option>\n              </select>\n            </div>\n            <div class=\"field\">\n              <label for=\"role\">Role</label>\n              <select class=\"select\" id=\"role\" name=\"role\" required>\n                <option value=\"stsManager\">STS Manager</option>\n                <option value=\"landfillManager\">Landfill Manager</option>\n                <option value=\"admin\">Admin</option>\n              </select>\n            </div>\n          </div>\n        </div>\n        <div class=\"surface__footer\">\n          <button class=\"btn btn--primary\" type=\"submit\">Create user</button>\n        </div>\n      </form>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "data-entries": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>New STS Entry | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/sts-manager-panel\" aria-label=\"EcoSync STS workspace\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">STS workspace</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/sts-manager-panel\">Back to workspace</a>\n    </div>\n  </header>\n\n  <main class=\"page page--narrow\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">Operations log</p>\n      <h1>New STS entry</h1>\n      <p class=\"lede\">Record the load details and intended landfill for this movement.</p>\n    </div>\n\n    <section class=\"surface\" aria-labelledby=\"entry-form-title\">\n      <div class=\"surface__header\">\n        <h2 id=\"entry-form-title\">Movement details</h2>\n      </div>\n      <form id=\"sts-entry-form\" action=\"/sts-data/create\" method=\"post\">\n        <div class=\"surface__body\">\n          <div class=\"form-grid\">\n            <div class=\"field\">\n              <label for=\"stsNumber\">STS number</label>\n              <input class=\"input\" type=\"number\" id=\"stsNumber\" name=\"stsNumber\" min=\"1\" inputmode=\"numeric\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"wasteWeight\">Waste amount (tons)</label>\n              <input class=\"input\" type=\"number\" id=\"wasteWeight\" name=\"wasteWeight\" min=\"0\" step=\"any\" inputmode=\"decimal\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"startTime\">Starting time</label>\n              <input class=\"input\" type=\"time\" id=\"startTime\" name=\"startTime\" required />\n            </div>\n            <div class=\"field\">\n              <label for=\"landfillSelection\">Destination landfill</label>\n              <select class=\"select\" id=\"landfillSelection\" name=\"landfillSelection\">\n                <option value=\"\">Select a landfill</option>\n                <option value=\"Amibazar\">Amibazar Landfill</option>\n                <option value=\"Matuail\">Matuail Landfill</option>\n              </select>\n              <p class=\"field__hint\">The route distance is estimated when a landfill is selected.</p>\n            </div>\n            <div class=\"field\" id=\"distanceDisplay\" hidden>\n              <label for=\"distanceKm\">Estimated distance (km)</label>\n              <input class=\"input\" type=\"text\" id=\"distanceKm\" name=\"distanceKm\" readonly />\n            </div>\n          </div>\n        </div>\n        <div class=\"surface__footer actions\">\n          <button class=\"btn btn--primary\" type=\"submit\">Submit entry</button>\n          <a class=\"btn btn--secondary\" href=\"/sts-manager-panel\">Cancel</a>\n        </div>\n      </form>\n    </section>\n  </main>\n\n  <script>\n    const landfillSelection = document.getElementById(\"landfillSelection\");\n    const distanceDisplay = document.getElementById(\"distanceDisplay\");\n    const distanceKm = document.getElementById(\"distanceKm\");\n    const entryForm = document.getElementById(\"sts-entry-form\");\n\n    let amibazarDistance = getRandomDistance(15, 23);\n    let matuailDistance = getRandomDistance(15, 23);\n\n    function getRandomDistance(min, max) {\n      return Math.floor(Math.random() * (max - min + 1)) + min;\n    }\n\n    function showDistance() {\n      const distances = {\n        Amibazar: amibazarDistance,\n        Matuail: matuailDistance\n      };\n      const selectedDistance = distances[landfillSelection.value];\n\n      distanceDisplay.hidden = !selectedDistance;\n      distanceKm.value = selectedDistance || \"\";\n    }\n\n    landfillSelection.addEventListener(\"change\", showDistance);\n    entryForm.addEventListener(\"submit\", function () {\n      amibazarDistance = getRandomDistance(15, 23);\n      matuailDistance = getRandomDistance(15, 23);\n    });\n  </script>\n</body>\n</html>\n")
  return __output;

},
  "edit-user": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Edit User | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/admin-panel\" aria-label=\"EcoSync administration\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Administration</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/users\">Back to users</a>\n    </div>\n  </header>\n\n  <main class=\"page page--narrow\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">User management</p>\n      <h1>Edit user</h1>\n      <p class=\"lede\">Update account details, credentials, and assigned access.</p>\n    </div>\n\n    <section class=\"surface\" aria-labelledby=\"edit-user-title\">\n      <div class=\"surface__header\">\n        <h2 id=\"edit-user-title\">")
    ; __append(escapeFn( user.username ))
    ; __append("</h2>\n      </div>\n      <form action=\"/users/update/")
    ; __append(escapeFn( user._id ))
    ; __append("\" method=\"POST\">\n        <div class=\"surface__body\">\n          <div class=\"form-grid form-grid--two\">\n            <div class=\"field\">\n              <label for=\"name\">Full name</label>\n              <input class=\"input\" type=\"text\" id=\"name\" name=\"name\" autocomplete=\"name\" required value=\"")
    ; __append(escapeFn( user.name ))
    ; __append("\" />\n            </div>\n            <div class=\"field\">\n              <label for=\"email\">Email</label>\n              <input class=\"input\" type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" required value=\"")
    ; __append(escapeFn( user.email ))
    ; __append("\" />\n            </div>\n            <div class=\"field\">\n              <label for=\"username\">Username</label>\n              <input class=\"input\" type=\"text\" id=\"username\" name=\"username\" autocomplete=\"username\" required value=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\" />\n            </div>\n            <div class=\"field\">\n              <label for=\"gender\">Gender</label>\n              <select class=\"select\" id=\"gender\" name=\"gender\" required>\n                <option value=\"Male\" ")
    ; __append(escapeFn( user.gender === 'Male' ? 'selected' : '' ))
    ; __append(">Male</option>\n                <option value=\"Female\" ")
    ; __append(escapeFn( user.gender === 'Female' ? 'selected' : '' ))
    ; __append(">Female</option>\n                <option value=\"Other\" ")
    ; __append(escapeFn( user.gender === 'Other' ? 'selected' : '' ))
    ; __append(">Other</option>\n              </select>\n            </div>\n            <div class=\"field\">\n              <label for=\"password\">New password</label>\n              <input class=\"input\" type=\"password\" id=\"password\" name=\"password\" autocomplete=\"new-password\" placeholder=\"Leave blank to keep current password\" />\n            </div>\n            <div class=\"field\">\n              <label for=\"role\">Role</label>\n              <select class=\"select\" id=\"role\" name=\"role\" required>\n                ")
    ;  roles.forEach(function(role) {
    ; __append("\n                  <option value=\"")
    ; __append(escapeFn( role ))
    ; __append("\" ")
    ; __append(escapeFn( user.role === role ? 'selected' : '' ))
    ; __append(">")
    ; __append(escapeFn( role ))
    ; __append("</option>\n                ")
    ;  });
    ; __append("\n              </select>\n            </div>\n          </div>\n        </div>\n        <div class=\"surface__footer actions\">\n          <button class=\"btn btn--primary\" type=\"submit\">Save changes</button>\n          <a class=\"btn btn--secondary\" href=\"/users\">Cancel</a>\n        </div>\n      </form>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "landfill-data-entry": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Generate STS Report | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/landfill-manager-panel\" aria-label=\"EcoSync landfill workspace\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Landfill workspace</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/landfill-manager-panel\">Back to workspace</a>\n    </div>\n  </header>\n\n  <main class=\"page page--narrow\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">Reporting</p>\n      <h1>Generate an STS report</h1>\n      <p class=\"lede\">Enter the transfer station number to retrieve its latest transport data.</p>\n    </div>\n\n    <section class=\"surface\" aria-labelledby=\"report-form-title\">\n      <div class=\"surface__header\">\n        <h2 id=\"report-form-title\">Report lookup</h2>\n      </div>\n      <form action=\"/print-report\" method=\"post\">\n        <div class=\"surface__body\">\n          <div class=\"field\">\n            <label for=\"stsNumber\">STS number</label>\n            <input class=\"input\" type=\"text\" id=\"stsNumber\" name=\"stsNumber\" inputmode=\"numeric\" value=\"")
    ; __append(escapeFn( isDemo ? '101' : '' ))
    ; __append("\" required autofocus />\n            <p class=\"field__hint\">")
    ; __append(escapeFn( isDemo ? 'Use sample STS 101 to download a demonstration report.' : 'A PDF transport report will be generated from the matching record.' ))
    ; __append("</p>\n          </div>\n        </div>\n        <div class=\"surface__footer actions\">\n          <button class=\"btn btn--primary\" type=\"submit\">Download PDF report</button>\n          <a class=\"btn btn--secondary\" href=\"/landfill-manager-panel\">Cancel</a>\n        </div>\n      </form>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "landfill-manager-panel": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"theme-color\" content=\"#f3f5f2\" />\n  <title>Landfill Workspace | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/landfill-manager-panel\" aria-label=\"EcoSync landfill workspace\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Landfill workspace</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/auth/logout\">")
    ; __append(escapeFn( isDemo ? 'Exit demo' : 'Sign out' ))
    ; __append("</a>\n    </div>\n  </header>\n\n  <main class=\"page\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">Landfill operations</p>\n      <h1>Landfill Manager workspace</h1>\n      <p class=\"lede\">Retrieve transfer-station reports and manage your account from one place.</p>\n    </div>\n\n    ")
    ;  if (isDemo) {
    ; __append("\n      <div class=\"demo-notice\" role=\"status\"><strong>Client preview</strong><span>Generate the sample STS 101 report to test PDF download on this device.</span><a href=\"/#workspaces\">Switch role</a></div>\n    ")
    ;  }
    ; __append("\n\n    <div class=\"dashboard-grid\">\n      <section class=\"task-card\">\n        <div>\n          <span class=\"task-card__index\">Reporting</span>\n          <h2>STS report</h2>\n          <p>Generate a transport report using the transfer station number.</p>\n        </div>\n        <a class=\"btn btn--primary\" href=\"/landfill-data-entry\">Get report</a>\n      </section>\n\n      <section class=\"task-card\">\n        <div>\n          <span class=\"task-card__index\">Account</span>\n          <h2>Profile details</h2>\n          <p>Review and update your account information and credentials.</p>\n        </div>\n        <a class=\"btn btn--secondary\" href=\"/profile\">View profile</a>\n      </section>\n    </div>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "landing": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"theme-color\" content=\"#17201b\" />\n  <meta name=\"description\" content=\"EcoSync coordinates transfer-station and landfill operations from one clear workspace.\" />\n  <title>EcoSync | Waste operations, coordinated</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body class=\"landing-body\">\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n\n  <header class=\"landing-header\">\n    <div class=\"landing-header__inner\">\n      <a class=\"brand brand--inverse\" href=\"/\" aria-label=\"EcoSync home\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Municipal waste operations</span>\n        </span>\n      </a>\n      <a class=\"btn btn--on-dark\" href=\"/login\">Team sign in</a>\n    </div>\n  </header>\n\n  <main id=\"main-content\">\n    <section class=\"landing-hero\" aria-labelledby=\"hero-title\">\n      <div class=\"landing-hero__content\">\n        <p class=\"eyebrow eyebrow--light\">One connected operation</p>\n        <h1 id=\"hero-title\">Waste operations, coordinated.</h1>\n        <p>EcoSync gives municipal teams a shared view of access, transfer-station activity, and landfill reporting—from entry to final record.</p>\n        <a class=\"hero-link\" href=\"#workspaces\">Choose a workspace <span aria-hidden=\"true\">↓</span></a>\n      </div>\n    </section>\n\n    <section class=\"workspace-section\" id=\"workspaces\" aria-labelledby=\"workspaces-title\">\n      <div class=\"workspace-section__heading\">\n        <div>\n          <p class=\"eyebrow\">Role-based workspaces</p>\n          <h2 id=\"workspaces-title\">Choose your view.</h2>\n        </div>\n        <p>Open any workspace instantly. These client previews are safe, read-only, and need no password.</p>\n      </div>\n\n      <div class=\"role-grid\">\n        <article class=\"role-card\">\n          <div>\n            <div class=\"role-card__meta\"><span class=\"role-card__number\">01</span><p class=\"role-card__scope\">Governance</p></div>\n            <h3>Admin</h3>\n            <p>Create accounts, assign roles, and maintain access across the operation.</p>\n          </div>\n          <form action=\"/demo/admin\" method=\"post\">\n            <button class=\"role-card__link\" type=\"submit\">View as Admin <span aria-hidden=\"true\">↗</span></button>\n          </form>\n        </article>\n\n        <article class=\"role-card\">\n          <div>\n            <div class=\"role-card__meta\"><span class=\"role-card__number\">02</span><p class=\"role-card__scope\">Transfer station</p></div>\n            <h3>STS Manager</h3>\n            <p>Capture load weight, departure time, destination, and estimated route distance.</p>\n          </div>\n          <form action=\"/demo/stsManager\" method=\"post\">\n            <button class=\"role-card__link\" type=\"submit\">View as STS Manager <span aria-hidden=\"true\">↗</span></button>\n          </form>\n        </article>\n\n        <article class=\"role-card role-card--accent\">\n          <div>\n            <div class=\"role-card__meta\"><span class=\"role-card__number\">03</span><p class=\"role-card__scope\">Final destination</p></div>\n            <h3>Landfill Manager</h3>\n            <p>Retrieve movement details and download a clear, print-ready PDF report on any device.</p>\n          </div>\n          <form action=\"/demo/landfillManager\" method=\"post\">\n            <button class=\"role-card__link\" type=\"submit\">View as Landfill Manager <span aria-hidden=\"true\">↗</span></button>\n          </form>\n        </article>\n      </div>\n    </section>\n\n    <section class=\"landing-proof\" aria-label=\"Platform qualities\">\n      <p>Built for field operations</p>\n      <div class=\"landing-proof__items\">\n        <span>Role-based access</span>\n        <span>Mobile-ready reporting</span>\n        <span>Cloud deployment</span>\n      </div>\n    </section>\n  </main>\n\n  <footer class=\"landing-footer\">\n    <span>EcoSync</span>\n    <span>Waste Management &amp; Logistics Platform</span>\n  </footer>\n</body>\n</html>\n")
  return __output;

},
  "login": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"theme-color\" content=\"#17201b\" />\n  <title>Sign in | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <main class=\"login-shell\">\n    <section class=\"login-intro\" aria-labelledby=\"platform-title\">\n      <div class=\"login-intro__inner\">\n        <div class=\"login-intro__rule\" aria-hidden=\"true\"></div>\n        <p class=\"eyebrow\">Municipal operations</p>\n        <h1 id=\"platform-title\">Cleaner logistics.<br />Clearer decisions.</h1>\n        <p class=\"lede\">A focused workspace for transfer-station and landfill teams to coordinate daily waste operations.</p>\n      </div>\n    </section>\n\n    <section class=\"login-panel\" aria-labelledby=\"login-title\">\n      <div class=\"login-card\">\n        <a class=\"brand\" href=\"/\" aria-label=\"EcoSync home\">\n          <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n          <span class=\"brand__text\">\n            <span class=\"brand__name\">EcoSync</span>\n            <span class=\"brand__descriptor\">Waste operations</span>\n          </span>\n        </a>\n\n        <div class=\"login-card__heading\">\n          <p class=\"eyebrow\">Secure access</p>\n          <h2 id=\"login-title\">Sign in to your workspace</h2>\n          <p class=\"muted\">Use your assigned username or work email.</p>\n        </div>\n\n        <form class=\"form-grid\" action=\"/auth/login\" method=\"POST\">\n          <div class=\"field\">\n            <label for=\"login\">Username or email</label>\n            <input class=\"input\" type=\"text\" id=\"login\" name=\"login\" autocomplete=\"username\" required autofocus />\n          </div>\n          <div class=\"field\">\n            <label for=\"password\">Password</label>\n            <input class=\"input\" type=\"password\" id=\"password\" name=\"password\" autocomplete=\"current-password\" required />\n          </div>\n          <button class=\"btn btn--primary full-width\" type=\"submit\">Sign in</button>\n        </form>\n      </div>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "profile-view": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>My Profile | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"")
    ; __append(escapeFn( role === 'admin' ? '/admin-panel' : role === 'stsManager' ? '/sts-manager-panel' : '/landfill-manager-panel' ))
    ; __append("\" aria-label=\"EcoSync workspace\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">My account</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"")
    ; __append(escapeFn( role === 'admin' ? '/admin-panel' : role === 'stsManager' ? '/sts-manager-panel' : '/landfill-manager-panel' ))
    ; __append("\">Back to workspace</a>\n    </div>\n  </header>\n\n  <main class=\"page page--narrow\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">My account</p>\n      <h1>Profile settings</h1>\n      <p class=\"lede\">Keep your personal and sign-in information current.</p>\n    </div>\n\n    ")
    ;  if (isDemo) {
    ; __append("\n      <div class=\"demo-notice\" role=\"status\"><strong>Client preview</strong><span>This sample profile is read-only and does not represent a live account.</span><a href=\"/#workspaces\">Switch role</a></div>\n    ")
    ;  }
    ; __append("\n\n    <div class=\"section-stack\">\n      <section class=\"profile-summary\" aria-label=\"Current account summary\">\n        <div>\n          <p class=\"profile-summary__name\">")
    ; __append(escapeFn( user.name ))
    ; __append("</p>\n          <p class=\"muted\">@")
    ; __append(escapeFn( user.username ))
    ; __append("</p>\n        </div>\n        <span class=\"badge\">\n          ")
    ;  if (user.role === 'stsManager') {
    ; __append("\n            STS Manager\n          ")
    ;  } else if (user.role === 'admin') {
    ; __append("\n            Admin\n          ")
    ;  } else if (user.role === 'landfillManager') {
    ; __append("\n            Landfill Manager\n          ")
    ;  } else {
    ; __append("\n            ")
    ; __append(escapeFn( user.role ))
    ; __append("\n          ")
    ;  }
    ; __append("\n        </span>\n      </section>\n\n      <section class=\"surface\" aria-labelledby=\"profile-form-title\">\n        <div class=\"surface__header\">\n          <h2 id=\"profile-form-title\">Account details</h2>\n        </div>\n        <form action=\"/profile\" method=\"post\">\n          <div class=\"surface__body\">\n            <div class=\"form-grid form-grid--two\">\n              <div class=\"field\">\n                <label for=\"name\">Full name</label>\n                <input class=\"input\" type=\"text\" id=\"name\" name=\"name\" autocomplete=\"name\" value=\"")
    ; __append(escapeFn( user.name ))
    ; __append("\" required />\n              </div>\n              <div class=\"field\">\n                <label for=\"email\">Email</label>\n                <input class=\"input\" type=\"email\" id=\"email\" name=\"email\" autocomplete=\"email\" value=\"")
    ; __append(escapeFn( user.email ))
    ; __append("\" required />\n              </div>\n              <div class=\"field\">\n                <label for=\"username\">Username</label>\n                <input class=\"input\" type=\"text\" id=\"username\" name=\"username\" autocomplete=\"username\" value=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\" required />\n              </div>\n              <div class=\"field\">\n                <label for=\"gender\">Gender</label>\n                <select class=\"select\" id=\"gender\" name=\"gender\" required>\n                  <option value=\"Male\" ")
    ; __append(escapeFn( user.gender === 'Male' ? 'selected' : '' ))
    ; __append(">Male</option>\n                  <option value=\"Female\" ")
    ; __append(escapeFn( user.gender === 'Female' ? 'selected' : '' ))
    ; __append(">Female</option>\n                  <option value=\"Other\" ")
    ; __append(escapeFn( user.gender === 'Other' ? 'selected' : '' ))
    ; __append(">Other</option>\n                </select>\n              </div>\n              <div class=\"field field--wide\">\n                <label for=\"password\">New password</label>\n                <input class=\"input\" type=\"password\" id=\"password\" name=\"password\" autocomplete=\"new-password\" placeholder=\"Leave blank to keep current password\" />\n              </div>\n            </div>\n          </div>\n          <div class=\"surface__footer actions\">\n            ")
    ;  if (!isDemo) {
    ; __append("\n              <button class=\"btn btn--primary\" type=\"submit\">Save changes</button>\n            ")
    ;  }
    ; __append("\n            <a class=\"btn btn--secondary\" href=\"")
    ; __append(escapeFn( role === 'admin' ? '/admin-panel' : role === 'stsManager' ? '/sts-manager-panel' : '/landfill-manager-panel' ))
    ; __append("\">Cancel</a>\n          </div>\n        </form>\n      </section>\n    </div>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "roles-list": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Roles | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/admin-panel\" aria-label=\"EcoSync administration\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Administration</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/admin-panel\">Back to admin</a>\n    </div>\n  </header>\n\n  <main class=\"page page--narrow\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">Access control</p>\n      <h1>System roles</h1>\n      <p class=\"lede\">Roles determine the workspace and operational tools available to each user.</p>\n    </div>\n\n    <section class=\"surface\" aria-labelledby=\"role-list-title\">\n      <div class=\"surface__header\">\n        <h2 id=\"role-list-title\">Available roles</h2>\n      </div>\n      <div class=\"surface__body\">\n        <ul class=\"list\">\n          ")
    ;  roles.forEach(function(role) {
    ; __append("\n            <li class=\"list-row\">\n              <span class=\"list-row__primary\">")
    ; __append(escapeFn( role ))
    ; __append("</span>\n              <span class=\"badge\">Active</span>\n            </li>\n          ")
    ;  });
    ; __append("\n        </ul>\n      </div>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "sts-manager-panel": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta name=\"theme-color\" content=\"#f3f5f2\" />\n  <title>STS Workspace | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/sts-manager-panel\" aria-label=\"EcoSync STS workspace\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">STS workspace</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/auth/logout\">")
    ; __append(escapeFn( isDemo ? 'Exit demo' : 'Sign out' ))
    ; __append("</a>\n    </div>\n  </header>\n\n  <main class=\"page\" id=\"main-content\">\n    <div class=\"page-heading\">\n      <p class=\"eyebrow\">Transfer station</p>\n      <h1>STS Manager workspace</h1>\n      <p class=\"lede\">Record station activity and keep your account details up to date.</p>\n    </div>\n\n    ")
    ;  if (isDemo) {
    ; __append("\n      <div class=\"demo-notice\" role=\"status\"><strong>Client preview</strong><span>Try the data-entry workflow. Demo submissions do not change live records.</span><a href=\"/#workspaces\">Switch role</a></div>\n    ")
    ;  }
    ; __append("\n\n    <div class=\"dashboard-grid\">\n      <section class=\"task-card\">\n        <div>\n          <span class=\"task-card__index\">Operations</span>\n          <h2>New data entry</h2>\n          <p>Log waste volume, timing, destination, and route distance for an STS movement.</p>\n        </div>\n        <a class=\"btn btn--primary\" href=\"/sts-manager/data-entry\">Create entry</a>\n      </section>\n\n      <section class=\"task-card\">\n        <div>\n          <span class=\"task-card__index\">Account</span>\n          <h2>Profile details</h2>\n          <p>Review and update your name, email, username, gender, or password.</p>\n        </div>\n        <a class=\"btn btn--secondary\" href=\"/profile\">View profile</a>\n      </section>\n    </div>\n  </main>\n</body>\n</html>\n")
  return __output;

},
  "users-list": function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  var __locals = (locals || {}),
isDemo = __locals.isDemo,
  role = __locals.role,
  roles = __locals.roles,
  user = __locals.user,
  users = __locals.users;
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Users | EcoSync</title>\n  <link rel=\"stylesheet\" href=\"/styles.css\" />\n</head>\n<body>\n  <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>\n  <header class=\"site-header\">\n    <div class=\"site-header__inner\">\n      <a class=\"brand\" href=\"/admin-panel\" aria-label=\"EcoSync administration\">\n        <span class=\"brand__mark\" aria-hidden=\"true\">E</span>\n        <span class=\"brand__text\">\n          <span class=\"brand__name\">EcoSync</span>\n          <span class=\"brand__descriptor\">Administration</span>\n        </span>\n      </a>\n      <a class=\"btn btn--quiet\" href=\"/admin-panel\">Back to admin</a>\n    </div>\n  </header>\n\n  <main class=\"page\" id=\"main-content\">\n    <div class=\"page-heading page-heading--split\">\n      <div>\n        <p class=\"eyebrow\">Access control</p>\n        <h1>User directory</h1>\n        <p class=\"lede\">Review assigned roles and maintain user access.</p>\n      </div>\n      <a class=\"btn btn--secondary\" href=\"/admin-panel\">Create a user</a>\n    </div>\n\n    <section class=\"surface\" aria-labelledby=\"user-list-title\">\n      <div class=\"surface__header\">\n        <h2 id=\"user-list-title\">All users</h2>\n      </div>\n      <div class=\"surface__body\">\n        ")
    ;  if (users.length === 0) {
    ; __append("\n          <div class=\"empty-state\">No users have been added yet.</div>\n        ")
    ;  } else {
    ; __append("\n          <ul class=\"list\">\n            ")
    ;  users.forEach(user => {
    ; __append("\n              <li class=\"list-row\">\n                <div>\n                  <div class=\"list-row__primary\">")
    ; __append(escapeFn( user.username ))
    ; __append("</div>\n                  <div class=\"list-row__secondary\">Role: ")
    ; __append(escapeFn( user.role ))
    ; __append("</div>\n                </div>\n                <div class=\"actions\">\n                  <a class=\"btn btn--secondary\" href=\"/users/edit/")
    ; __append(escapeFn( user._id ))
    ; __append("\">Edit</a>\n                  <form class=\"inline-form\" action=\"/users/delete/")
    ; __append(escapeFn( user._id ))
    ; __append("\" method=\"POST\">\n                    <button class=\"btn btn--danger\" type=\"submit\">Delete</button>\n                  </form>\n                </div>\n              </li>\n            ")
    ;  })
    ; __append("\n          </ul>\n        ")
    ;  }
    ; __append("\n      </div>\n    </section>\n  </main>\n</body>\n</html>\n")
  return __output;

}
};

module.exports = templates;
