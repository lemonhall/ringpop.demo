var TChannel = require('tchannel');


var client = new TChannel();

    var clientChan = client.makeSubChannel({
        serviceName: 'server',
        peers: ['127.0.0.1:3000'],
        requestDefaults: {
            hasNoParent: true,
            headers: { 'as': 'raw', 'cn': 'example-client' }
        }
    });

    clientChan.request({
        serviceName: 'kv',
        timeout: 1000
    }).send('put', '-3','{"key":"foo","value":"bar"}', function onResp(err, res, arg2, arg3) {
        console.log('response:',arg3.toString());
    });
