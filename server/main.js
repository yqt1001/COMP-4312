import { Meteor } from 'meteor/meteor';
import storage from '../imports/api/storage';
import directory from '../imports/api/directory';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish("storage", function () {
    return storage.find();
  });
  Meteor.publish("directories", function () {
    return directory.find();
  });
});
