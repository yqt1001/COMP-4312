import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import storage from '../imports/api/storage';

import './main.html';

Meteor.subscribe("storage");

Template.home.helpers({
  files: function () {
    return storage.find();
  }
});

Template.home.events({
  'click #deleteFileButton ': function (event) {
    console.log("deleteFile button ", this);
    storage.remove({_id:this._id});

  },
});

Template.sidebar.events({
  'change .your-upload-class': function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      files[i].metadata = {foo: "bar"};
      storage.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if (err) {
          console.log('error! ' + JSON.stringify(err));
        } else {
          console.log('hurray!' + JSON.stringify(fileObj.original));

        }
      });
    }
  }
});