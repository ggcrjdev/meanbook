"use strict";
define(['app.utils'], function(appUtils) {
  describe('app.utils.formatTimestamp', function() {
    var timestampDate;
    var isoStringDate;

    beforeAll(function() {
      timestampDate = new Date(Date.UTC(2000, 0, 1, 13, 0, 0, 0)).getTime();
      isoStringDate = '2000-01-01T13:00:00.000';
    });

    it('should formats the timestamp value representing "2000-01-01T13:00:00.000(UTC)" to datetime string format', function() {
      expect(appUtils.formatTimestamp(timestampDate)).toEqual('2000-01-01 13:00:00');
      expect(appUtils.formatTimestamp(timestampDate, 'datetime')).toEqual('2000-01-01 13:00:00');
    });
    it('should formats the timestamp value representing "2000-01-01T13:00:00.000" to date string format', function() {
      expect(appUtils.formatTimestamp(timestampDate, 'date')).toEqual('2000-01-01');
    });
    it('should formats the ISO String "2000-01-01T13:00:00.000(UTC)" to datetime string format in UTC timezone', function() {
      expect(appUtils.formatTimestamp(isoStringDate)).toEqual('2000-01-01 13:00:00');
      expect(appUtils.formatTimestamp(isoStringDate, 'datetime')).toEqual('2000-01-01 13:00:00');
    });
    it('should throws Error when the style is not supported like "datetimeinverted"', function() {
      var fut = function() {
        appUtils.formatTimestamp(timestampDate, 'datetimeinverted');
      };
      expect(fut).toThrow();
    });
  });

  describe('app.utils.formatLocalDate', function() {
    var timestampDate;
    var isoStringDate;

    beforeAll(function() {
      timestampDate = new Date(Date.UTC(2000, 5, 1, 13, 0, 0, 0)).getTime();
      isoStringDate = '2000-06-01T13:00:00.000';
    });

    it('should formats the ISO string "2000-06-01T13:00:00.000(UTC)" to datetime string toISOString local date format', function() {
      expect(appUtils.formatLocalDate(isoStringDate)).toEqual('2000-06-01 13:00:00');
      expect(appUtils.formatLocalDate(isoStringDate, 'datetime')).toEqual('2000-06-01 13:00:00');
    });
    it('should formats the ISO string "2000-06-01T13:00:00.000" to date string in local date format', function() {
      expect(appUtils.formatLocalDate(isoStringDate, 'date')).toEqual('2000-06-01');
    });
    it('should formats the timestamp value representing "2000-06-01T13:00:00.000(UTC)" to datetime string toISOString local date format', function() {
      expect(appUtils.formatLocalDate(timestampDate)).toEqual('2000-06-01 13:00:00');
      expect(appUtils.formatLocalDate(timestampDate, 'datetime')).toEqual('2000-06-01 13:00:00');
    });
    it('should throws Error when the style is not supported like "datetimeinverted"', function() {
      var fut = function() {
        appUtils.formatLocalDate(isoStringDate, 'datetimeinverted');
      };
      expect(fut).toThrow();
    });
  });
});
