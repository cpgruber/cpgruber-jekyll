---
layout: post
title:  "Painless deployment of MEAN stack app"
date:   2016-01-02
description: It's really not that hard.
tags: Add Tags Here
css: /css/blog.css
---

Over the break, I built an NBA scoreboard app using the MEAN (*sans Angular*) stack. The purpose of the app is to quickly inform users of game outcomes from the night before-- which I find extremely useful as an East Coaster and Steph Curry fanboy, as Golden State games typically end in the wee hours of the night for me. The back end of the app does some interesting asynchronous number crunching, and the front end makes use of object oriented JavaScript and some D3 visualizations, but I want to focus this post the app's deployment to Heroku, which is something I hadn't done before.

####Initial setup

Follow along by forking and cloning [this repo](https://github.com/cpgruber/nba-score-app). This tutorial assumes you have Node and MongoDB installed-- if you don't, you can install them with Homebrew using `$ brew install node` and `$ brew install mongodb`. After you `$ cd` into the project directory locally, run `$ npm install` to set up the app. This application uses [Stattleship's](https://stattleship.com) API to query scores, so you will need to sign up with them to get an API key. Once you have a key, you will need to add an `env.js` file to the top level directory of the project, which needs to be set up as follows:
{% highlight js %}
//in env.js
module.exports = {
  key: "YOUR_ API_KEY_HERE"
}
{% endhighlight %}
By this point, you should be able to run the app locally by starting an instance of MongoDB (`$ mongod`) and then start your node server (`$ nodemon`). The app can be viewed on `localhost:4000`. If that worked out, time to get the app deployed on Heroku.

####Login to Heroku, heroku create
Login to your Heroku dashboard-- if you're not signed up with Heroku, do so [here](http://www.heroku.com). Assuming you have the [heroku toolbelt](https://toolbelt.heroku.com/) installed, create a new app in the terminal using `$ heroku create APP-NAME-HERE`. This will create a new remote for your git repository on Heroku-- you should be able to see it on your Heroku dashboard after a page refresh. If you run `$ heroku open`, your browser will open your app and you'll see a page welcoming you to your Heroku app. This is a nice start, but there's nothing in your app. Let's fix that by pushing our app using `$ git push heroku master`. In the terminal, you'll see your app build. In your browser, you'll see an application error-- which is progress. At this point, I would checkout a new branch for the deployed app `$ git checkout -b deployment`, and make changes to this app to preserve the working app in the master branch.

####Provision a MongoDB
Since Heroku's default database is PostgreSQL, we need to provision the app a MongoDB database. Click on the app in the dashboard and navigate to the `Resources` tab. Under add-ons, do a search for "mongo"-- click on `MongoLab` and provision a sandbox plan for the app. (Sidebar: if you haven't, Heroku will prompt you to enter credit card information to provision this **free** add-on. Weird, but they haven't charged me for anything).

####Environment settings
In your Heroku account, navigate to the `Settings` tab. In `Config_vars`, add a new key-value for the Stattleship API key in `env.js`. Since `env.js` is included in the `.gitignore`, the deployed app cannot have any references to the `env.js` file. Fortunately, this omission only needs to be made once in `controllers/gamesController.js`. The config variable we just created can be accessed using `process.env.KEY`. My `stattleship_params` variable looks like this:
{% highlight js %}
// controllers/gamesController.js
var stattleship_params = {
  method:'GET',
  json:true,
  headers:{
    'Content-Type':'application/json',
    'Authorization':'Token token='+process.env.stattleship,
    'Accept':'application/vnd.stattleship.com; version=1.2'
  }
}
// NOTE: var env=require("env.js") in line 4 needs to be omitted
// or commented out. `env.js` does not exist in the deployed app.
{% endhighlight %}
Now we have to tell the app to connect to the Mongo database we just provisioned. In `index.js`, we'll replace the local database connection with the MongoLab URI specified in `Config_vars`, again accessed using `process.env`. We'll also set the port using `process.env`:
{% highlight js %}
// index.js

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://localhost/nba-scoreboard');

var port = process.env.PORT || 4000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
{% endhighlight %}
Now, let's `$ git add` and `$ git commit` these changes to the `deployed` branch, and push to Heroku. Note that when pushing to Heroku from a branch other than `master`, you need to use the command `$ git push heroku [branch]:master`, so in this case `$ git push heroku deployment:master`. You should see that your app was rebuild, and get verification of the deployment. Check in your browser and you should see... Application Error. What gives?

####Add a Procfile
Even though the build succeeded, there is nothing prompting Heroku to execute any code. Just like in a local environment you have to run `$ node index.js` to start your app, the `Procfile` gives Heroku instruction to do just that. In the project's top level directory, add a file called `Procfile` (no file extension needed), and inside it put `web: node index.js`. Add, commit, and push to Heroku, then go back to the browser and you'll see a working app. But this doesn't look quite right-- where are all the scores?

####Finishing touches
The last thing we need to do is change the front end reference to our API, which is making AJAX calls to localhost. The app makes this call in `public/js/models.game.js`, in the `fetch()` method. A quick way to fix this is to make the base of the AJAX url the same as the window url:
{% highlight js %}
Game.fetch = function(date){
  var baseURL = window.location.href;
  return $.ajax({
    type:"GET",
    dataType:"json",
    url:baseURL+"games?date="+date
  }).then(...
{% endhighlight %}
At this point, we also see a console error in the browser saying we have mixed `http` and `https` content. This is in the `<head>` of `public/index.html`, specifically in the sources of the jQuery CDN the app references. The **last** last thing to do is change those urls to `https`. Add, commit, and push to Heroku and we're golden. Now we have a working, deployed app!
