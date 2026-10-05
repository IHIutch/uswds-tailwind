# Releases

Changesets manages package versions and changelogs on `next`. Add a changeset
with `pnpm changeset` when a PR changes a published package.

## V2 beta

The packages share a fixed version group. The release setup uses an unpublished
`1.0.0` baseline and a queued major changeset, `v2-beta.md`, so the first release
PR generates `2.0.0-beta.0`. The baseline itself is not a release to publish.
Merge the component changes before merging that release PR. Later changesets
advance the beta counter, for example to `2.0.0-beta.1`.

The GitHub release workflow runs on `next`:

1. Changesets opens or updates a release PR when there are pending changesets.
2. Merging that PR builds and publishes the packages through Changesets.
3. `scripts/promote-beta.mjs` checks that every public package's exact beta
   version exists on npm, then assigns those versions to `latest`.

The beta suffix stays in the version number. Ordinary npm installs receive the
beta because `latest` points to it. Previously released alpha changesets are removed from the active release cycle;
their notes remain in the existing package changelogs and Git history. Changesets
v3 stores processed beta changesets in `.changeset/pre/`.

## npm setup

For every published package, the npm trusted publisher must allow both publishing
and `npm dist-tag` operations for `.github/workflows/release.yml`. Enable
**Allow npm dist-tag** in its trusted publisher settings. The workflow installs
npm 11.21.0, which supports trusted publishing for distribution tags.

## Verification and retries

```sh
pnpm release:latest --dry-run
pnpm changeset publish-plan
```

The dry run prints promotion commands without contacting npm or changing tags.
Run it on the generated release PR, where package versions are beta versions.
`publish-plan` reads the registry but does not publish. To inspect the first
release locally, run `pnpm changeset:version` in a disposable worktree.

If promotion fails after publication, rerun the release workflow or run
`pnpm release:latest` from the release commit with npm authentication. It always
uses the exact versions in the manifests, so no new version is needed for a retry.
Tag changes are sequential; a partial failure can leave some packages promoted
until the retry completes.

Before leaving beta mode, remove the promotion command from the publish script,
change package publishing tags to `latest`, and run `pnpm changeset pre exit`
followed by `pnpm changeset:version` to prepare the stable release.
