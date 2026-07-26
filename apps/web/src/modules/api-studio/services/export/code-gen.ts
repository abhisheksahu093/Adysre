/**
 * ADYSRE API Studio - generating client code.
 *
 * Templates, not AI: the output has to be identical for the same input every
 * time, has to compile, and has to be reviewable. A generator is a pure
 * function from the PREPARED request - the literal one the runner would send -
 * so the code you copy makes the call you just made, with variables resolved
 * and auth applied rather than left as `{{token}}` for the reader to puzzle out.
 *
 * Each language gets its own escaping. Reusing one escaper across all of them
 * is how a generator ends up emitting a string that breaks in Ruby but not in
 * Go, which is a bug nobody finds until someone pastes it.
 */

import type { ExecutionRequest, WireHeader } from '../../types';

export interface CodeTarget {
  id: string;
  /** Key under `apiStudio.codegen.targets`. */
  labelKey: string;
  /** Syntax id, for a highlighter. */
  language: string;
  generate: (request: ExecutionRequest) => string;
}

/** The body as a string, or `null` when there is nothing to send. */
function bodyText(request: ExecutionRequest): string | null {
  if (request.body.encoding === 'text') return request.body.content;
  if (request.body.encoding === 'none') return null;
  // Binary and multipart reference files that live in the workspace, not in a
  // snippet. Saying so beats emitting code that sends an empty body.
  return null;
}

function bodyNote(request: ExecutionRequest, comment: string): string {
  return request.body.encoding === 'base64' || request.body.encoding === 'multipart'
    ? `${comment} The file upload in this request is not included in generated code.\n`
    : '';
}

const headers = (request: ExecutionRequest): WireHeader[] => request.headers;

