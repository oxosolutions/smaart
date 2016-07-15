angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Users', function($http, $ionicLoading, localStorageService){

    //console.log(isOnline());
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    if(localStorageService.get('userDetails') == null){

        $http.get('http://174.129.11.69/haiti/api/?action=activate&apikey=CAX4RYDJBUKM8BSYQEZP').then(function(res){

            localStorageService.set('userDetails', res);
            window.response = res;
            $ionicLoading.hide();
        });
        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=1').then(function(res){

            localStorageService.set('QuestData', res);
            window.response = res;
            $ionicLoading.hide();
        });
    }else{

        $ionicLoading.hide();
    }
    return {
      all: function(){
          if(localStorageService.get('userDetails') != null){

              var userdata = localStorageService.get('userDetails');
              var totalUsers = userdata.data.users.length;
              var users = userdata.data.users;
              return users;

          }else{

              var userdata = window.response;
              var totalUsers = userdata.data.users.length;
              var users = userdata.data.users;
              return users;
          }          
      },
    };
});

/*.factory('SurveyQuest', function($http, $ionicLoading, localStorageService){

    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
    if(localStorageService.get('QuestData') == null){

        $http.get('http://174.129.11.69/haiti/api/?action=import&apikey=CAX4RYDJBUKM8BSYQEZP&id=1').then(function(res){

            localStorageService.set('QuestData', res);
            window.response = res;
            $ionicLoading.hide();
        });
    }else{

        $ionicLoading.hide();
    }

    return {

        all: function(){
            if(localStorageService.get('QuestData')!=null){

                var questData = localStorageService.get('QuestData');
                //var users = userdata.data.users;
                return questData;
            }else{

                var questData = window.response;
                return questData;
            }
        }
    }
});*/
