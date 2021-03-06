#!/usr/bin/env bash

# ------------------- BINARY SYSTEM LIBRARIES ------------------
# Copy libjpeg which is missing in edge lambda runtime even
# though it should be present in base Amazon Linux 2 filesystem.
#
# The library libjpeg-turbo is required for cwebp-bin package
# and I found no way to provide it purely through npm /FS
yum -y install \
  libjpeg-turbo \
  libpng \
  libtiff \
  jbigkit-libs

mkdir -pv "${LAMBDA_SHARED_LIB_DIR}"

cp --verbose --no-dereference \
  /usr/lib64/libjpeg.so* \
  /usr/lib64/libpng*.so* \
  /usr/lib64/libtiff*.so* \
  /usr/lib64/libjbig*.so* \
    "${LAMBDA_SHARED_LIB_DIR}"