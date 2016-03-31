1、文档
https://ringpop.readthedocs.org/en/latest/getting_started.html

2、开始
2.1 Ringpop到底是什么？
Ringpop是一个通过维护一致性Hash环用来在你的应用中shard数据

Ringpop有三个重要的特性
1、membership protocol
2、consistent hash ring
3、request forwarding

3、安装
首先用
brew install nvm
安装nvm
然后，用nvm来安装老版本的node
nvm install v0.10.43

然后开一个新目录
npm install ringpop

4、安装tchannel
npm install tchannel


5、运行一个最简单的例子
node examples/key_value.js -n kv


info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 put: {"key":"foo","value":"bar"}
info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 put: {"key":"foo","value":"bar"}
info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 put: {"key":"foo","value":"bar"}
info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 put: {"key":"foo","value":"bar"}
info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 put: {"key":"foo","value":"bar"}
info: 127.0.0.1:3002 forwarding request to 127.0.0.1:3000...
info: 127.0.0.1:3000 handling request...
info: 127.0.0.1:3000 get: {"key":"foo"}


6、第一个tchannel（set）
  1 var TChannel = require('tchannel');
  2
  3
  4 var client = new TChannel();
  5
  6     var clientChan = client.makeSubChannel({
  7         serviceName: 'server',
  8         peers: ['127.0.0.1:3000'],
  9         requestDefaults: {
 10             hasNoParent: true,
 11             headers: { 'as': 'raw', 'cn': 'example-client' }
 12         }
 13     });
 14
 15     clientChan.request({
 16         serviceName: 'kv',
 17         timeout: 1000
 18     }).send('put', '-3','{"key":"foo","value":"bar"}', function onResp(err, res, arg2, arg3) {
 19         console.log('response:',arg3.toString());
 20     });


 7、第二个tchannel（get）
   1 var TChannel = require('tchannel');
  2
  3 var client = new TChannel();
  4
  5 var clientChan = client.makeSubChannel({
  6          serviceName: 'server',
  7          peers: ['127.0.0.1:3002'],
  8          requestDefaults: {
  9              hasNoParent: true,
 10              headers: { 'as': 'raw', 'cn': 'example-client' }
 11          }
 12      });
 13
 14      clientChan.request({
 15          serviceName: 'kv',
 16         timeout: 1000
 17      }).send('get', '-3','{"key":"foo"}', function onResp(err, res, arg2, arg3) {
 18          console.log('response:',arg3.toString());
 19      });


 8、运行之：
 lemonhall@HalldeMacBook-Pro:~/ringpop-node$ node t.js
response: "OK"
^Clemonhall@HalldeMacBook-Pro:~/ringpop-node$ node t1.js
response: "bar"
^Clemonhall@HalldeMacBook-Pro:~/ringpop-node$



9、例子
47 # Key Value
 48 Start your Ringpop cluster:
 49
 50 ```
 51 node key_value.js -n kv
 52 ```
 53
 54 Put a value into the store:
 55
 56 ```sh
 57 tcurl -p 127.0.0.1:3000 kv put -3 '{"key":"foo","value":"bar"}'
 58 ```
 59
 60 And read it back (from a different node):
 61
 62 ```sh
 63 tcurl -p 127.0.0.1:3002 kv get -3 '{"key":"foo"}'
 64 ```

 10、安装官方的例子来看，uber内部应该封装了一个小工具叫做
 tcurl
 但是，半天没找到，所以自己手写了一个，之后封装一个小工具即可；

 看上去tchannel的交互还是比较简单的

