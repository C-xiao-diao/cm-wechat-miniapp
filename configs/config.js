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
    host: "cminor.cc",
    port: 55555,
    qiniuDomain : "qg2vjw9lg.hn-bkt.clouddn.com",
    uploadUrl: "http://cminor.cc:55555/api/file/upload",
    uploadIdentifyFaceUrl: "http://cminor.cc:55555/api/file/uploadUser",
    tmplIds: ['GjjTkEb-aK9ZUCFCjBzbVRjLISNZLrysaWKlXEgMzvA'],
  },
  [Applets.prod]: {
    protocol: "https" || "wss",
    host: "cminor.cc",
    // port: 443,
    qiniuDomain : "qg2vjw9lg.hn-bkt.clouddn.com",
    uploadUrl: "https://cminor.cc/api/file/upload",
    uploadIdentifyFaceUrl: "https://cminor.cc/api/file/uploadUser",
    tmplIds: ['GjjTkEb-aK9ZUCFCjBzbVRjLISNZLrysaWKlXEgMzvA'],
  }
};

module.exports = config[env];