'use strict';
angular.module('timelineModule')
  .service('onlineUsersService', function($interval, 
      defaultLoadUsersTimeout, 
      messageService, 
      meanBookApi) {
    var loadUsersTimer = null;
    var entity = {
      users: []
    };

    function load() {
      meanBookApi.listUsers().then(function(response) {
        entity.users = response.data.users;
      }, messageService.errorHandling);
    }
    function startPulling(loadUsersNow) {
      if (!loadUsersNow)
        loadUsersNow = true;
      if (loadUsersNow)
        load();
      loadUsersTimer = $interval(load, defaultLoadUsersTimeout);
    }
    function stopPulling() {
      if (loadUsersTimer) {
        $interval.cancel(loadUsersTimer);
      }
    }

    return {
      entity: entity,
      load: load,
      startPulling: startPulling,
      stopPulling: stopPulling
    };
  });
