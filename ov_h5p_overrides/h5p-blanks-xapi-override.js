H5P.Blanks.prototype.getxAPIDefinition = function () {
    var definition = {};
    definition.description = {
        'en-US': this.params.text
    };
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'fill-in';
    // XXX START
    //definition.correctResponsesPattern = ['{case_matters=' + this.params.behaviour.caseSensitive + '}'];
    // XXX END
    var firstCorrectResponse = true;
    // xAPI forces us to create solution patterns for all possible solution combinations
    for (var i = 0; i < this.params.questions.length; i++) {
        var question = this.handleBlanks(this.params.questions[i], function(solution) {
            // XXX START
            // This code could hang the browser in case there are many questions and each one has multiple correct answers
            /*
             // Store new patterns for each extra alternative answer
             var newPatterns = [];
             for (var j = 0; j < definition.correctResponsesPattern.length; j++) {
             if (!firstCorrectResponse) {
             definition.correctResponsesPattern[j] += '[,]';
             }
             var prefix = definition.correctResponsesPattern[j];
             for (var k = 0; k < solution.solutions.length; k++) {
             if (k === 0) {
             // This is the first possible answr, just add it to the pattern
             definition.correctResponsesPattern[j] += solution.solutions[k];
             }
             else {
             // This is an alternative possible answer, we need to create a new permutation
             newPatterns.push(prefix + solution.solutions[k]);
             }
             }
             }
             // Add any new permutations to the list of response patterns
             definition.correctResponsesPattern = definition.correctResponsesPattern.concat(newPatterns);

             firstCorrectResponse = false;
             */
            // XXX END

            // We replace the solutions in the question with a "blank"
            return '__________';
        });
        definition.description['en-US'] += question;
    }
    return definition;
};