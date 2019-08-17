uses pm2 to start/stop:

```
# initial start
pm2 start $HOME/pool-controller/web/bin/www --name pool-controller-web

# stop
pm2 stop pool-contrlloer-web

# start it again
pm2 start pool-contrlloer-web
```


To watch the logs: 
```
pm2 logs
```

to start in watch mode to see everything coming across the wire
```node monitor.js```
