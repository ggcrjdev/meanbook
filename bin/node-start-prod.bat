cd ..
set "NODE_ENV=production"
set "MONGODB_USERNAME=appmeanbook"

if "x%MONGODB_PASSWORD%" == "x" (
    cls
    echo ERROR: The environment variable MONGODB_PASSWORD must be configured.
    pause
    goto END
)

node server/src/index.js

:END
