uses pm2 to start/stop
pm2 start $HOME/pool-controller/web/bin/www --name pool-controller-web


To watch the logs: 
```
pm2 logs
```

to start in watch mode to see everything coming across the wire
```node monitor.js```
