/**
* @constructor ClientWatcher
* client stuff 
*/
function ClientWatcher()  {
  
  var self = this;
  
  // settings to manage the polling and data
  self.settings = {
    // how often
    pollFrequency:1197,
    
    // what to call if something changes
    on:{
      
    },
    
    // which value properties to retrieve
    properties:[
      'BackgroundColors',
      'Values'
    ],
    
    // which domains can be checked for
    domains: ["sheet", "values","active"],
    
    // active, data , or selected
    scope: {
      name:"data",
      range:""
    }
  };
  

  // this holds current status
  var current_ =  {
    
    // current checksums
    checksums: {} ,
    
    // latest status of domains
    data: {
      // an array 1- for each of the properties required
      values:null, 
      sheet:{
        sheetId:"",
        sheetName:"",
        ss:"",
        dataRange:"",
        selectedRange:""
      },
      active: {
        activeRange:""
      }
    }
  };

  
  
  /**
   * set callback when change is detected
   * @param {string} the domain to look out for
   * @param {function} func the callback
   * @return {Client} self
   */
  self.on = function (domain, func) {
    // check args are good
    Utils.assert (typeof func === "function", "onChange callback must be a function");
    Utils.assert (self.settings.domains.indexOf(domain) !== -1 , 
                  "domain must be one of " + self.settings.domains.join(","));
    
    // new callback for domain change
    self.settings.on[domain] = func;
    return self;
  };
  
  /**
   * get started
   */
  self.start = function () {
    poll_();
    return Promise.resolve (null);        
  };
  
  /**
   * this polls, but only if the add-on is active
   */
  function pollWrapper_ () {
    
    return ifvisible.now() ? 
      Provoke.run ('ServerWatcher' , 'poll' ,  {
      checksums:current_.checksums,
      domains:Object.keys(self.settings.on),
      properties:self.settings.properties,
      scope:self.settings.scope
      }) : Promise.resolve (null);
  
  };
  /**
   * polling
   */
  function poll_ () {
    
    // call the server side and explain what to look for
    pollWrapper_()
    .then (function (pack) {
      
      if (pack) {
        // check whats changed
        self.settings.domains.filter(function (k) {
          
          // copy forward previous if they are not there
          current_.data[k] = pack.data[k] || current_.data[k];
          
          // compare all the checksums for each domain
          return current_.checksums[k] !== pack.checksums[k];
        })
        .forEach (function (k) {
          // call the handler for each that has changed
          if (self.settings.on[k]) {
            self.settings.on[k](current_.data);
          }
        });
      }
      return Promise.resolve (pack);
    })
    .then (function (pack) {
      
      // update the checksums
      if (pack) {
        current_.checksums = pack.checksums;
      }
      // wait a bit then go again
      return Provoke.loiter (self.settings.pollFrequency);
    })
    .then (function () {
      // go again
      poll_ ();
    })
    ['catch'] (function(err) {
      // report an error
      Utils.assert (false, err);
    })
  }

}




