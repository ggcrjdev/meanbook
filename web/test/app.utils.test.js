"use strict";
define(['app.utils'], function(appUtils) {
  describe('app.utils.formatTimestamp', function() {
    var scenarioDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0));
    var timestampToFormat = scenarioDate.getTime();
    it('should formats the timestamp value representing "2000-01-01T00:00:00.000(UTC)" to datetime string format', function() {
      expect(appUtils.formatTimestamp(timestampToFormat)).toEqual('2000-01-01 00:00:00');
      expect(appUtils.formatTimestamp(timestampToFormat, 'datetime')).toEqual('2000-01-01 00:00:00');
    });
    it('should formats the timestamp value representing "2000-01-01T00:00:00.000" to date string format', function() {
      expect(appUtils.formatTimestamp(timestampToFormat, 'date')).toEqual('2000-01-01');
    });
    it('should throws Error when the style is not supported like "datetimeinverted"', function() {
      expect(function() {appUtils.formatTimestamp(timestampToFormat, 'datetimeinverted')}).toThrow();
    });
  });
});
