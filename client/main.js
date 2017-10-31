import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import storage from '../imports/api/storage';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.home.events({
  'change .your-upload-class': function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
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
