FROM amazonlinux:latest

ENV PATH=/var/lang/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib \
    AWS_EXECUTION_ENV=AWS_Lambda_nodejs8.10 \
    NODE_PATH=/var/runtime:/var/task:/var/runtime/node_modules \
    npm_config_unsafe-perm=true

RUN rm -rf /var/runtime /var/lang && \
  curl https://lambci.s3.amazonaws.com/fs/nodejs8.10.tgz | tar -zx -C /

RUN yum groups mark install "Development Tools"
RUN yum groups mark convert "Development Tools"
RUN yum groupinstall -y "Development Tools"
RUN yum-config-manager --add-repo http://www.nasm.us/nasm.repo
RUN yum install -y nasm

RUN yum install -y libjpeg-devel libpng-devel libtiff-devel libgif-devel

RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

RUN yum install -y yarn

WORKDIR /var/app-local

CMD rsync --delete -a /var/app/* . --exclude .git --exclude node_modules && rm /var/app/deploy-package.zip && yarn --prod && zip -qr9 /var/app/deploy-package.zip . -x "__tests__*" ".git*" --display-globaldots

