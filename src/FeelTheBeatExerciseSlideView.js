define(function(require){
  var Marionette = require('marionette');
  var FeelTheBeatExerciseView = require('feelTheBeat/FeelTheBeatExerciseView');

  var FeelTheBeatExerciseSlideView = Marionette.Layout.extend({
    template: function(){return '<div class="exercise-region"></div>';},
    attributes: {
      class: 'exercise-slide'
    },
    submissionType: 'automatic',
    regions: {
      exercise: '.exercise-region'
    },
    initialize: function(options){
      this.options = options;
    },
    onRender: function(){
      this.submission = this.model.get('submission');
      this.exerciseView = new FeelTheBeatExerciseView(_.extend({
        model: this.model
      }, this.options.exerciseOptions));
      this.exercise.show(this.exerciseView);

      // Wire exercise events.
      this.listenTo(this.exerciseView, 'submission:start', function(){
        this.submission.set('state', 'submitting');
      }, this)

      this.listenTo(this.exerciseView, 'submission:end', function(evaluatedSubmission){
        this.submission.set({
          data: evaluatedSubmission,
          result: evaluatedSubmission.result
        });
        this.submission.set('state', 'completed');
      }, this)

    }
  });

  return FeelTheBeatExerciseSlideView;
});
