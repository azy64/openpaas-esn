'use strict';

const q = require('q'),
      ejs = require('ejs');

module.exports = dependencies => {
  const esnConfig = dependencies('esn-config'),
        autoconf = require('../../lib/autoconf')(dependencies);

  return {
    generate
  };

  /////

  function generate(req, res) {
    const user = req.user;

    esnConfig('autoconf').inModule('core').forUser(user).get()
      .then(config => {
        if (!config) {
          return q.reject(new Error('No autoconfiguration file configured in DB'));
        }

        return config;
      })
      .then(autoconf.transform(user))
      .then(config => ejs.render(JSON.stringify(config), { user }))
      .then(
        // We're manually setting header and sending a raw response in order to avoid calling
        // JSON.parse() to give Express a JS object, so that Express eventually calls JSON.stringify()
        // to send the response as a String anyway.
        // It's simple enough to set the header here and it avoids unnecessary transformations
        config => res.status(200).set('Content-Type', 'application/json; charset=utf-8').send(config),
        err => res.status(500).send(`Failed to generate autoconfiguration file for ${user.id}. ${err}`)
      );
  }
};
