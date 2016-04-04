'use strict';
var learnjs = {};

learnjs.problems = [
  {
    description: "What is truth?",
    code: "function problem() { return __; }"
  },
  {
    description: "What is a real variable declaration?",
    code: "(1)var one = function(){}; or (2) variable two = 2;"
  },
  {
    description: "What's the output of the following expression? \n",

    code: "var names = [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\"," +
             "\"Thursday\", \"Friday\", \"Saturday\"];\n" +
    "exports.name = function(number) {\n" +
    "\t return names[number];\n" +
    "};\n" +
    "exports.number = function(name) {\n" +
    "\t return names.indexOf(name);\n" +
    "};\n" +
    "console.log(exports.name(exports.number(exports.name(3))+1));"
    // Thursday
  },
  {
    description: "Simple Math",
    code: "function problem() { return 42 === 6 * __; }"
  }
];
// variable assignment, routes as a function, handles the different views
learnjs.showView = function(hash) {
    var routes = {
    '#problem': learnjs.problemView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    if (viewFn) {
    $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}
// adds new views for a different problem number using templates
learnjs.problemView = function(problemNumber) {
    var view = $('.templates .problem-view').clone();
    view.find('.title').empty().text('Problem #' + problemNumber);
    return view;
}
// loads the page and initiates the showView function
learnjs.appOnReady = function(){
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);

}

learnjs.applyObject = function(obj, elem) {
for (var key in obj) {
elem.find('[data-name="' + key + '"]').text(obj[key]);
}
};

learnjs.problemView = function(data) {
var problemNumber = parseInt(data, 10);
var view = $('.templates .problem-view').clone();
view.find('.title').text('Problem #' + problemNumber);
learnjs.applyObject(learnjs.problems[problemNumber - 1], view);
return view;
}