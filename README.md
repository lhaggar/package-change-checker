# Package Change Checker

Run npm install when package json dependency changes between ORIG_HEAD and HEAD. Suggested use as a githook.

If `npm install` is not suitable, customise the install command; `--install-cmd="npm install && npm run bootstrap"` for example.
