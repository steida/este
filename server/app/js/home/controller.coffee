goog.provide 'server.home.Controller'

class server.home.Controller

  ###*
    @param {server.FrontPage} frontPage
    @param {app.react.App} todoApp
    @constructor
  ###
  constructor: (@frontPage, @todoApp) ->

  use: (route) ->
    route
      .get (req, res) =>
        html = @frontPage.render 'Home - Este.js', @todoApp.reactClass
        res['send'] html
        return