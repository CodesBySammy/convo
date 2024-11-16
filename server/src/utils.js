const formatMessage = (username, text) => {
    return {
      username,
      text,
      timestamp: new Date().toISOString()
    };
  };
  
  module.exports = {
    formatMessage
  };