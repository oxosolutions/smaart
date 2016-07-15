(function(){
  "use strict";
angular.module('starter.controllers', [])

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
        }
      }
  }])

.controller('DashCtrl', function($scope, $state, $stateParams, $sce, localStorageService) {

    //var QuestData = SurveyQuest.all();
    var QuestData = localStorageService.get('QuestData');
    console.log(QuestData);
    if($state.params.qid == ''){

        var questionOrder = 1;
    }else{

        var questionOrder = $state.params.qid;
    }
    //console.log(QuestData.data[paramQid]);
    //console.log(QuestData);
    //console.log(QuestData.data.length);
    var paramQid;

    angular.forEach(QuestData.data, function(value, key) {
        if(value.question_order == questionOrder){

            paramQid = key;
        }
        //console.log(value.question_order+' '+key);
    });
    console.log(paramQid);
    console.log(QuestData.data);
    $scope.question = $sce.trustAsHtml(QuestData.data[paramQid].question_text);
    $scope.description = $sce.trustAsHtml(QuestData.data[paramQid].question_desc);
    switch(QuestData.data[paramQid].question_type){

        case'radio':
        var radioLength = QuestData.data[paramQid].answers.length;
        
        var finalAnswers = '';
        for(var i = 0; i < radioLength; i++){

            finalAnswers+= '<label><input type="radio" ng-click="assignId($event)"  data-id="'+QuestData.data[paramQid].answers[i].option_next+'" name="'+QuestData.data[paramQid].question_id+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        $scope.htmlString = finalAnswers;
        break;
        
        case'select':
        var selectLength = QuestData.data[paramQid].answers.length;
        
        var finalAnswers = '<select>';
        for(var i = 0; i < selectLength; i++){

            finalAnswers+= '<option value="'+QuestData.data[paramQid].answers[i].option_value+'">'+QuestData.data[paramQid].answers[i].option_text+'</option>';
        }
        finalAnswers+='</select>';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        break;

        case'text':
        
        finalAnswers = '<input type="text" name="" value="" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        //$scope.qid = parseInt(paramQid)+1;
        break;

        case'number':
        finalAnswers = '<input type="text" name="" value="" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        //$scope.qid = parseInt(paramQid)+1;
        break;

        case'textarea':
        finalAnswers = '<textarea style="border: 1px solid #000;"></textarea>';
        $scope.htmlString = finalAnswers;
       /* $scope.ans = $sce.trustAsHtml(finalAnswers);
        $scope.qid = parseInt(paramQid)+1;*/
        break;

        case'hh_profile':
        finalAnswers = '<textarea style="border: 1px solid #000;"></textarea>';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        //$scope.qid = parseInt(paramQid)+1;
        break;

        case'message':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
       /* $scope.ans = $sce.trustAsHtml(finalAnswers);*/
        
        break;

        case'checkbox':
        var checkboxLength = QuestData.data[paramQid].answers.length;
        
        var finalAnswers = '';
        for(var i = 0; i < checkboxLength; i++){

            finalAnswers+= '<label><input type="checkbox" name="'+QuestData.data[paramQid].question_id+'" value="'+QuestData.data[paramQid].answers[i].option_value+'" /> '+QuestData.data[paramQid].answers[i].option_text+'</label>';
        }
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        break;

        case'hh_person':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        break;

        case'hh_children':
        finalAnswers = '';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        break;

        case'number_number':
        finalAnswers = '<input type="text" name="" value="" style="border:1px solid #000;" />';
        $scope.htmlString = finalAnswers;
        //$scope.ans = $sce.trustAsHtml(finalAnswers);
        break;
    }

    $scope.next = function(qid){
        
        $state.go('tab.dash',{'qid':$scope.$$childHead.qid});
    }



})
.controller('LoginCtrl', function($scope, $http, $ionicLoading, localStorageService, Users, $state, $window) {

    if(localStorageService.get('userId') != null){

        $state.go('tab.dash');
        //console.log(localStorageService.get('userId'));
    }
  
    $scope.clearData = function(){

        localStorageService.clearAll();
        $ionicLoading.show({ template: 'Activated successfully!', noBackdrop: true, duration: 2000 });
        $window.location.reload();
    }

    $scope.login = function(username, password){

        var users = Users.all();
        if(angular.isUndefined(username) || angular.isUndefined(password)){
            $ionicLoading.show({ template: 'Please fill all fields', noBackdrop: true, duration: 2000 });
            return false;
        }
        for(var i = 0; i < users.length; i++){

              if(users[i].username == username && users[i].password == password){
                  
                  localStorageService.set('userId',users[i].username);
                  $state.go('tab.dash');
                  return true;
              }
          }
        $ionicLoading.show({ template: 'Wrong user details!', noBackdrop: true, duration: 2000 });
    }

})

.controller('LogoutCtrl', function($scope, $state, $ionicLoading, localStorageService, $location){

      $scope.logout = function(){

          localStorageService.clearAll();
          $state.go("login");
          $ionicLoading.show({ template: 'Sign out successfully', noBackdrop: true, duration: 2000 });
      }
})


}());