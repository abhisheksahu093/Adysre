/**
 * The email contract, kept free of any provider's vocabulary.
 *
 * Pure types and no imports, so both the transports and the templates can
 * depend on this without depending on each other.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  /**
   * Plain text body. Required, never optional.
   *
   * A text part is not a courtesy: some clients render it in preference to
   * HTML, and spam filters score HTML-only mail worse, which is how a password
   * reset ends up in a junk folder. Writing it is also the cheapest way to
   * confirm the message still makes sense when the styling is gone.
   */
  text: string;
  html: string;
}

/**
 * Somewhere to send mail.
 *
 * `send` resolves to whether delivery was accepted, and MUST NOT throw.
 * Callers are request handlers that have already done their real work: a
 * password has been reset or an account created, and an unreachable mail
 * provider must not undo that or turn it into a 500.
 */
export interface EmailTransport {
  /** Shown in logs so it is obvious which one is active. */
  readonly name: string;
  send(message: EmailMessage): Promise<boolean>;
}
