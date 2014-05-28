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