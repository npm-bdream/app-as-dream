[![NPM](https://nodei.co/npm/app-as-dream.png?downloads=true&stars=true)](https://nodei.co/npm/app-as-dream/)

**app-as-dream**
===============

Starter kit for WebApp development.

* Installs several useful npm packages for you, mainly `grunt` and its contribs.
* Offers simple project stucture, with predefined useful `grunt` tasks.
* Offers simple release system with versioning.

Ideal for litle WepApp, you dont loose time for install, concat, minify, archive.

Installation
============

Install this globally and you'll have access to the `appasdream` command anywhere on your system.

    npm install -g app-as-dream

Choose an empty folder, because next command will create and install many files and folder in source folder :

    cd ./testappasdream // for exemple

Then execute package command  :

    appasdream install webapp


Actions :
---------

1. Adds predefined files and folders structure.
2. Adds predefined `Gruntfile.js` file. Used for continuous development flow.
3. Adds exemple `AppConf.js`, witch is used as simple configuration for your GruntFile.
4. Adds `Server.js` file. If you want a web server installed quickly (without configuration).
5. Adds a predifined `package.json` file. Used to install all needed npm packages, and by Grunt tasks.
6. Execute following npm command for you : `npm install`. (use package.json file).
7. Few simples files are added as exemple.

**Usage**
=========

Understand files structure
-------------------------

* **`_release`**  Contain released tar.gz order by version.
* **`_www`** Local server folder, contains builded files
* **`app`** Contain your development files
    * **`css`** All the css files you wish to add to your application development
    * **`js`** All the js files you wish to add to your application development
    * **`www`** All this folder content is copied as it is. Only patterns replacements.
* **`node_modules`** Contain installed node packages
* **`libraries`** Downloaded libraries from `AppConf.json` config, all concatenated and minified in `libraries` generated files.
* **`AppConf.json`** Very simple configuration file for `grunt` tasks. Define libaries, your app content, and replacements.
* **`Gruntfile.js`** Predefined `grunt` tasks for this WebApp structure work flow.
* **`package.json`** Mainly used for first install, and after for application name and versioning
* **`Server.js`** Very simple node web server to access your work from browser.

Understand and use Gruntfile.js
-------------------------------

**Default task**

If you want to build manually, you can use the following command

    grunt default
**`./_www`** contain builded files and folders :

* Copy `./app/www/` content as it is and replaces defined patterns in `./AppConf.js`
* Generate js and css files for application. All defined files in `./AppConf.js` are concatenated, minified, and all patterns are replaced.
* Generate js and css files for libraries as defined in `./AppConf.js`

If your Application name is `MyApp` and your version is `0.0.15`, resulted files are named as follows :

* MyApp-app-0.0.15.js
* MyApp-app-0.0.15.min.js
* MyApp-app-0.0.15.css
* MyApp-app-0.0.15.min.css
* MyApp-libraries-0.0.15.js
* MyApp-libraries-0.0.15.min.js
* MyApp-libraries-0.0.15.css
* MyApp-libraries-0.0.15.min.css

*Find application **name** and **version** in `./package.json`*

**Watch task**

Use this task to automatically run a build when an element change in **`./app`** folder or if you change **`./AppConf.js`** configuration. The **`default`** task will be executed.

    grunt watch_task

**Release tasks**

When you want to release your work (up version) `release` tasks will do the job for you :
Use following commands :

    grunt release_patch
    grunt release_minor
    grunt release_major
    grunt release_overwrite

*Result examples for versions. In my `./package.json`, my version is `0.1.15`:*

* If I use `grunt release_patch` -> new version will be `0.1.16`.
* If I use `grunt release_minor` -> new version will be `0.2.0`.
* If I use `grunt release_major` -> new version will be `1.0.0`.
* If I use `grunt release_overwrite` -> new version will be `0.1.15`.

*Generated archives example :*

* My current version is `0.2.8` and my application name is `MyApp`
* So I execute `grunt release_minor` command
* Finally the generated files are :
    * `./_release/0.3.0/MyApp-0.3.0-sources.tar.gz` 
    * `./_release/0.3.0/MyApp-0.3.0-web.tar.gz`

`*.sources.tar.gz` contains all needed files for installing project and all code files. If you extract this archive in other folder you can execute `npm install` then `grunt update_libraries` and you are ready to work!

`*.sources.tar.gz` contains a copy of your builded folder `./_www`

*NOTE : in case of usage error, you can manualy change version in `./package.json`. If you want, remove unwanted version folder in `./_release` folder

**Update task**
    
When you install application or when you change `libraries` settings in `./AppConf.js`, it's really mandatory to run this command who build `./_libraries` content for you. 

This task isn't added in the `default` because `update_libraries` task download files from urls.

* You don't often change `libraries` config.
* You don't want download every two minutes the same files.

Use following command :

    grunt update_libraries

*Be careful, when you use this command, `./libraries` folder is completely removed*
*Don't use this folder for you personal work, also it is not added in sources archive*

Use AppConf.js file
-------------------

With `./AppConf.js` you can manage several aspects in you project, see example file :

    module.exports = {
        "libraries": [
            "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.js",
            "https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css",
            "https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.js",
            "http://getbootstrap.com/assets/js/docs.min.js"
        ],
        "app": {
            "js":[
                "/jsfile01.js",
                "/jsfile02.js",
                "/jsfile03.js"
            ],
            "css":[
                "/cssfile01.css",
                "/cssfile02.css"
            ]
        },
        "replacements": [
            { "from": "{test.title}", "to": "My App Title exemple" },
            { "from": "{test.date}", "to": "<%= grunt.template.today('[yyyy]') %>"},
            { "from": "{test.test01}", "to": "Replaced text in jsfile01.js" },
            { "from": "{test.test02}", "to": "Replaced text in jsfile02.js" },
            { "from": "{test.test03}", "to": "Replaced text in jsfile03.js" }
        ]
    };

* If you make changes in `libraries` part of config, use `grunt update_libraries` command  for creating new `./libraries` tree
* If you make changes in `replacements` part of config.
    * Use `default` grunt task. If `watch` is working, he catches changes for this part.
    * Specified paterns are replaced by your defined text.
    * When we build with default task we generate a server folder `./_www`, replacements are made in all files in this forder.
    * Note that it is possible to use fixes patterns defined in `GruntFile` :
        * {app.name}
        * {app.version}
        * {app.author}
        * {app.date}
        * {app.rid}
        * {file.app.js}
        * {file.app.min.js}
        * {file.libraries.js}
        * {file.libraries.min.js}
        * {file.app.css}
        * {file.app.min.css}
        * {file.libraries.css}
        * {file.libraries.min.css}
    * You can override them. But this is not recommended for files.

* `App` part define all your js and css files that you want manage in your application.
    * For exemple if you add the file `jsfile01.js` in `./app/js/`. You can add `"/jsfile01.js"` in js part of config, this file will be considered for compilation.
    * **The order in config defined the order of concatenation. This is important.**

HTML Example file
-------------------
**In your html file : exemple with `./app/www/index.html`**

if you add following lines you can use result of grunt tasks.

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Start app : {app.title}</title>
        <!-- Placed in the head of the document -->
        <link rel="stylesheet" href="{file.libraries.min.css}{app.rid}">
        <link rel="stylesheet" href="{file.app.min.css}{app.rid}">
    </head>
    <body>
        
        <h1>{app.name}</h1>
        
        Name : {app.name} <br />
        Version : {app.version} <br />
        Author : {app.author} <br />
        Date : {app.date} <br />
        Application concatened javascript file name : {file.app.js}
        Application concatened and minified javascript file name : {file.app.min.js}
        Libraries concatened javascript file name : {file.libraries.js}
        Libraries concatened and minified javascript file name : {file.libraries.min.js}
        Application concatened css file name : {file.app.css}
        Application concatened and minified css file name : {file.app.min.css}
        Libraries concatened css file name : {file.libraries.css}
        Libraries concatened and minified css file name : {file.libraries.min.css}
        
        <!-- Placed at the end of the document so the pages load faster -->
        <script src="{file.libraries.min.js}{app.rid}"></script>
        <script src="{file.app.min.js}{app.rid}"></script>
    
    </body>
    </html>


Use Local serveur
-----------------
Is your project builded with grunt ? So go in your root dir and execute command for using local server :

    node Server.js

Now in your browser, you can access this url :

- [http://localhost:3000/](http://localhost:3000/)

MORE
=========

For any requests, You can contact me on this email : npm.bdream@gmail.com

Next steps :

* Improvements are under study

I don't use all features offered by packages.

for more information about installed packages look at their pages :

* [https://www.npmjs.org/package/grunt-cli](grunt-cli) Use grunt command.
* [https://www.npmjs.org/package/grunt](grunt) Use grunt.
* [https://www.npmjs.org/package/grunt-contrib-copy](grunt-contrib-copy) Grunt contrib to copy files
* [https://www.npmjs.org/package/grunt-contrib-clean](grunt-contrib-clean) Grunt contrib to clean folders and files
* [https://www.npmjs.org/package/grunt-contrib-concat](grunt-contrib-concat) Grunt contrib to concatenate files
* [https://www.npmjs.org/package/grunt-contrib-htmlmin](grunt-contrib-htmlmin) Grunt contrib to minify html files
* [https://www.npmjs.org/package/grunt-contrib-watch](grunt-contrib-watch) Grunt contrib to catch changes in your code so execute other tasks
* [https://www.npmjs.org/package/grunt-contrib-uglify](grunt-contrib-uglify) Grunt contrib for js minification and obfuscation
* [https://www.npmjs.org/package/grunt-contrib-cssmin](grunt-contrib-cssmin) Grunt contrib to minify css files
* [https://www.npmjs.org/package/grunt-contrib-yuidoc](grunt-contrib-yuidoc) Grunt contrib to generate doc from comments in your code.
* [https://www.npmjs.org/package/grunt-text-replace](grunt-text-replace) Grunt contrib to replace patterns in your code.

Versions
=========

**v 0.1.0 - 2014/06/10**

* Add new defined pattern {app.rid} used for loading files without browser cash problems.
* {app.rid} is replaced by "?rid=RANDOM_INT"

**v 0.0.52 - 2014/05/28**

* Setup GitHub repositories

**v 0.0.51 - 2014/05/28**

* Now you can use not minified files, 4 more generated files.
* Generated files name now depend on the project name and version.
* Using the predefined patterns to get files name. Replacements set good name for you in your index.html file for exemple.
* Refactor README.md

**v 0.0.50 - 2014/05/26**

* Minor fixs.

**v 0.0.49 - 2014/05/26**

* Fix : each release type make a patch ... now we can use patch / minor / major / overwrite.

**v 0.0.48 - 2014/05/26**

* Replace `Appasdream.json` file by `AppConf.js` because config isn't really in json format, now we can exploit advantages of Grunt contribs.
* Now you must configure files located in your `app` folder : see AppConf.js part for details (no more concat order issues).
* Replacements are now to configure in `AppConf.js` file : see AppConf.js part for details
* Replacements patterns are made at the end of `./_www` build and see in all files (not just html files as previously)

**v 0.0.47 - 2014/05/19**

* Fix download error.

**v 0.0.46 - 2014/05/19**

* Manage libraries download in `Gruntfile.js` and not with `appasdream update webapp` command.
* Now use `grunt update_libraries` to manage libraries.
* Install new package `download`.
* Refactor grunt logs, an error now stop tasks.

**v 0.0.45 - 2014/05/17**

* Fix error when replacements isn't configured in `Appasdream.json` file.
* Now `grunt watch_task` also check `Appasdream.json` file.

**v 0.0.44 - 2014/05/16**

* Refactor `Gruntfile.js` file.
* Grunt task for replacements in all html files need to be configured in `Appasdream.json`.

        {
            ...
            "replacements": [
                { "from": "{app.title}", "to": "MY APP !!!" }
            ]
        }

**v 0.0.43 - 2014/05/15**

* Change `Appasdream.json` structure and `.libraries` resulting content

**v 0.0.42 - 2014/05/15**

* Add `grunt release_overwrite` command.

**v 0.0.41 - 2014/05/14**

* Add release grunt commands who up version and generate tar.gz files.
