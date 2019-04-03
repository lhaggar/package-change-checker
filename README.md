
# Package Change Checker

Run an npm install (or anything else you want!) when package json dependencies change between ORIG_HEAD and HEAD. Suggested use as a githook, on post-merge for example.

## Usage
Add `package-change-checker` to your dev dependencies and call it as part of a githook, or an npm command, or just globally install and use it manually.

### Supported Arguments

 - Can override the ORIG_HEAD and HEAD defaults by passing commits/tags/branches, first commit will override ORIG_HEAD, second overrides HEAD. e.g. `package-change-checker 39ddb32 1d62193`
 - `--install-cmd="..."`:
	 - Default: `npm install`
	 - If the default npm install command is not suitable, you can override it, e.g.;
		 - `--install-cmd="npm install && npm run bootstrap"`
		 - `--install-cmd="echo 'Warning! Dependencies have changed!`
 - `--quiet`:
	 - Default: `false`
	 - By default package-change-checker will log out if there are changes or not, and will log out the command to run. If you're just echoing out a warning on change, you probably want to include this argument.

### Env Flags

If you wish to disable the checker completely you can add `PACKAGE_CHANGE_CHECKER_DISABLED=true` to your env. This will skip all behaviour and logging.
