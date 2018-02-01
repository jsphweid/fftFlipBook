#!/bin/bash
bucket_name=$(<~/.aws/main_bucket_name)
cloudfront_id=$(<~/.aws/main_cloudfront_id)

aws s3 sync ./dist/artifacts s3://${bucket_name}/react-fft-flipbook --delete
aws cloudfront create-invalidation --distribution-id ${cloudfront_id} --paths "/*"