/** Escapes for a double-quoted string, per language family. */
const esc = {
  /** JavaScript, Java, C#, Swift, Kotlin, Dart, Go. */
  double: (value: string): string =>
    value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r'),
  /** Python and Ruby single-quoted. */
  single: (value: string): string =>
    value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n'),
  /** Shell single-quoted: close, escape, reopen. */
  shell: (value: string): string => value.replace(/'/g, `'\\''`),
  /** PHP single-quoted: only the quote and the backslash are special. */
  php: (value: string): string => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'"),
};

/** A JS/JSON object literal of the headers, indented two spaces. */
function jsHeaders(request: ExecutionRequest, indent = '    '): string {
  return headers(request)
    .map((header) => `${indent}"${esc.double(header.name)}": "${esc.double(header.value)}"`)
    .join(',\n');
}

export const CURL: CodeTarget = {
  id: 'curl',
  labelKey: 'curl',
  language: 'bash',
  generate: (request) => {
    const lines = [`curl --request ${request.method} \\`, `  --url '${esc.shell(request.url)}'`];

    for (const header of headers(request)) {
      lines.push(`  --header '${esc.shell(`${header.name}: ${header.value}`)}'`);
    }

    const body = bodyText(request);
    if (body !== null) lines.push(`  --data '${esc.shell(body)}'`);
    if (!request.settings.verifyTls) lines.push('  --insecure');
    if (request.settings.followRedirects) lines.push('  --location');

    // Continuations belong on every line but the last.
    return (
      bodyNote(request, '#') +
      lines
        .map((line, index) =>
          index === 0 || index === lines.length - 1 ? line : line.endsWith('\\') ? line : `${line} \\`,
        )
        .join('\n')
        .replace(/\\\n\s*$/, '')
    );
  },
};

const FETCH: CodeTarget = {
  id: 'js-fetch',
  labelKey: 'jsFetch',
  language: 'javascript',
  generate: (request) => {
    const body = bodyText(request);
    return `${bodyNote(request, '//')}const response = await fetch("${esc.double(request.url)}", {
  method: "${request.method}",
  headers: {
${jsHeaders(request)}
  },${body === null ? '' : `\n  body: ${JSON.stringify(body)},`}
});

const data = await response.json();
console.log(data);`;
  },
};

const AXIOS: CodeTarget = {
  id: 'js-axios',
  labelKey: 'jsAxios',
  language: 'javascript',
  generate: (request) => {
    const body = bodyText(request);
    return `${bodyNote(request, '//')}import axios from "axios";

const response = await axios({
  method: "${request.method.toLowerCase()}",
  url: "${esc.double(request.url)}",
  headers: {
${jsHeaders(request)}
  },${body === null ? '' : `\n  data: ${JSON.stringify(body)},`}
});

console.log(response.data);`;
  },
};

const NODE: CodeTarget = {
  id: 'node',
  labelKey: 'node',
  language: 'javascript',
  generate: (request) => {
    const body = bodyText(request);
    const url = new URL(request.url);
    return `${bodyNote(request, '//')}import { request } from "node:${url.protocol === 'https:' ? 'https' : 'http'}";

const options = {
  method: "${request.method}",
  headers: {
${jsHeaders(request)}
  },
};

const req = request("${esc.double(request.url)}", options, (res) => {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => console.log(Buffer.concat(chunks).toString()));
});

req.on("error", console.error);
${body === null ? '' : `req.write(${JSON.stringify(body)});\n`}req.end();`;
  },
};

const PYTHON: CodeTarget = {
  id: 'python',
  labelKey: 'python',
  language: 'python',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `    '${esc.single(header.name)}': '${esc.single(header.value)}',`)
      .join('\n');

    return `${bodyNote(request, '#')}import requests

url = '${esc.single(request.url)}'

headers = {
${headerLines}
}
${body === null ? '' : `\npayload = '''${body.replace(/'''/g, "\\'\\'\\'")}'''\n`}
response = requests.${request.method.toLowerCase()}(
    url,
    headers=headers,${body === null ? '' : '\n    data=payload,'}
    timeout=${Math.round(request.settings.timeoutMs / 1_000)},${request.settings.verifyTls ? '' : '\n    verify=False,'}
)

print(response.status_code)
print(response.text)`;
  },
};

const GO: CodeTarget = {
  id: 'go',
  labelKey: 'go',
  language: 'go',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `\treq.Header.Set("${esc.double(header.name)}", "${esc.double(header.value)}")`)
      .join('\n');

    return `${bodyNote(request, '//')}package main

import (
\t"fmt"
\t"io"
\t"net/http"
${body === null ? '' : '\t"strings"\n'})

func main() {
${body === null ? `\treq, err := http.NewRequest("${request.method}", "${esc.double(request.url)}", nil)` : `\tpayload := strings.NewReader(${JSON.stringify(body)})\n\treq, err := http.NewRequest("${request.method}", "${esc.double(request.url)}", payload)`}
\tif err != nil {
\t\tpanic(err)
\t}

${headerLines}

\tres, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer res.Body.Close()

\tbody, _ := io.ReadAll(res.Body)
\tfmt.Println(res.Status)
\tfmt.Println(string(body))
}`;
  },
};

const JAVA: CodeTarget = {
  id: 'java',
  labelKey: 'java',
  language: 'java',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `    .header("${esc.double(header.name)}", "${esc.double(header.value)}")`)
      .join('\n');

    return `${bodyNote(request, '//')}import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${esc.double(request.url)}"))
    .timeout(Duration.ofMillis(${request.settings.timeoutMs}))
${headerLines}
    .method("${request.method}", ${body === null ? 'HttpRequest.BodyPublishers.noBody()' : `HttpRequest.BodyPublishers.ofString(${JSON.stringify(body)})`})
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode());
System.out.println(response.body());`;
  },
};

const PHP: CodeTarget = {
  id: 'php',
  labelKey: 'php',
  language: 'php',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `    '${esc.php(`${header.name}: ${header.value}`)}',`)
      .join('\n');

    return `${bodyNote(request, '//')}<?php

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => '${esc.php(request.url)}',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${request.method}',
    CURLOPT_TIMEOUT => ${Math.round(request.settings.timeoutMs / 1_000)},${request.settings.verifyTls ? '' : '\n    CURLOPT_SSL_VERIFYPEER => false,'}
    CURLOPT_HTTPHEADER => [
${headerLines}
    ],${body === null ? '' : `\n    CURLOPT_POSTFIELDS => '${esc.php(body)}',`}
]);

$response = curl_exec($curl);
$error = curl_error($curl);
curl_close($curl);

echo $error ?: $response;`;
  },
};

const CSHARP: CodeTarget = {
  id: 'csharp',
  labelKey: 'csharp',
  language: 'csharp',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .filter((header) => header.name.toLowerCase() !== 'content-type')
      .map((header) => `request.Headers.Add("${esc.double(header.name)}", "${esc.double(header.value)}");`)
      .join('\n');
    const contentType =
      headers(request).find((header) => header.name.toLowerCase() === 'content-type')?.value ??
      'application/json';

    return `${bodyNote(request, '//')}using System.Net.Http;
