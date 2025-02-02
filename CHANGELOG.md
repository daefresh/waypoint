## unreleased

FEATURES:

* **GitOps: Poll for changes and automatically run `waypoint up`**. Waypoint
  can now trigger a full build, deploy, release cycle on changes detected in Git. [GH-1109]
* **Runners: Run Waypoint operations remotely**. Runners are standalone processes that
  run operations such as builds, deploys, etc. remotely. [GH-1167] [GH-1171]
* **AWS Lambda**: Add support for building and deploying AWS Lambda workloads [GH-1097]
* **Dockerless image builds**: Waypoint can now build, tag, pull, and push
  Docker images in unprivileged environments without a Docker daemon. [GH-970]
* cli: New `waypoint fmt` command will autoformat your `waypoint.hcl` files [GH-1037]

IMPROVEMENTS:

* plugin/k8s: plugin will attempt in-cluster auth first if no kubeconfig file is specified [GH-1052] [GH-1103]

BUG FIXES:

* cli/exec: require at least one argument [GH-1188]

BREAKING CHANGES:

* ui: dropped support for Internet Explorer [GH-1075]

## 0.2.4 (March 18, 2021)

FEATURES:

IMPROVEMENTS:

* builtin/k8s: Include user defined labels on deploy pod [GH-1146]
* core: Update `-from-project` in `waypoint init` to handle local projects [GH-722]
* entrypoint: dump a memory profile to `/tmp` on `SIGUSR1` [GH-1194]

BUG FIXES:

* entrypoint: fix URL service memory leak [GH-1200]
* builtin/k8s/release: Allow target_port to be int or string [GH-1154]
* builtin/k8s/release: Include name field for service port release [GH-1184]
* builtin/docker: Revert #918, ensure HostPort is randomly assigned between container deploys [GH-1189]

## 0.2.3 (February 23, 2021)

FEATURES:

IMPROVEMENTS:

* builtin/docker: Introduce resources map for configuring cpu, memory on deploy [GH-1116]
* internal/server: More descriptive error for unknown application deploys [GH-973]
* serverinstall/k8s: Include option to define storageClassName on install [GH-1126]

BUG FIXES:

* builtin/docker: Fix host port mapping defined by service_port [GH-918]
* builtin/k8s: Surface pod failures on deploy [GH-1110]
* serverinstall/nomad: Set platform as nomad at end of Install [GH-1129]
* builtin/aws-ecs: Fix nil check on optional logging block [GH-1120]

## 0.2.2 (February 17, 2021)

FEATURES:

IMPROVEMENTS:

* builtin/aws/ecs: Add config option for disabling the load balancer [GH-1082]
* builtin/aws/ecs: Add awslog driver configuration [GH-1089]
* builtin/docker: Add Binds, Labels and Networks config options for deploy [GH-1065]
* builtin/k8s: Support multi-port application configs for deploy and release [GH-1092]
* cli/main: Add -version flag for CLI version [GH-1049]

BUG FIXES:

* bulitin/aws/ecs: Determine load balancer and target group for pre-existing listeners [GH-1085]
* builtin/aws/ecs: fix listener deletion on deployment deletion [GH-1087]
* builtin/k8s: Handle application config sync with K8s and Secrets [GH-1073]
* cli/hostname: fix panic with no hostname arg specified [GH-1044]
* core: Fix empty gitreftag response in config [GH-1047]

## 0.2.1 (February 02, 2021)

FEATURES:

* **Uninstall command for all server platforms**:
Use `server uninstall` to remove the Waypoint server and artifacts from the
specified `-platform` for the active server installation. [GH-972]
* **Upgrade command for all server platforms**:
Use `server upgrade` to upgrade the Waypoint server for the
specified `-platform` for the active server installation. [GH-976]

IMPROVEMENTS:

* builtin/k8s: Allow for defined resource limits for pods [GH-1041]
* cli: `server run` supports specifying a custom TLS certificate [GH-951]
* cli: more informative error messages on `install` [GH-1004]
* server: store platform where server is installed to in server config [GH-1000]
* serverinstall/docker: Start waypoint server container if stopped on install [GH-1009]
* serverinstall/k8s: Allow using k8s context [GH-1028]

BUG FIXES:

* builtin/aws/ami: require []string for aws-ami filters to avoid panic [GH-1010]
* cli: ctrl-c now interrupts server connection attempts [GH-989]
* entrypoint: log disconnect messages will now only be emitted at the ERROR level if reconnection fails [GH-930]
* server: don't block startup on URL service being unavailable [GH-950]
* server: `UpsertProject` will not delete all application metadata [GH-1027]
* server: increase timeout for hostname registration [GH-1040]
* plugin/google-cloud-run: fix error on deploys about missing type [GH-955]

## 0.2.0 (December 10, 2020)

FEATURES:

* **Application config syncing with Kubernetes (ConfigMaps), Vault, Consul, and AWS SSM**;
Automatically sync environment variable values with remote sources and restart your
application when those values change. [GH-810]
* **Access to Artifact, Deploy Metadata**: `registry` and `deploy` configuration can use
`artifact.*` variable syntax to access metadata from the results of those stages.
The `release` configuration can use `artifact.*` and `deploy.*` to access metadata.
For example: `image = artifact.image` for Docker-based builds. [GH-757]
* **`template` Functions**: `templatefile`, `templatedir`, and `templatestring` functions
allow you to template files, directories, and strings with the variables and functions
available to your Waypoint configuration.
* **`path` Variables**: you can now use `path.project`, `path.app`, and `path.pwd` as
variables in your Waypoint file to specify paths as relative to the project (waypoint.hcl
file), app, or pwd of the CLI invocation.
* **Server snapshot/restore**: you can now use the CLI or API to take and restore online
snapshots. Restoring snapshot data requires a server restart but the restore operation
can be staged online. [GH-870]

IMPROVEMENTS:

* cli/logs: entrypoint logs can now be seen alongside app logs and are colored differently [GH-855]
* contrib/serverinstall: Automate setup of kind+k8s with metallb [GH-845]
* core: application config changes (i.e. `waypoint config set`) will now restart running applications [GH-791]
* core: add more descriptive text to include app name in `waypoint destroy` [GH-807]
* core: add better error messaging when prefix is missing from the `-raw` flag in `waypoint config set` [GH-815]
* core: align -raw flag to behave like -json flag with waypoint config set [GH-828]
* core: `waypoint.hcl` can be named `waypoint.hcl.json` and use JSON syntax [GH-867]
* install: Update flags used on server install per-platform [GH-882]
* install/k8s: support for OpenShift [GH-715]
* internal/server: Block on instance deployment becoming available [GH-881]
* plugin/aws-ecr: environment variables to be used instead of 'region' property for aws-ecr registry [GH-841]
* plugin/google-cloud-run: allow images from Google Artifact Registry [GH-804]
* plugin/google-cloud-run: added service account name field [GH-850]
* server: APIs for Waypoint database snapshot/restore [GH-723]
* website: many minor improvements were made in our plugin documentation section for this release

BUG FIXES:

* core: force killed `waypoint exec` sessions won't leave the remote process running [GH-827]
* core: waypoint exec with no TTY won't hang open until a ctrl-c [GH-830]
* core: prevent waypoint server from re-registering guest account horizon URL service [GH-922]
* cli: server config-set doesn't require a Waypoint configuration file. [GH-819]
* cli/token: fix issue where tokens could be cut off on narrow terminals [GH-885]
* plugin/aws-ecs: task_role_name is optional [GH-824]


## 0.1.5 (November 09, 2020)

FEATURES:

IMPROVEMENTS:

* plugin/google-cloud-run: set a default releaser so you don't need a `release` block [GH-756]

