var App = Backbone.Model.extend({
  initialize: function(message) {
    this.set('room','');
    this.set('user','');
    new AppView({model: this});
  }
});

var Room = Backbone.Model.extend({
  initialize: function(message) {
    this.set('name', message.name);
    this.set('user', message.user);
    new RoomView({model: this});
  },
});

var User = Backbone.Model.extend({
  initialize: function(message) {
    this.set('name', message.name);
    this.set('roomname', message.roomname);
    this.set('friends', []);
  }
});

var Message = Backbone.Model.extend({
  initialize: function(message) {
    if (message !== undefined) {
      this.set('text', message.text);
      this.set('username', message.username);
      new MessageView({model: this});
    }
  }
});

// helper functions
var postMessage = function(username, roomname, text) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify({
      username: username,
      roomname: roomname,
      text: text
    }),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      getMessages(roomname);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var postFriend = function(username, friendname) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify({
      username: username,
      friendname: friendname,
      friendify: '12345'
    }),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: friended');
      getMessages(roomname);
    },
    error: function (data) {
      console.error('chatterbox: Failed to friend');
    }
  });
};

var getMessages = function(roomname) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?where=' + encodeURIComponent('{"roomname":"' + roomname + '"}'),
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      receiveMessages(data);
    }
  });
};

var getFriends = function(user) {
   $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?where=' + encodeURIComponent('{"friendify": "12345", "username": "' + window.app.get('user').get('name') + '"}'),
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      receiveFriends(data, user);
    }
  });
};

var receiveMessages = function(data) {
  $('.chatdisplay').empty();
  data.results.forEach(function(item) {
    // get real names
    new Message({text: item.text, username: item.username});
  });
};

var receiveFriends = function(data, user) {
  var friends = [];
  data.results.forEach(function(friend) {
    friends.push(friend.friendname);
  });
  user.set('friends', friends);
};