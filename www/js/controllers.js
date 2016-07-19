(function(){
  "use strict";
angular.module('starter.controllers', ['ionMDRipple'])

.directive('dynamicElement', ['$compile', function ($compile) {
      return { 
        restrict: 'E',
        scope: {
            message: "="
        },
        replace: true,
        link: function(scope, element, attrs) {
            var template = $compile(scope.message)(scope);
            element.replaceWith(template);               
        },
        controller: function($scope) {
           $scope.assignId = function(item){

                $scope.$parent.qid = item.currentTarget.getAttribute("data-id");
                
                console.log(item.currentTarget.getAttribute("data-id"));
           };

           $scope.selectChange = function(item){

              $scope.$parent.qid = item;
           };
        }
      }
  }])

.directive('pressEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.pressEnter);
                });
                event.preventDefault();
            }
        });
    };
})

.controller('SurveyCtrl', function($scope, $state, $stateParams, $sce, localStorageService, config, $ionicHistory, $rootScope, $ionicLoading, $ionicPopup, $filter) {

    $scope.nxt =  config.text_next;
    $scope.prev = config.text_prev;
    $scope.stop = config.text_stop;
    //console.log(AllAnswers);
    //var QuestData = SurveyQuest.all();
    var QuestData = localStorageService.get('QuestData');
    console.log(QuestData);
    if($state.params.qid == ''){

        var questionOrder = 1;
        window.AllAnswers = {};
        window.SurveyLists = {};
    }else{

        var questionOrder = $state.params.qid;
    }
    //console.log(QuestData.data[paramQid]);
    //console.log(QuestData);
    //console.log(QuestData.data.length);
    var paramQid;
    var QuestionID;
    var QuestionKey;
    var validation;
    var pattern;
    var matchWith;
    angular.forEach(QuestData.data, function(value, key) {
        if(value.question_order == questionOrder){

            paramQid = key;
            QuestionID = value.question_id;
            QuestionKey = value.question_key;
            validation = value.validations;
            pattern = value.pattern;
            matchWith = value.match_with;
        }
        //console.log(value.question_order+' '+key);
    });
    console.log(paramQid);
    console.log(QuestData.data);
    //console.log(AllAnswers);
    var types;
    switch(QuestData.data[paramQid].question_type){

        case'radio':
        var radioLength = QuestData.data[paramQid].answers.length;
        types = 'radio';
        var finalAnswers = '';
        for(var i = 0; i < radioLength; i++){

            finalAnswers+= '<label><input type="radio" ion-ripple ng-click="assignId($event)" class="radio_answer" name="<radio_answer></radio_answer>"  data-id="'+QuestData.data[paramQid].answers[i].option_next+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;
        
        case'select':
        var selectLength = QuestData.data[paramQid].answers.length;
        //console.log(selectLength);
        types = 'select';
        var finalAnswers = '<select ng-change="selectChange('+QuestData.data[paramQid].answers[1].option_next+')" ng-model="product" class="select_answer">';
        for(var i = 1; i<selectLength; i++){
            
            finalAnswers+= '<option value="'+QuestData.data[paramQid].answers[i].option_value+'">'+QuestData.data[paramQid].answers[i].option_text+'</option>';
        }
        finalAnswers+='</select>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'text':
        types = 'text';
        finalAnswers = '<input type="text" name="" ng-model="text_answer" class="text_answer" value="" ng-click="assignId($event)" style="border:1px solid #000;" data-id="'+QuestData.data[paramQid].answers[0].option_next+'" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'number':
        types = 'number';
        finalAnswers = '<input type="text" name="" class="number_answer" value="" ng-click="assignId($event)" data-id="'+QuestData.data[paramQid].answers[0].option_next+'" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'textarea':
        types = 'textarea';
        finalAnswers = '<textarea style="border: 1px solid #000;" class="textare_answer" ng-click="assignId($event)" data-id="'+QuestData.data[paramQid].answers[0].option_next+'"></textarea>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'hh_profile':
        finalAnswers = '<textarea style="border: 1px solid #000;"></textarea>';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'message':
        types = 'message';
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        
        var data = QuestData.data[paramQid].question_desc;
        
        //var words = data.match(/[^\[\]]+(?=])/g);
        var words = data.match(/[\w]+(?=])/g);
        //var words = data.replace(/\[(.+?)\]]/g,'test');
        console.log(words);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'checkbox':
        var checkboxLength = QuestData.data[paramQid].answers.length;
        
        var finalAnswers = '';
        for(var i = 0; i < checkboxLength; i++){

            finalAnswers+= '<label><input type="checkbox" name="'+QuestData.data[paramQid].question_id+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'hh_person':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'hh_children':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;

        case'number_number':
        finalAnswers = '<input type="text" name="" value="" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
        $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
        break;
    }

    $scope.next = function(qid){
    
        if($scope.$$childHead.qid === undefined){

            $ionicLoading.show({ template: config.text_select_answer, noBackdrop: true, duration: 2000 });
            
        }else{

            $(function(){
            
                switch(types){

                    case'radio':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key']=QuestionKey; 
                      OneAnswer['answer'] = $('.radio_answer:checked').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      //localStorageService.set('answer',$('.radio_answer:checked').val());
                      console.log(AllAnswers);
                    break;

                    case'select':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key']=QuestionKey; 
                      OneAnswer['answer'] = $('.select_answer').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'text':
                      if($scope.$$childHead.$$childHead.text_answer !== undefined){

                          var textValue = $scope.$$childHead.$$childHead.text_answer;
                          console.log(textValue);
                          
                          if(validation != '' && validation == 'pattern'){
                            
                              if(textValue.match(pattern)){
                                  if(matchWith!=''){

                                      var matchedQids = matchWith.match(/[^\[\]]+(?=])/g);
                                      if(AllAnswers[matchedQids[0]].answer == textValue){

                                          console.log('after match pattern');
                                          var OneAnswer = {};
                                          OneAnswer['question_id'] = QuestionID;
                                          OneAnswer['question_key'] = QuestionKey;
                                          OneAnswer['answer'] = $scope.$$childHead.$$childHead.text_answer;
                                          AllAnswers[QuestionID] = OneAnswer;
                                          console.log(AllAnswers);
                                      }else{

                                          $ionicLoading.show({ template: 'Latitude Not matched!', noBackdrop: true, duration: 2000 });
                                          return false;
                                      }
                                  }else{

                                      console.log('after match pattern');
                                      var OneAnswer = {};
                                      OneAnswer['question_id'] = QuestionID;
                                      OneAnswer['question_key'] = QuestionKey;
                                      OneAnswer['answer'] = $scope.$$childHead.$$childHead.text_answer;
                                      AllAnswers[QuestionID] = OneAnswer;
                                      console.log(AllAnswers);
                                  }

                              }else{

                                  $ionicLoading.show({ template: 'Please enter correct value', noBackdrop: true, duration: 2000 });
                                  return false;
                              }
                          }else{

                              var OneAnswer = {};
                              OneAnswer['question_id'] = QuestionID;
                              OneAnswer['question_key'] = QuestionKey;
                              OneAnswer['answer'] = $('.text_answer').val();
                              AllAnswers[QuestionID] = OneAnswer;
                              console.log(AllAnswers);
                          }
                      }else{

                          $ionicLoading.show({ template: 'Please enter the value', noBackdrop: true, duration: 2000 });
                          return false;
                      }
                    break;

                    case'number':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      OneAnswer['answer'] = $('.number_answer').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'textarea':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      OneAnswer['answer'] = $('.textare_answer').val();
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);
                    break;

                    case'message':
                      var OneAnswer = {};
                      OneAnswer['question_id'] = QuestionID;
                      OneAnswer['question_key'] = QuestionKey;
                      OneAnswer['answer'] = 'Text Message'
                      AllAnswers[QuestionID] = OneAnswer;
                      console.log(AllAnswers);

                }

                $state.go('survey',{'qid':$scope.$$childHead.qid});
            });
        }
    };

    $scope.GoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.GoDashboard = function(){

        var confirmPopup = $ionicPopup.confirm({
           title: config.text_stop_survey_title,
           template: config.text_stop_survey_template,
           cancelText: config.text_survey_no,
           okText: config.text_survey_yes
         });

         confirmPopup.then(function(res) {
           if(res) {
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                if(typeof localStorageService.get('suerveyLists') !== 'undefined' && localStorageService.get('suerveyLists') != null){

                    var OldServeyList = localStorageService.get('suerveyLists');
                    var OldSurveyKeyLists = Object.keys(localStorageService.get('suerveyLists'));
                    if(OldSurveyKeyLists.length>0){
                        
                        angular.forEach(OldSurveyKeyLists, function(value, key) {

                            SurveyLists[value] = OldServeyList[value];
                        })
                    }
                }
                var timeStamp = $filter('date')(new Date(), 'dd-MM-yyyy-HH:mm:ss');
                SurveyLists[timeStamp] = {'answer':AllAnswers,'lastQid': $state.params.qid};
                localStorageService.set('suerveyLists',SurveyLists);
                $state.go('dashboard');
           } else {
             return true;
           }
         });
    }

})
.controller('HomeCtrl', function($scope, $state, config, $ionicHistory, localStorageService){

    $scope.start_survey = config.text_startSuray;
    $scope.dashboard = config.text_dashboard;
    $scope.survey_list = config.text_surveyList;
    $scope.logout = config.text_logout;

    $scope.goSurveyList = function(){

        $state.go('survey-list');
    }
   
    console.log(localStorageService.get('suerveyLists'));

    $scope.goDash = function(){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('survey');
    }
})

