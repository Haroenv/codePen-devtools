(function (window, document) {
  function DevTools() {
    this.element = document.createElement('div');
    this.element.classList.add('codepen-devtools');
    this.element.classList.add('closed');
    this.output = document.createElement('textarea');
    this.element.appendChild(this.output);
    this.output.addEventListener('focus', function (e) {
      this.select();
      // Work around Chrome's little problem
      this.addEventListener('mouseup', function (e) {
        e.preventDefault();
        return false;
      });
    });
    document.body.appendChild(this.element);
  };
  DevTools.prototype.send = function (input) {
    this.output.innerHTML = input;
    this.element.classList.remove('closed');
  };
  var devtools = new DevTools();

  function Followers(element) {
    this.grid = element;
    this.followers = [];
  }
  Followers.prototype.get = function () {
    _this = this;
    var items = _this.grid.querySelectorAll('li');
    Array.prototype.forEach.call(items, function (item, i) {
      var userSelector = '.user-name:not(.user-list-link)';
      var userRealNameSelector = '.user-name.user-list-link';
      var user = item.querySelectorAll(userSelector);
      var userName = user[0].getAttribute('href')
        .split('/')[1];
      var userAvatar = user[0].querySelector('img')
        .src;
      var userRealName = item.querySelectorAll(userRealNameSelector)[0].innerText;
      var userUrl = user[0].href;
      var follower = {
        userName: userName,
        userAvatar: userAvatar,
        userRealName: userRealName,
        userUrl: userUrl,
      }
      _this.followers.push(follower);
    });
    return _this.followers;
  };

  function page(name) {
    var pass = window.location.pathname.split('/')
      .indexOf(name) > -1;
    if (pass) {
      console.log('codePen | Page: ' + name);
    }
    return pass;
  }
  if (page('followers')) {
    var followersGrid = document.getElementById('followers-pens-grid');
    if (!followersGrid) {
      return false;
    }
    var followers = new Followers(followersGrid);
    var getFollowers = function () {
      return followers.get();
    };

    function send(input) {
      devtools.send(input);
    }

    function getNextFollowers() {
      var pagination = document.querySelector('.bottom-pagination');
      if (!pagination) {
        return false;
      }
      var next = pagination.querySelector('.spinner')
        .nextElementSibling;
      if (!next) {
        var allFollowers = getFollowers();
        send(JSON.stringify(allFollowers));
        console.log('This user has: ' + allFollowers.length + ' followers');
        return false;
      }
      getFollowers();
      next.addEventListener('click', function () {
        console.log('getting Followers...');
        setTimeout(function () {
          getNextFollowers();
        }, 2000);
      });
      next.click();
    }
    var followersButton = document.createElement('button');
    followersButton.classList.add('codepen-devtools-button');
    followersButton.innerText = 'get Followers';
    followersButton.addEventListener('click', function () {
      getNextFollowers();
    });
    devtools.element.appendChild(followersButton);
  }
})(window, document);