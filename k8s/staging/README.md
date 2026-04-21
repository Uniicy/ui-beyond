# Staging deployment

Storybook for `@uniicy/ui-beyond` runs at https://storybook.staging.uniicy.com on the shared Uniicy k3s cluster.

## First-time setup

One-off steps the cluster admin runs. After this, every push to `main` auto-deploys.

```sh
# 1. point DNS at the cluster
#    storybook.staging.uniicy.com → A 157.180.12.54

# 2. apply base manifests (namespace + deployment + service + ingress)
kubectl apply -f k8s/staging/

# basic-auth credentials are checked into git (bcrypt-hashed).
# Rotate with:
#   htpasswd -nbB admin <new-pw>
#   # replace the `auth:` line in basic-auth-secret.yaml, commit, re-apply.
```

cert-manager issues the TLS cert automatically within ~30–90s.

## Subsequent deploys

Push to `main`. `.github/workflows/deploy-staging.yaml` handles the rest:

1. Builds `Dockerfile`.
2. Pushes image to `157.180.12.54:5000/ui-beyond:sha-<git-sha>` + `:latest`.
3. `kubectl set image` rolls the deployment.
4. Waits for rollout to complete.

## Verify

```sh
kubectl get pods -n ui-beyond
kubectl logs -n ui-beyond deployment/ui-beyond-storybook
kubectl describe ingress ui-beyond-storybook -n ui-beyond
curl -I https://storybook.staging.uniicy.com
```
