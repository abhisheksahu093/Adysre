/**
 * ADYSRE API Studio - request definition schemas.
 *
 * These parse the two places a request arrives from outside the app: an import
 * file (Postman, OpenAPI, HAR, cURL) and a restored draft from storage that may
 * predate a shape change. Both are untrusted, and both are forgiving by design:
 * missing fields fall back to the Phase 1 defaults instead of failing a whole
 * 400-request import over one absent flag.
 */

import { z } from 'zod';
import type {
  AuthConfig,
  FormDataEntry,
  OAuth2Config,
  RequestBody,
  RequestDefinition,
  RequestScripts,
  RequestSettings,
  RetryPolicy,
} from '../types';
import {
  DIGEST_ALGORITHMS,
  HTTP_METHODS,
  JWT_ALGORITHMS,
  OAUTH2_GRANT_TYPES,
  PROTOCOLS,
  RAW_LANGUAGES,
} from '../types';
import {
  MAX_FORM_PARTS,
  MAX_HEADER_COUNT,
  MAX_REDIRECTS_CEILING,
  MAX_TIMEOUT_MS,
  MAX_URL_LENGTH,
  MIN_TIMEOUT_MS,
} from '../constants/limits';
import { DEFAULT_MAX_REDIRECTS, DEFAULT_TIMEOUT_MS } from '../constants/limits';
import {
  descriptionSchema,
  idSchema,
  keyValueEntrySchema,
  tagsSchema,
  variableSchema,
  type Parser,
} from './common';

const authTargetSchema = z.enum(['header', 'query']);

const formEntryBase = {
  id: idSchema,
  key: z.string().max(1_024).default(''),
  enabled: z.boolean().default(true),
  description: descriptionSchema,
  contentType: z.string().max(200).nullable().default(null),
};

export const formDataEntrySchema: Parser<FormDataEntry> = z.discriminatedUnion('kind', [
  z.object({ ...formEntryBase, kind: z.literal('text'), value: z.string().max(1_000_000).default('') }),
  z.object({ ...formEntryBase, kind: z.literal('file'), fileIds: z.array(idSchema).max(20).default([]) }),
]);

export const requestBodySchema: Parser<RequestBody> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('none') }),
  z.object({
    type: z.literal('raw'),
    language: z.enum(RAW_LANGUAGES).default('text'),
    content: z.string().default(''),
  }),
  z.object({
    type: z.literal('graphql'),
    query: z.string().default(''),
    variables: z.string().default(''),
    operationName: z.string().max(200).nullable().default(null),
  }),
  z.object({
    type: z.literal('multipart'),
    entries: z.array(formDataEntrySchema).max(MAX_FORM_PARTS).default([]),
  }),
  z.object({
    type: z.literal('urlencoded'),
    entries: z.array(keyValueEntrySchema).max(MAX_FORM_PARTS).default([]),
  }),
  z.object({
    type: z.literal('binary'),
    fileId: idSchema.nullable().default(null),
    fileName: z.string().max(400).nullable().default(null),
    contentType: z.string().max(200).nullable().default(null),
  }),
]);

/** Credential strings stay strings: they routinely hold `{{variable}}`. */
const credential = z.string().max(8_192).default('');

export const oauth2ConfigSchema: Parser<OAuth2Config> = z.object({
  grantType: z.enum(OAUTH2_GRANT_TYPES).default('authorization_code'),
  authUrl: credential,
  accessTokenUrl: credential,
  clientId: credential,
  clientSecret: credential,
  scope: credential,
  state: credential,
  audience: credential,
  resource: credential,
  username: credential,
  password: credential,
  clientAuthentication: z.enum(['body', 'basic']).default('body'),
  accessToken: credential,
  refreshToken: credential,
  expiresAt: z.number().int().nonnegative().nullable().default(null),
  addTo: authTargetSchema.default('header'),
  headerPrefix: z.string().max(40).default('Bearer'),
});

