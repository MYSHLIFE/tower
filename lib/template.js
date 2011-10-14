(function() {
  /*
  ENGINE                     FILE EXTENSIONS         REQUIRED LIBRARIES
  -------------------------- ----------------------- ----------------------------
  ERB                        .erb, .rhtml            none (included ruby stdlib)
  Interpolated String        .str                    none (included ruby core)
  Erubis                     .erb, .rhtml, .erubis   erubis
  Haml                       .haml                   haml
  Sass                       .sass                   haml (< 3.1) or sass (>= 3.1)
  Scss                       .scss                   haml (< 3.1) or sass (>= 3.1)
  Less CSS                   .less                   less
  Builder                    .builder                builder
  Liquid                     .liquid                 liquid
  RDiscount                  .markdown, .mkd, .md    rdiscount
  Redcarpet                  .markdown, .mkd, .md    redcarpet
  BlueCloth                  .markdown, .mkd, .md    bluecloth
  Kramdown                   .markdown, .mkd, .md    kramdown
  Maruku                     .markdown, .mkd, .md    maruku
  RedCloth                   .textile                redcloth
  RDoc                       .rdoc                   rdoc
  Radius                     .radius                 radius
  Markaby                    .mab                    markaby
  Nokogiri                   .nokogiri               nokogiri
  CoffeeScript               .coffee                 coffee-script (+ javascript)
  Creole (Wiki markup)       .wiki, .creole          creole
  WikiCloth (Wiki markup)    .wiki, .mediawiki, .mw  wikicloth
  Yajl                       .yajl                   yajl-ruby
  
  ## Usage
  require 'erb'
  require 'tilt'
  template = Tilt.new('templates/foo.erb')
  => #<Tilt::ERBTemplate @file="templates/foo.rb" ...>
  output = template.render
  => "Hello world!"
  */
  var Template, exports;
  Template = {
    Stylus: require('../lib/template/stylus'),
    Jade: require('../lib/template/jade'),
    Haml: require('../lib/template/haml'),
    Ejs: require('../lib/template/ejs')
  };
  exports = module.exports = Template;
}).call(this);
