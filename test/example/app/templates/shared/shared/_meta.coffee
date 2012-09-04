meta charset: "utf-8"

if hasContentFor "title"
  title @title
else
  title t("title")

meta name: "description", content: t("description")
meta name: "keywords", content: t("keywords")
meta name: "robots", content: t("robots")
meta name: "author", content: t("author")

csrfMetaTag()

appleViewportMetaTag width: "device-width", max: 1, scalable: false

stylesheets "lib", "vendor", "application", "development"

link href: "/favicon.png", rel: "icon shortcut-icon favicon"

#if browserIs("firefox")
#  stylesheets "font"

#if contentFor "headStyleSheets"
#  yield "headStyleSheets"

script '''
window.ENV                  = {};
ENV.VIEW_PRESERVES_CONTEXT  = true;
ENV.CP_DEFAULT_CACHEABLE    = true;
ENV.FORCE_JQUERY            = true; // tmp, so ember doesn't require 1.7
'''

javascriptTag "https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"
  
#if contentFor "headJavaScripts"
#  yield "headJavaScripts"