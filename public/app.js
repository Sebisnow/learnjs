'use strict';

var learnjs = {
    poolId: 'eu-west-1:7869f4d0-7afc-4de8-98cb-4c4ffa927c47'
};

learnjs.problems = [
  {
    description: "What is truth, or rather the answer to all questions?",
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
    '#landing': learnjs.landingView,
    '': learnjs.landingView,
    '#profile': learnjs.profileView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    if (viewFn) {
    learnjs.triggerEvent('removingView', []);
    $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}
// Adds new views for a different problem number using templates.
learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var view = learnjs.template('problem-view');
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    // Helper function that checks the answer by collecting and validating the input.
    function checkAnswer() {
        var answer = view.find('.answer').val();
        // var test = problemData.code.replace('__', answer) + '; problem();';

        //return problemData.answer.contains(answer);
        return problemData.answer.indexOf(answer) >= 0 ? true : false;
    }
    // checks the correctness of the answer by calling checkAnswer.
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

// This small part assembles the user feedback and distinguishes between the correct and incorrect answer.
learnjs.buildCorrectFlash = function (problemNum, answer) {
    if (answer) {
        var correctFlash = learnjs.template('correct-flash');
    } else {
        var correctFlash = learnjs.template('incorrect-flash');
    }
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
        /** Alternative from book removes button again:
        var buttonItem = learnjs.template('skip-btn');
        buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
        $('.nav-list').append(buttonItem);
        view.bind('removingView', function() {
            buttonItem.remove();
        });
        **/

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
learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
}

// Fades out the old content of the element and sets a new one giving visual feed back.
learnjs.flashElement = function(elem, content) {
    elem.fadeOut('fast', function() {
        elem.html(content);
        elem.fadeIn();
    });
}
// manages the identity in the app.
learnjs.identity = new $.Deferred();

// Loads the page and initiates the showView function. This is the change listener so to speak.
learnjs.appOnReady = function(){
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
    learnjs.identity.done(learnjs.addProfileLink);

}

learnjs.applyObject = function(obj, elem) {
    for (var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
}
// joins requests when they are complete and updates AWS credentials.
learnjs.awsRefresh = function() {
  var deferred = new $.Deferred();
  AWS.config.credentials.refresh(function(err) {
    if (err) {
      deferred.reject(err);
      console.log('Before the Error' + err);
    } else {
      deferred.resolve(AWS.config.credentials.identityId);
      console.log('Before the AWSrefresh' + AWS.config.credentials.identityId);
    }
  });
  return deferred.promise();
}

// show the user his profile information.
learnjs.profileView = function() {
  var view = learnjs.template('profile-view');
  learnjs.identity.done(function(identity) {
    view.find('.email').text(identity.email);
  });
  return view;
}
// adds the profile link to the view.
learnjs.addProfileLink = function(profile) {
  var link = learnjs.template('profile-link');
  link.find('a').text(profile.email);
  $('.signin-bar').prepend(link);
}

// callback function of google sign-in.
function googleSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  AWS.config.update({
    region: 'eu-east-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: learnjs.poolId,
      Logins: {
        'accounts.google.com': id_token
      }
    })
  })
  console.log(AWS.config);
  console.log(arguments);
  function refresh() {
  console.log('Before the Refresh');
    return gapi.auth2.getAuthInstance().signIn({
        prompt: 'login'
      }).then(function(userUpdate) {
      console.log('Before the refresh');
      var creds = AWS.config.credentials;
      var newToken = userUpdate.getAuthResponse().id_token;
      creds.params.Logins['accounts.google.com'] = newToken;
      console.log('Before the refresh');
      return learnjs.awsRefresh();
    });
  }
  learnjs.awsRefresh().then(function(id) {
    console.log('Adding mail' + id);
    learnjs.identity.resolve({
      id: id,
      email: googleUser.getBasicProfile().getEmail(),
      refresh: refresh
    });
  });
}
