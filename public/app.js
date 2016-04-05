'use strict';

var learnjs = {};

learnjs.problems = [
  {
    description: "What is truth?",
    code: "function problem() { return __; }",
    answer: ["42", "true"]
  },
  {
    description: "What is a correct variable declaration?",
    code: "__ problem = function(){console.log('Hello World!')};\n",
    answer: ["var", "true"]
  },
  {
    description: "What's needed for it to evaluate to true? \n",

    code: "var names = [\"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\"," +
             "\"Thursday\", \"Friday\", \"Saturday\"];\n" +
    "exports.name = function(number) {\n" +
    "\t return names[number];\n" +
    "};\n" +
    "exports.number = function(name) {\n" +
    "\t return names.indexOf(name);\n" +
    "};\n" +
    "exports.name(exports.number(exports.name(3))+1) == __;\n",
    answer: ["Thursday", "true"]
  },
  {
    description: "Simple Math",
    code: "function problem() { return 42 === 6 * __; }",
    answer: ["7", "true"]
  }
];
// Show the landing-view.
learnjs.landingView = function() {
    return learnjs.template('landing-view');
}

// Variable assignment, routes as a function, handles the different views.
learnjs.showView = function(hash) {
    var routes = {
    '#problem': learnjs.problemView,
    '': learnjs.landingView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    if (viewFn) {
    $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}
// Adds new views for a different problem number using templates.
learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var view = learnjs.template('problem-view');
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        // var test = problemData.code.replace('__', answer) + '; problem();';

        //return problemData.answer.contains(answer);
        return problemData.answer.indexOf(answer) >= 0 ? true : false;
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
            learnjs.flashElement(resultFlash, learnjs.buildCorrectFlash(problemNumber, true));
        } else {
            learnjs.flashElement(resultFlash, learnjs.buildCorrectFlash(problemNumber, false));
        }
        return false;
    }
    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
}

learnjs.buildCorrectFlash = function (problemNum, answer) {
    if (answer) {
        var correctFlash = learnjs.template('correct-flash');
    } else {
        var correctFlash = learnjs.template('incorrect-flash');
    }
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    } else {
        link.attr('href', '');
        link.text("Yaaayy! You're finished! Good job!");
    }
    return correctFlash;
}

// Returns a copy of the named template to work with.
learnjs.template = function(name) {
    return $('.templates .' + name).clone();
}

// Fades out the old content of the element and sets a new one giving visual feed back.
learnjs.flashElement = function(elem, content) {
    elem.fadeOut('fast', function() {
        elem.html(content);
        elem.fadeIn();
    });
}

// Loads the page and initiates the showView function.
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