.controller('ServeyListCtrl', function($scope, $state, config, $ionicHistory, localStorageService){

      $scope.dashboard = config.text_survel_list;
      $scope.items = localStorageService.get('suerveyLists');
      $scope.listCanSwipe = true;
      var serveyLists = localStorageService.get('suerveyLists');
      $scope.StartSurvey = function(SurveyDate){

          var storedSurveys = localStorageService.get('suerveyLists');
          angular.forEach(storedSurveys, function(value, key){

              if(key == SurveyDate){

                  window.AllAnswers = {};
                  window.SurveyLists = {};
                  AllAnswers = value.answer;
                  delete storedSurveys[key];
                  localStorageService.set('suerveyLists',storedSurveys);
                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });
                  $state.go('survey',{'qid':value.lastQid});
              }
          })
      }

      $scope.goDash = function(){

          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('dashboard');
      }
})

.controller('LoginCtrl', function($scope, $http, $ionicLoading, localStorageService, Users, $state, $window, config, $ionicHistory) {

    $scope.login_now = config.text_login;

    $scope.user_login = config.text_userLogin;

    $scope.activate_application = config.text_activation;

    if(localStorageService.get('userId') != null){
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('dashboard');
        //console.log(localStorageService.get('userId'));
    }
  
    $scope.clearData = function(){

        localStorageService.clearAll();
        $ionicLoading.show({ template: config.text_activate_success, noBackdrop: true, duration: 2000 });
        $window.location.reload();
    }
    $scope.login = function(username, password){

        var users = Users.all();
        if(angular.isUndefined(username) || angular.isUndefined(password)){
            $ionicLoading.show({ template: config.text_fill_error, noBackdrop: true, duration: 2000 });
            return false;
        }
        for(var i = 0; i < users.length; i++){

              if(users[i].username == username && users[i].password == password){
                  
                  localStorageService.set('userId',users[i].username);
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.transitionTo('dashboard');
                  return true;
              }
          }
        $ionicLoading.show({ template: config.text_wrong_user, noBackdrop: true, duration: 2000 });
    }

})

.controller('LogoutCtrl', function($scope, $state, $ionicLoading, localStorageService, $location, config, $ionicHistory, $ionicPopup){

    $scope.logout = function(){
          //console.log($state.current.name);
          if($state.current.name == 'survey'){

              var alertPopup = $ionicPopup.alert({
               title: 'Unable to logout',
               template: 'Unable to logout while survey is running!'
             });

          }else{

              localStorageService.clearAll();
              $ionicHistory.nextViewOptions({
                        disableBack: true
                      });
              $state.go("login");
              $ionicLoading.show({ template: config.text_signout_success, noBackdrop: true, duration: 2000 });
          }
    }
          
})


}());