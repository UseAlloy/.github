/**
 * Validate that a PR description has a filled Overview section.
 * Intended for use with actions/github-script.
 *
 * @param {{ core: import('@actions/core'), context: import('@actions/github').Context }} params
 * @param {{ minOverviewLength?: number }} options
 */
module.exports = async function validatePrDescription({ core, context }, options = {}) {
  const minOverviewLength = Number(options.minOverviewLength) || 40;
  const pr = context.payload.pull_request;
  const body = pr?.body ?? '';

  if (!body.trim()) {
    core.setFailed('PR description is empty. Please add a description with enough context for reviewers.');
    return;
  }

  if (/\*\*REPLACE ME\*\*/i.test(body)) {
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
