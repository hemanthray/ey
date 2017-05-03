myApp.controller('TargetsController',
  ['$scope', '$rootScope','$firebaseAuth', '$firebaseArray',
  function ($scope, $rootScope, $firebaseAuth, $firebaseArray) {

      var ref = firebase.database().ref();
      var auth = $firebaseAuth();

      auth.$onAuthStateChanged(function (authUser) {
          if (authUser) {
              var targetsRef = ref.child('users').child(authUser.uid).child('targets');
              var targetsInfo = $firebaseArray(targetsRef);

              $scope.targets = targetsInfo;

              targetsInfo.$loaded().then(function (data) {
                  $rootScope.howManyTargets = targetsInfo.length;
              }); // make sure meeting data is loaded

              targetsInfo.$watch(function (data) {
                  $rootScope.howManyTargets = targetsInfo.length;
              });

              $scope.addTarget = function () {
                  targetsInfo.$add({
                      name: $scope.targetname,
                      status: $scope.targetstatus,
                      description: $scope.description,
                      date: firebase.database.ServerValue.TIMESTAMP
                  }).then(function () {
                      $scope.targetname = '';
                      $scope.targetstatus = '';
                  }); //promise
              } //addMeeting

              $scope.deleteTarget = function (key) {
                  targetsInfo.$remove(key);
              } //deleteMeeting

              $scope.markActive = function (key) {
                  key.targetstatus = !key.targetstatus;
                  $scope.targetstatus.$save(key);

              } //update 
              $scope.updateTarget = function (key) {
                  targetsInfo.save({
                      name: $scope.targetname,
                      status: $scope.targetstatus,
                      description: $scope.description,
                      date: firebase.database.ServerValue.TIMESTAMP,
                      key: key
                  }).then(function () {
                      $scope.targetname = '';
                      $scope.targetstatus = '';
                  }); //promise
              } //addMeeting




          } //authUser
      }); //onAuthStateChanged
  }]); //myApp.controller
