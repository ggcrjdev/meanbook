define(['app.utils'], function(appUtils) {
  describe('utils', function() {
    it('should format date 2000-01-01T00:00:00 correctly', function() {
      var timestamp = new Date(2000, 0, 1, 0, 0, 0, 0).getTime();
      expect(appUtils.formatTimestamp(timestamp, 'date')).toBe('2000-01-01');
      expect(appUtils.formatTimestamp(timestamp, 'timestamp')).toBe('2000-01-01 00:00:00');
      expect(appUtils.formatTimestamp(timestamp)).toBe('2000-01-01 00:00:00');
    });
  });
});