export const authConfigSchema: Parser<AuthConfig> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('inherit') }),
  z.object({ type: z.literal('none') }),
  z.object({ type: z.literal('basic'), username: credential, password: credential }),
  z.object({
    type: z.literal('bearer'),
    token: credential,
    prefix: z.string().max(40).default('Bearer'),
  }),
  z.object({
    type: z.literal('apiKey'),
    key: credential,
    value: credential,
    addTo: authTargetSchema.default('header'),
  }),
  z.object({
    type: z.literal('digest'),
    username: credential,
    password: credential,
    realm: credential,
    algorithm: z.enum(DIGEST_ALGORITHMS).default('MD5'),
    qop: credential,
    opaque: credential,
  }),
  z.object({
    type: z.literal('jwt'),
    algorithm: z.enum(JWT_ALGORITHMS).default('HS256'),
    secret: credential,
    secretBase64Encoded: z.boolean().default(false),
    payload: z.string().max(100_000).default('{}'),
    headerPrefix: z.string().max(40).default('Bearer'),
    addTo: authTargetSchema.default('header'),
    paramName: z.string().max(200).default('token'),
  }),
  z.object({ type: z.literal('oauth2'), config: oauth2ConfigSchema }),
  z.object({
    type: z.literal('awsSignature'),
    accessKeyId: credential,
    secretAccessKey: credential,
    sessionToken: credential,
    region: credential,
    service: credential,
  }),
  z.object({ type: z.literal('customHeader'), name: credential, value: credential }),
  z.object({ type: z.literal('customQuery'), name: credential, value: credential }),
]);

export const retryPolicySchema: Parser<RetryPolicy> = z.object({
  attempts: z.number().int().min(0).max(10).default(0),
  backoffMs: z.number().int().min(0).max(60_000).default(500),
  retryOnStatus: z.array(z.number().int().min(100).max(599)).max(20).default([]),
  retryOnNetworkError: z.boolean().default(false),
});

export const requestSettingsSchema: Parser<RequestSettings> = z.object({
  timeoutMs: z.number().int().min(MIN_TIMEOUT_MS).max(MAX_TIMEOUT_MS).default(DEFAULT_TIMEOUT_MS),
  followRedirects: z.boolean().default(true),
  maxRedirects: z.number().int().min(0).max(MAX_REDIRECTS_CEILING).default(DEFAULT_MAX_REDIRECTS),
  verifyTls: z.boolean().default(true),
  encodeUrl: z.boolean().default(true),
  sendCookies: z.boolean().default(true),
  storeCookies: z.boolean().default(true),
  decompress: z.boolean().default(true),
  retry: retryPolicySchema.default({
    attempts: 0,
    backoffMs: 500,
    retryOnStatus: [],
    retryOnNetworkError: false,
  }),
});

export const requestScriptsSchema: Parser<RequestScripts> = z.object({
  preRequest: z.string().max(100_000).default(''),
  test: z.string().max(100_000).default(''),
});

export const requestDefinitionSchema: Parser<RequestDefinition> = z.object({
  protocol: z.enum(PROTOCOLS).default('http'),
  method: z.enum(HTTP_METHODS).default('GET'),
  url: z.string().max(MAX_URL_LENGTH).default(''),
  params: z.array(keyValueEntrySchema).max(MAX_HEADER_COUNT).default([]),
  pathVariables: z.array(keyValueEntrySchema).max(MAX_HEADER_COUNT).default([]),
  headers: z.array(keyValueEntrySchema).max(MAX_HEADER_COUNT).default([]),
  body: requestBodySchema.default({ type: 'none' }),
  auth: authConfigSchema.default({ type: 'inherit' }),
  scripts: requestScriptsSchema.default({ preRequest: '', test: '' }),
  settings: requestSettingsSchema.default({
    timeoutMs: DEFAULT_TIMEOUT_MS,
    followRedirects: true,
    maxRedirects: DEFAULT_MAX_REDIRECTS,
    verifyTls: true,
    encodeUrl: true,
    sendCookies: true,
    storeCookies: true,
    decompress: true,
    retry: { attempts: 0, backoffMs: 500, retryOnStatus: [], retryOnNetworkError: false },
  }),
  variables: z.array(variableSchema).max(500).default([]),
  description: descriptionSchema,
  tags: tagsSchema,
});
