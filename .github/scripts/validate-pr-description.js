/**
 * Validate that a PR description has a filled Overview section.
 * Intended for use with actions/github-script.
 *
 * Revert PRs and bot authors whose login matches EXEMPT_BOT_LOGIN_PATTERN are
 * exempt; detection lives here rather than in a caller/workflow `if` condition
 * so the job still completes successfully instead of showing as skipped, which
 * can block merges when this check is required.
 *
 * @param {{ core: import('@actions/core'), context: import('@actions/github').Context }} params
 * @param {{ minOverviewLength?: number }} options
 */

/** Case-insensitive: "alloy" anywhere, or "ai" as a hyphen/underscore-delimited token. */
const EXEMPT_BOT_LOGIN_PATTERN = /alloy|(?:^|[-_])ai(?:[-_]|$)/i;

function normalizeBotLogin(login) {
  return (login ?? '').toLowerCase().replace(/\[bot\]$/, '');
}

function isExemptBotPr(pr) {
  if (pr?.user?.type !== 'Bot') {
    return false;
  }
  return EXEMPT_BOT_LOGIN_PATTERN.test(normalizeBotLogin(pr?.user?.login));
}

function isRevertPr(pr) {
  const title = pr?.title ?? '';
  const headRef = pr?.head?.ref ?? '';
  return /^Revert\s/i.test(title) || /^revert[-_]/i.test(headRef);
}

module.exports = async function validatePrDescription({ core, context }, options = {}) {
  const minOverviewLength = Number(options.minOverviewLength) || 40;
  const pr = context.payload.pull_request;

  if (isExemptBotPr(pr)) {
    core.info('Skipping PR description check for exempt bot-authored PR.');
    return;
  }

  if (isRevertPr(pr)) {
    core.info('Skipping PR description check for revert PR.');
    return;
  }

  const body = pr?.body ?? '';

  if (!body.trim()) {
    core.setFailed('PR description is empty. Please add a description with enough context for reviewers.');
    return;
  }

  if (/\*\*REPLACE ME\*\*/.test(body)) {
    core.setFailed('PR description still contains the "REPLACE ME" placeholder. Please fill in the overview.');
    return;
  }

  const withoutComments = body.replace(/<!--[\s\S]*?-->/g, '');
  const overviewSection = withoutComments
    .split(/\n(?=## )/)
    .find((section) => /^##[^\n]*overview/i.test(section.trim()));

  if (!overviewSection) {
    core.setFailed(
      'PR description must include an "## Overview" section. Use the standard PR template and fill in the overview.'
    );
    return;
  }

  const overviewText = overviewSection
    .replace(/^##[^\n]*\n?/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (overviewText.length < minOverviewLength) {
    core.setFailed(
      `Overview section is too short (${overviewText.length} characters, minimum ${minOverviewLength}). Please add a brief description of the change.`
    );
    return;
  }

  core.info(`PR description check passed (overview: ${overviewText.length} characters).`);
};
