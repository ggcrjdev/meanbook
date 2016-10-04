'use strict';
define(['angular'], function(angular) {
  return function($timeout, defaultLoadUsersTimeout) {
    var clearMessagesTimer = null;
    var entity = {
      messages: [],
      clear: function() {
        this.messages = [];
      }
    };

    function addMessage(message, type, code) {
      if (!type)
        type = 'info';
      if (type !== 'error')
        code = null;

      var messageData = {
        type: type,
        text: message,
        code: code
      };
      entity.messages.push(messageData);
      if (clearMessagesTimer)
        $timeout.cancel(clearMessagesTimer);
      clearMessagesTimer = $timeout(clearMessages, defaultLoadUsersTimeout);
    }
    function addErrorMessage(message, code) {
      addMessage(message, 'error', code);
    }
    function addWarnMessage(message) {
      addMessage(message, 'warn');
    }
    function addInfoMessage(message) {
      addMessage(message, 'info');
    }
    function clearMessages() {
      entity.clear();
    }

    function errorHandling(response) {
      if (response.data && response.data.type === 'error')
        addErrorMessage(response.data.detail, response.data.code);
    }

    return {
      entity: entity,
      clearMessages: clearMessages,
      addErrorMessage: addErrorMessage,
      addWarnMessage: addWarnMessage,
      addInfoMessage: addInfoMessage,
      errorHandling: errorHandling
    };
  };
});
