/**
 * ADYSRE API Studio - documentation from a collection.
 *
 * Markdown, because it is the format that is readable as text, renders in every
 * repository host and wiki, converts to HTML or PDF with tools people already
 * have, and diffs. Generating HTML directly would produce something only a
 * browser can read and nobody can review.
 *
 * The document describes what the collection SAYS, not what a run of it
 * returned: endpoints, headers, bodies, auth and variables. Example responses
 * belong to a run, and inventing them would be documentation that lies.
 *
 * Secrets never appear, for the same reason they never appear in an export.
 */

import type { ApiCollection, ApiNode, ApiTreeNode, RequestDefinition } from '../../types';
import { activeEntries } from '../../utils/entries';
import { buildTree } from '../../utils/tree';

/** Markdown table cells cannot contain a raw pipe or newline. */
function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

/** A fence long enough that the content cannot close it early. */
function fence(content: string, language = ''): string {
  const longest = /(`{3,})/.exec(content)?.[1]?.length ?? 0;
  const ticks = '`'.repeat(Math.max(3, longest + 1));
  return `${ticks}${language}\n${content}\n${ticks}`;
}

function authLine(request: RequestDefinition): string | null {
  switch (request.auth.type) {
    case 'inherit':
      return 'Inherits auth from its folder or collection.';
    case 'none':
      return 'No auth.';
    case 'basic':
      return `Basic auth as \`${request.auth.username || '<username>'}\`.`;
    case 'bearer':
      return 'Bearer token in the `Authorization` header.';
    case 'apiKey':
      return `API key \`${request.auth.key}\` in the ${request.auth.addTo}.`;
    case 'digest':
      return 'Digest auth.';
    case 'jwt':
      return `Signed JWT (${request.auth.algorithm}).`;
    case 'oauth2':
      return `OAuth 2 (${request.auth.config.grantType}).`;
    case 'awsSignature':
      return `AWS signature for \`${request.auth.service}\` in \`${request.auth.region}\`.`;
    case 'customHeader':
      return `Custom header \`${request.auth.name}\`.`;
    case 'customQuery':
      return `Custom query parameter \`${request.auth.name}\`.`;
    default:
      return null;
  }
}

function bodySection(request: RequestDefinition): string[] {
  const lines: string[] = [];

  switch (request.body.type) {
    case 'none':
      return lines;

    case 'raw':
      lines.push('', '**Body**', '', fence(request.body.content, request.body.language));
      return lines;

    case 'graphql':
      lines.push('', '**Query**', '', fence(request.body.query, 'graphql'));
      if (request.body.variables.trim() !== '') {
        lines.push('', '**Variables**', '', fence(request.body.variables, 'json'));
      }
      return lines;

    case 'urlencoded': {
      const rows = request.body.entries
        .filter((entry) => entry.enabled)
        .map((entry) => `| \`${cell(entry.key)}\` | ${cell(entry.value)} |`);
      if (rows.length === 0) return lines;
      lines.push('', '**Form fields**', '', '| Field | Value |', '| --- | --- |', ...rows);
      return lines;
    }

    case 'multipart': {
      // A file part documents as "a file", because the bytes are not the
      // documentation: which field takes one is.
      const rows = request.body.entries
        .filter((entry) => entry.enabled)
        .map((entry) =>
          entry.kind === 'file'
            ? `| \`${cell(entry.key)}\` | _a file_ |`
            : `| \`${cell(entry.key)}\` | ${cell(entry.value)} |`,
        );
      if (rows.length === 0) return lines;
      lines.push('', '**Form fields**', '', '| Field | Value |', '| --- | --- |', ...rows);
      return lines;
    }

    case 'binary':
      lines.push('', '**Body**: a file upload.');
      return lines;

    default:
      return lines;
  }
}

function requestSection(node: ApiTreeNode, depth: number): string[] {
  const heading = '#'.repeat(Math.min(6, depth + 2));
  const lines: string[] = [`${heading} ${node.node.name}`];

  if (node.node.kind === 'folder') {
    if (node.node.description) lines.push('', node.node.description);
    for (const child of node.children) lines.push('', ...requestSection(child, depth + 1));
    return lines;
  }

  const request = node.node.request;
  lines.push('', `\`${request.method} ${request.url}\``);
  if (node.node.description || request.description) {
    lines.push('', node.node.description || request.description);
  }

  const auth = authLine(request);
  if (auth) lines.push('', auth);

  const params = activeEntries(request.params);
  if (params.length > 0) {
    lines.push(
      '',
      '**Query parameters**',
      '',
      '| Name | Example | Description |',
      '| --- | --- | --- |',
      ...params.map(
        (entry) => `| \`${cell(entry.key)}\` | ${cell(entry.value)} | ${cell(entry.description)} |`,
      ),
    );
  }

  const pathVariables = activeEntries(request.pathVariables);
  if (pathVariables.length > 0) {
    lines.push(
      '',
      '**Path variables**',
      '',
      '| Name | Example |',
      '| --- | --- |',
      ...pathVariables.map((entry) => `| \`${cell(entry.key)}\` | ${cell(entry.value)} |`),
    );
  }

  const headers = activeEntries(request.headers);
  if (headers.length > 0) {
    lines.push(
      '',
      '**Headers**',
      '',
      '| Header | Value |',
      '| --- | --- |',
      ...headers.map((entry) => `| \`${cell(entry.key)}\` | ${cell(entry.value)} |`),
    );
  }

  lines.push(...bodySection(request));
  return lines;
}

/**
 * Render a collection as Markdown documentation.
 *
 * @param nodes - every node of the collection, flat. The tree is derived here,
 * so the document's order is the sidebar's order.
 */
export function exportMarkdown(collection: ApiCollection, nodes: readonly ApiNode[]): string {
  const map = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const tree = buildTree(map, collection.id);

  const lines: string[] = [`# ${collection.name}`];
  if (collection.description) lines.push('', collection.description);

  const variables = collection.variables.filter((variable) => variable.enabled);
  if (variables.length > 0) {
    lines.push(
      '',
      '## Variables',
      '',
      '| Name | Value | Description |',
      '| --- | --- | --- |',
      ...variables.map(
        (variable) =>
          `| \`${cell(variable.key)}\` | ${
            // A secret's value is never written into a document that will be
            // committed, pasted into a wiki or attached to a ticket.
            variable.secret ? '_secret_' : cell(variable.value)
          } | ${cell(variable.description)} |`,
      ),
    );
  }

  if (tree.length > 0) {
    lines.push('', '## Endpoints');
    for (const node of tree) lines.push('', ...requestSection(node, 1));
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}
