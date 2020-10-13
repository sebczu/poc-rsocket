#!/bin/bash

kubectl delete -k ../base
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/cloud/deploy.yaml