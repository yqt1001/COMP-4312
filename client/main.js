import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import storage from '../imports/api/storage';
import directory from '../imports/api/directory';

import './main.html';

Meteor.subscribe("storage");

var directoryId = 0;

Template.home.helpers({
  files: function () {
    return storage.find({
      'metadata.owner': Meteor.userId(),
      'metadata.directory': directoryId,
    });
  },

  formattedSize: function(whatSize){
    return (whatSize/1048576).toFixed(3);
  },

  // loads all subdirectories for loaded directory (0 is root for user)
  directories: function() {
    return directory.find({
      owner: Meteor.userId(),
      parent: directoryId,
    }).fetch();
  },

  // creates a new directory
  newDirectory: function() {
    directory.insert({
      owner: Meteor.userId(),
      parent: directoryId,
    });
  },

  // deletes a directory (should be done from a parent directory like how file deletion is done, also must be in an event)
  deleteDirectory: function() {
    directory.remove({ _id: this._id });
  },

  // go to parent directory (must be moved to an event, but doesnt require a 'this' call)
  goToParentDirectory: function() {
    directoryId = directory.find({ _id: directoryId }).fetchOne().parent;
  },

  // go to clicked directory (must be moved to an event)
  goToDirectory: function() {
    directoryId = this._id;
  }
});

Template.home.events({
  'click #deleteFileButton ': function (event) {
    console.log("deleteFile button ", this);
    storage.remove({_id:this._id});

  },
  'click #newDirButton': function (event) {
  	console.log("new folder!");
  	directory.insert({
      owner: Meteor.userId(),
      parent: directoryId,
    });
  }
});

Template.sidebar.events({
  'change .your-upload-class': function(event, template) {
    if (!Meteor.userId()) {
      sAlert.error('Please register', {timeout: 'none', position: 'top-left'});
      return;
    }

    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      var file = new FS.File(files[i]);
      file.metadata = {
        owner: Meteor.userId(),
        directory: directoryId,
      };
      storage.insert(file, function (err, fileObj) {
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