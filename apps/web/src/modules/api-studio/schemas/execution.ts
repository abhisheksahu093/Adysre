/**
 * ADYSRE API Studio - the runner's input schema.
 *
 * This is the module's security boundary. Everything else parses data the user
 * is editing for themselves; this parses the instruction "make this network
 * call from the server", which is the single most abusable thing the module
 * does. So unlike the forgiving import schemas, this one is strict: unknown
 * keys are rejected rather than stripped, every bound is enforced here rather
 * than trusted from the client, and header names must match the HTTP token
 * grammar so a newline cannot be smuggled into the request.
 *
 * Host policy (which addresses may be reached) is deliberately NOT here: it
 * depends on the deployment and on the agent doing the sending, and it needs
 * DNS resolution to be done properly. It belongs to the runner, which applies
 * it after this schema has established the request is well-formed.
 */

import { z } from 'zod';
import type { ExecutionRequest, WireBody, WireHeader, WirePart, WireSettings } from '../types';
import { EXECUTION_AGENTS, HTTP_METHODS } from '../types';
import {
  MAX_HEADER_COUNT,
  MAX_HEADER_VALUE_LENGTH,
  MAX_FORM_PARTS,
  MAX_REDIRECTS_CEILING,
  MAX_REQUEST_BODY_BYTES,
  MAX_RESPONSE_BYTES,
  MAX_TIMEOUT_MS,
  MAX_URL_LENGTH,
  MIN_TIMEOUT_MS,
} from '../constants/limits';
import { idSchema, type Parser } from './common';

/**
 * RFC 9110 field name: a token. Rejecting anything else is what makes header
 * injection (`X-Thing: a\r\nAuthorization: ...`) impossible by construction.
 */
const HEADER_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
/** Field values may not carry CR, LF or NUL, for the same reason. */
const HEADER_VALUE = /^[^\r\n\0]*$/;

export const wireHeaderSchema: Parser<WireHeader> = z
  .object({
    name: z.string().min(1).max(256).regex(HEADER_NAME, 'Invalid header name'),
    value: z.string().max(MAX_HEADER_VALUE_LENGTH).regex(HEADER_VALUE, 'Invalid header value'),
  })
  .strict();

const wirePartSchema: Parser<WirePart> = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('text'),
      name: z.string().min(1).max(256),
      value: z.string().max(MAX_REQUEST_BODY_BYTES),
      contentType: z.string().max(200).nullable(),
    })
    .strict(),
  z
    .object({
      kind: z.literal('file'),
      name: z.string().min(1).max(256),
      fileId: idSchema,
      contentType: z.string().max(200).nullable(),
    })
    .strict(),
]);

export const wireBodySchema: Parser<WireBody> = z.discriminatedUnion('encoding', [
  z.object({ encoding: z.literal('none') }).strict(),
  z.object({ encoding: z.literal('text'), content: z.string().max(MAX_REQUEST_BODY_BYTES) }).strict(),
  z
    .object({
      encoding: z.literal('base64'),
      // 4/3 expansion, so the decoded body still fits the byte ceiling.
      content: z
        .string()
        .max(Math.ceil((MAX_REQUEST_BODY_BYTES * 4) / 3))
        .regex(/^[A-Za-z0-9+/]*={0,2}$/, 'Invalid base64'),
      fileName: z.string().max(400).nullable(),
    })
    .strict(),
  z
    .object({ encoding: z.literal('multipart'), parts: z.array(wirePartSchema).max(MAX_FORM_PARTS) })
    .strict(),
]);

export const wireSettingsSchema: Parser<WireSettings> = z
  .object({
    timeoutMs: z.number().int().min(MIN_TIMEOUT_MS).max(MAX_TIMEOUT_MS),
    followRedirects: z.boolean(),
    maxRedirects: z.number().int().min(0).max(MAX_REDIRECTS_CEILING),
    verifyTls: z.boolean(),
    decompress: z.boolean(),
    sendCookies: z.boolean(),
    storeCookies: z.boolean(),
    maxResponseBytes: z.number().int().min(1).max(MAX_RESPONSE_BYTES),
  })
  .strict();

/**
 * The runner's contract.
 *
 * The URL is checked for shape only (absolute, http/https, bounded). Whether
 * that host may be reached is the runner's decision, made after DNS resolution
 * so a hostname cannot resolve its way past the check.
 */
export const executionRequestSchema: Parser<ExecutionRequest> = z
  .object({
    id: idSchema,
    workspaceId: idSchema,
    requestNodeId: idSchema.nullable(),
    agent: z.enum(EXECUTION_AGENTS),
    method: z.enum(HTTP_METHODS),
    url: z
      .string()
      .min(1)
      .max(MAX_URL_LENGTH)
      .refine((value) => {
        try {
          const parsed = new URL(value);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      }, 'Must be an absolute http or https url'),
    headers: z.array(wireHeaderSchema).max(MAX_HEADER_COUNT),
    body: wireBodySchema,
    settings: wireSettingsSchema,
  })
  .strict();

/** Parsed, validated runner input. Identical to {@link ExecutionRequest}. */
export type ParsedExecutionRequest = z.infer<typeof executionRequestSchema>;
