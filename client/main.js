import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import storage from '../imports/api/storage';
import directory from '../imports/api/directory';

import './main.html';

Meteor.subscribe("storage");

Template.home.helpers({
  files: function () {
    return storage.find({
      'metadata.owner': Meteor.userId(),
      'metadata.directory': 0, // TODO: set the directory _id value once thats set up to be loaded in (should be 0 by default)
    });
  },

  formattedSize: function(whatSize){
    return (whatSize/1048576).toFixed(3);
  },

  // loads all subdirectories for loaded directory (0 is root for user)
  directories: function() {
    return directory.find({
      owner: Meteor.userId(),
      parent: 0, // TODO: set the current directory _id value once thats set up to be loaded in (should be 0 by default)
    }).fetch();
  },

  // creates a new directory
  newDirectory: function() {
    directory.insert({
      owner: Meteor.userId(),
      parent: 0, // TODO: set the current directory _id value once thats set up to be loaded in (should be 0 by default)
    });
  },

  // deletes a directory (should be done from a parent directory like how file deletion is done)
  deleteDirectory: function() {
    directory.remove({ _id: this._id });
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
      var file = new FS.File(files[i]);
      file.metadata = {
        owner: Meteor.userId(),
        directory: 0, // TODO: set the directory _id value once thats set up to be loaded in (should be 0 by default)
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