using System.Text;

var client = new HttpClient();
var request = new HttpRequestMessage(new HttpMethod("${request.method}"), "${esc.double(request.url)}");
${headerLines}${
      body === null
        ? ''
        : `\nrequest.Content = new StringContent(${JSON.stringify(body)}, Encoding.UTF8, "${esc.double(contentType.split(';')[0] ?? 'application/json')}");`
    }

var response = await client.SendAsync(request);
Console.WriteLine((int)response.StatusCode);
Console.WriteLine(await response.Content.ReadAsStringAsync());`;
  },
};

const SWIFT: CodeTarget = {
  id: 'swift',
  labelKey: 'swift',
  language: 'swift',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map(
        (header) =>
          `request.setValue("${esc.double(header.value)}", forHTTPHeaderField: "${esc.double(header.name)}")`,
      )
      .join('\n');

    return `${bodyNote(request, '//')}import Foundation

var request = URLRequest(url: URL(string: "${esc.double(request.url)}")!)
request.httpMethod = "${request.method}"
request.timeoutInterval = ${(request.settings.timeoutMs / 1_000).toFixed(1)}
${headerLines}${body === null ? '' : `\nrequest.httpBody = ${JSON.stringify(body)}.data(using: .utf8)`}

let (data, response) = try await URLSession.shared.data(for: request)
print((response as? HTTPURLResponse)?.statusCode ?? 0)
print(String(data: data, encoding: .utf8) ?? "")`;
  },
};

const KOTLIN: CodeTarget = {
  id: 'kotlin',
  labelKey: 'kotlin',
  language: 'kotlin',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `    .addHeader("${esc.double(header.name)}", "${esc.double(header.value)}")`)
      .join('\n');

    return `${bodyNote(request, '//')}import okhttp3.*

val client = OkHttpClient()
${body === null ? '' : `\nval body = ${JSON.stringify(body)}.toRequestBody()\n`}
val request = Request.Builder()
    .url("${esc.double(request.url)}")
    .method("${request.method}", ${body === null ? 'null' : 'body'})
${headerLines}
    .build()

client.newCall(request).execute().use { response ->
    println(response.code)
    println(response.body?.string())
}`;
  },
};

const DART: CodeTarget = {
  id: 'dart',
  labelKey: 'dart',
  language: 'dart',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `  '${esc.single(header.name)}': '${esc.single(header.value)}',`)
      .join('\n');

    return `${bodyNote(request, '//')}import 'package:http/http.dart' as http;

final response = await http.${request.method.toLowerCase() === 'get' ? 'get' : request.method.toLowerCase()}(
  Uri.parse('${esc.single(request.url)}'),
  headers: {
${headerLines}
  },${body === null ? '' : `\n  body: ${JSON.stringify(body)},`}
);

print(response.statusCode);
print(response.body);`;
  },
};

const RUBY: CodeTarget = {
  id: 'ruby',
  labelKey: 'ruby',
  language: 'ruby',
  generate: (request) => {
    const body = bodyText(request);
    const headerLines = headers(request)
      .map((header) => `request['${esc.single(header.name)}'] = '${esc.single(header.value)}'`)
      .join('\n');

    return `${bodyNote(request, '#')}require 'net/http'
require 'uri'

uri = URI('${esc.single(request.url)}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'
http.read_timeout = ${Math.round(request.settings.timeoutMs / 1_000)}

request = Net::HTTP::${request.method.charAt(0)}${request.method.slice(1).toLowerCase()}.new(uri)
${headerLines}${body === null ? '' : `\nrequest.body = ${JSON.stringify(body)}`}

response = http.request(request)
puts response.code
puts response.body`;
  },
};

/**
 * Every target, in the order the picker shows them: the two most used first,
 * then by language name.
 */
export const CODE_TARGETS: readonly CodeTarget[] = [
  CURL,
  FETCH,
  AXIOS,
  NODE,
  PYTHON,
  GO,
  JAVA,
  PHP,
  CSHARP,
  SWIFT,
  KOTLIN,
  DART,
  RUBY,
];

export function generateCode(targetId: string, request: ExecutionRequest): string | null {
  const target = CODE_TARGETS.find((entry) => entry.id === targetId);
  return target ? target.generate(request) : null;
}
