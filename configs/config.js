const Applets = {
  dev: "dev",
  test: "test",
  prod: "prod",
};

const env = "dev";

const config = {
  version: "1.0.0",
  [Applets.dev]: {
    protocol: "http" || "ws",
    host: "cminor.dookbook.info",
    port: 55555,
    qiniuDomain : "qg2vjw9lg.hn-bkt.clouddn.com",
    uploadUrl: "http://cminor.dookbook.info:55555/api/file/upload",
    tmplIds: ['GjjTkEb-aK9ZUCFCjBzbVRjLISNZLrysaWKlXEgMzvA'],
  },
  [Applets.prod]: {
    protocol: "https" || "wss",
    host: "cminor.dookbook.info",
    // port: 443,
    qiniuDomain : "qg2vjw9lg.hn-bkt.clouddn.com",
    uploadUrl: "https://cminor.dookbook.info/api/file/upload",
    tmplIds: ['GjjTkEb-aK9ZUCFCjBzbVRjLISNZLrysaWKlXEgMzvA'],
  }
};

module.exports = config[env];