BUG FIXES:

* plugin/ecs: do not assign public IP on EC2 cluster [GH-758]
* plugin/google-cloud-run: less strict image validation to allow projects with slashes [GH-760]
* plugin/k8s: default releaser should create service with correct namespace [GH-759]
* entrypoint: be careful to not spawn multiple url agents [GH-752]
* cli: return error for ErrSentinel types to signal exit codes [GH-768]

## 0.1.4 (October 26, 2020)

FEATURES:

IMPROVEMENTS:

* cli/config: you can pipe in a KEY=VALUE line-delimited file via stdin to `config set` [GH-674]
* install/docker: pull server image if it doesn't exist in local Docker daemon [GH-700]
* install/nomad: added `-nomad-policy-override` flag to allow sentinel policy override on Nomad enterprise [GH-671]
* plugin/ecs: ability to specify `service_port` rather than port 3000 [GH-661]
* plugin/k8s: support for manually specifying the namespace to use [GH-648]
* plugins/nomad: support for setting docker auth credentials [GH-646]

BUG FIXES:

* cli: `server bootstrap` shows an error if a server is running in-memory [GH-651]
* cli: server connection flags take precedence over context data [GH-703]
* cli: plugins loaded in pwd work properly and don't give `PATH` errors [GH-699]
* cli: support plugins in `$HOME/.config/waypoint/plugins` even if XDG path doesn't match [GH-707]
* plugin/docker: remove intermediate containers on build [GH-667]
* plugin/docker, plugin/pack: support ssh accessible docker hosts [GH-664]

## 0.1.3 (October 19, 2020)

FEATURES:

IMPROVEMENTS:

* install/k8s: improve stability of install process by verifying stateful set, waiting for service endpoints, etc. [GH-435]
* install/k8s: detect Kind and warn about additional requirements [GH-615]
* plugin/aws-ecs: support for static environment variables [GH-583]
* plugin/aws-ecs: support for ECS secrets [GH-583]
* plugin/aws-ecs: support for configuring sidecar containers [GH-583]
* plugin/pack: can set environment variables [GH-581]
* plugin/docker: ability to target remote docker engine for deploys, automatically pull images [GH-631]
* ui: onboarding flow after redeeming an invite token is enabled and uses public release URLs [GH-635]

BUG FIXES:

* entrypoint: ensure binary is statically linked on all systems [GH-586]
* plugin/nomad: destroy works [GH-571]
* plugin/aws: load `~/.aws/config` if available and use that for auth [GH-621]
* plugin/aws-ecs: Allow `cpu` parameter for to be optional for EC2 clusters [GH-576]
* plugin/aws-ecs: don't detect inactive cluster as existing [GH-605]
* plugin/aws-ecs: fix crash if subnets are specified [GH-636]
* plugin/aws-ecs: delete ECS ALB listener on destroy [GH-607]
* plugin/google-cloud-run: Don't crash if capacity or autoscaling settings are nil [GH-620]
* install/nomad: if `-nomad-dc` flag is set, `dc1` won't be set [GH-603]
* cli: contexts will fall back to not using symlinks if symlinks aren't available [GH-633]

## 0.1.2 (October 16, 2020)

IMPROVEMENTS:

* plugin/docker: can specify alternate Dockerfile path [GH-539]
* plugin/docker-pull: support registry auth [GH-545]

BUG FIXES:

* cli: fix compatibility with Windows versions prior to 1809 [GH-515]
* cli: `waypoint config` no longer crashes [GH-473]
* cli: autocomplete in bash no longer crashes [GH-540]
* cli: fix crash for some invalid configurations [GH-553]
* entrypoint: do not block child process startup on URL service connection [GH-544]
* plugin/aws-ecs: Use an existing cluster when there is only one cluster [GH-514]

## 0.1.1 (October 15, 2020)

Initial Public Release
