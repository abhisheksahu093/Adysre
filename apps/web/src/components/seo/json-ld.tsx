import type { JsonLdObject } from '@/lib/seo/structured-data';

/**
 * Renders a schema.org graph as a JSON-LD data block.
 *
 * `dangerouslySetInnerHTML` is unavoidable and correct here: React escapes text
 * children as HTML entities, which turns a perfectly good `&` inside a
 * description into `&amp;` and leaves crawlers parsing broken JSON. The payload
 * is not user input, and the one sequence that could escape the element is
 * neutralised below.
 *
 * Renders nothing visible, so it can sit anywhere in the tree. Convention is
 * near the top of the page it describes.
 */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      // The `<` is the whole attack surface of an inline data block: a value
      // containing `</script>` would close the element early and let whatever
      // follows be parsed as markup. Escaping every `<` as its unicode form
      // keeps the JSON identical to a parser and inert to the HTML tokeniser.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
