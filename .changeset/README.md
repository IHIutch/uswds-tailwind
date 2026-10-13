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

1. Every push calls the shared CI workflow to build, lint, type-check, and test
   the packages before Changesets runs.
2. Changesets opens or updates a release PR when there are pending changesets.
3. Merging that PR validates again, then publishes the packages through Changesets.
4. `scripts/promote-beta.mjs` waits for every package's exact beta version to
   become visible on npm, then points each package's `latest` tag to that version.
5. The workflow clears GitHub's pre-release flag while keeping the beta version
   and title. React's release is explicitly marked Latest for the repository.

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

`pnpm release:latest --dry-run` prints the npm promotion commands without
changing anything. Run it from a release commit with beta manifest versions.

`pnpm changeset publish-plan` reads the registry and reports what would be
published without changing anything. To inspect versioning locally, run
`pnpm changeset:version` in a disposable worktree.

If promotion fails after publication, rerun the release workflow. The
promotion steps use the exact manifest versions even when no new packages need
publishing, so no version bump is needed for a retry. npm lookups retry temporary
404 responses up to 12 times, with 10 seconds between attempts. Authentication
and permission errors fail immediately.

Tag and release edits are sequential. A partial failure can leave some packages
promoted until the retry completes.

Before leaving beta mode, remove the beta promotion steps from the release workflow,
change package publishing tags to `latest`, and run `pnpm changeset pre exit`
followed by `pnpm changeset:version` to prepare the stable release.
