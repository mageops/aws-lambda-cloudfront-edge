[![Build Status](https://travis-ci.com/mageops/aws-lambda-cloudfront-edge.svg?branch=master)](https://travis-ci.com/mageops/aws-lambda-cloudfront-edge)

# Lambda@Edge for creativeshop

## Requirements

-   Using AWS CloudFront as a CDN server.
-   Docker and node@10.x for development.


## Setting up

### Use prebuilt deploy packages

If you don't need to modify the code you can use the prebuilt deploy packages
provided as _assets_ with each [GitHub release](https://github.com/mageops/aws-lambda-cloudfront-edge/releases).

They are built automatically using [Travis CI](https://travis-ci.com/mageops/aws-lambda-cloudfront-edge).

### Build lambda deploy package (optional)

Because our lambda requires native modules in npm packages e.g. for image optimization, compression etc. we need to rebuild entire `node_modules` on the same operating system that AWS Lambda is running on. Then the complete codebase is zipped into `edge-lambda-deploy-package.zip` archive which can be attached in Lambda Management Console.

To automatically generate `edge-lambda-deploy-package.zip` using docker image:

```bash
yarn create-package
```

Or enter the command directly:

```bash
docker run --rm --tty --volume "$(pwd):/var/app" mageops/aws-lambda-build:nodejs10.x nodejs-yarn edge-lambda-deploy-package
```

**NOTE:** _Even though lambda's runtime should be based on Amazon Linux 2 which has `libjpeg-turbo`
included by default, this library seems to be missing. The custom build hook installs appropriate
so files into the `lib/` subdirectory. It's possible that Lambda@Edge still uses
Amazon Linux 1 as the system runtime, what is not surprising given that this specific lambda
type does not support node12.x in contrast to "standard ones"._

#### Docker image for building lambdas

The package is built using [mageops/aws-lambda-build](https://hub.docker.com/r/mageops/aws-lambda-build).
Check the corresponding [GitHub repository](https://github.com/mageops/aws-lambda-build) for more information.

### Configuring Lambda function

Go to [Lambda Management Console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions) and create new function (make sure you have **US East (N. Virginia)** region selected) with following data:

**Name:** `originRequest`

**Runtime:** `Node.js 10.x`

**Role:** `Create new role from template(s)`

**Role name:** Your desired name for a role.

**Policy templates:** `Basic Edge Lambda permissions`

_**Note:**_ You can create your own role if you know what you are doing.

You will be redirected to function configuration, there you need to setup the following:

#### Function Code

1.  Select `Upload a .ZIP` file in `Code entry type` field.
2.  Upload previously generated `edge-lambda-deploy-package.zip`.
3.  Make sure `Runtime` is set to `Node.js 8.10`.
4.  Set `Handler` field to `origin-request.handler`.

#### Basic Settings

1.  Set `Memory (MB)` limit to `1024MB` for best performance/cost ratio.
2.  Set `Timeout` to about `20s` (compressing images larger then few MB takes a lot of time and can still be slower).

### Attaching to CloudFront

1.  Save all the changes.
2.  Release new version using `Actions` dropdown.
3.  You will be redirected to certain version configuration.
4.  In `Designer` tab select `CloudFront` in `Add triggers` section.
5.  Scroll down to `Configure Triggers` section.
6.  Select your target CloudFront distribution in the `Distribution` field.
7.  Leave cache behaviour at `*`.
8.  Set CloudFront event to `Origin Request`.
9.  Check `Enable trigger and replicate`.
10. Confirm by clicking the `Add` button.
11. Hit `Save` button at the top-right.
12. Wait for CloudFront to apply the changes(usually a minute or two).


