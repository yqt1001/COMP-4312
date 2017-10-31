import { Meteor } from 'meteor/meteor';
import storage from '../imports/api/storage';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish("storage", function () {
    return storage.find();
  });
});
