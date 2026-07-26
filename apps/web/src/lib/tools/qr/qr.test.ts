import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import * as enc from './encode';
import { QR_TYPES, QR_TYPES_BY_ID, isComplete, typesForCategory } from './registry';

/**
 * QR engine tests. The encoders are the load-bearing part - a scanner is
 * unforgiving about grammar - so each is asserted against the exact string its
 * standard requires, including the escaping that stops user input from breaking
 * the payload.
 */

describe('url / phone normalisation', () => {
  it('adds https to a bare domain but leaves an http(s) url alone', () => {
    assert.equal(enc.normalizeUrl('example.com'), 'https://example.com');
    assert.equal(enc.normalizeUrl('http://a.com'), 'http://a.com');
    assert.equal(enc.normalizeUrl('https://a.com/x?y=1'), 'https://a.com/x?y=1');
  });
  it('reduces a phone number to + and digits', () => {
    assert.equal(enc.normalizePhone('+1 (555) 000-1234'), '+15550001234');
    assert.equal(enc.normalizePhone('555.000.1234'), '5550001234');
  });
});

describe('scheme encoders', () => {
  it('tel / mailto / smsto', () => {
    assert.equal(enc.encodePhone('+15550001234'), 'tel:+15550001234');
    assert.equal(enc.encodeEmail({ to: 'a@b.com' }), 'mailto:a@b.com');
    assert.equal(
      enc.encodeEmail({ to: 'a@b.com', subject: 'Hi there', body: 'x&y' }),
      'mailto:a@b.com?subject=Hi+there&body=x%26y',
    );
    assert.equal(enc.encodeSms({ phone: '+15550001234', message: 'yo' }), 'SMSTO:+15550001234:yo');
  });
  it('whatsapp strips the + and url-encodes the text', () => {
    assert.equal(
      enc.encodeWhatsApp({ phone: '+15550001234', message: 'hi you' }),
      'https://wa.me/15550001234?text=hi%20you',
    );
  });
});

describe('wifi grammar', () => {
  it('builds a WPA payload and escapes reserved characters', () => {
    assert.equal(enc.encodeWifi({ ssid: 'Cafe', password: 'pass123' }), 'WIFI:T:WPA;S:Cafe;P:pass123;;');
    assert.equal(
      enc.encodeWifi({ ssid: 'My;Net', password: 'a,b:c' }),
      'WIFI:T:WPA;S:My\\;Net;P:a\\,b\\:c;;',
    );
  });
  it('omits the password for an open network and marks hidden', () => {
    assert.equal(enc.encodeWifi({ ssid: 'Open', encryption: 'nopass', hidden: true }), 'WIFI:T:nopass;S:Open;H:true;;');
  });
});

describe('vcard', () => {
  it('emits a valid vCard 3.0 with only the fields provided', () => {
    const card = enc.encodeVCard({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@x.com' });
    assert.match(card, /^BEGIN:VCARD\nVERSION:3\.0\n/);
    assert.match(card, /\nN:Lovelace;Ada;;;\n/);
    assert.match(card, /\nFN:Ada Lovelace\n/);
    assert.match(card, /\nEMAIL:ada@x\.com\n/);
    assert.match(card, /\nEND:VCARD$/);
    assert.equal(card.includes('ORG:'), false); // org not supplied
  });
});

describe('event / geo / upi', () => {
  it('event stamps iCalendar times and escapes text', () => {
    const ev = enc.encodeEvent({ title: 'Launch, v1', start: '2026-08-01T09:30', end: '2026-08-01T10:30' });
    assert.match(ev, /DTSTART:20260801T093000/);
    assert.match(ev, /DTEND:20260801T103000/);
    assert.match(ev, /SUMMARY:Launch\\, v1/);
  });
  it('geo and upi', () => {
    assert.equal(enc.encodeGeo({ lat: '37.77', lng: '-122.41' }), 'geo:37.77,-122.41');
    assert.equal(
      enc.encodeUpi({ vpa: 'me@bank', name: 'Jane Doe', amount: '100', note: 'Table 4' }),
      'upi://pay?pa=me%40bank&cu=INR&pn=Jane%20Doe&am=100&tn=Table%204',
    );
  });
});

describe('social handles', () => {
  it('normalises a bare handle and passes a full url through', () => {
    assert.equal(enc.encodeSocial('https://instagram.com/', '@ada'), 'https://instagram.com/ada');
    assert.equal(enc.encodeSocial('https://x.com/', 'https://x.com/ada'), 'https://x.com/ada');
  });
});

describe('registry', () => {
  it('every type builds a non-empty payload from its required fields', () => {
    for (const type of QR_TYPES) {
      const values: Record<string, string> = {};
      for (const field of type.fields) if (field.required) values[field.name] = '1';
      assert.equal(isComplete(type, values), true, `${type.id} should be complete`);
      assert.ok(type.build(values).length > 0, `${type.id} should build a payload`);
    }
  });
  it('indexes by id and filters by category', () => {
    assert.equal(QR_TYPES_BY_ID.wifi?.category, 'wifi');
    assert.ok(typesForCategory('basic').length >= 5);
    assert.equal(isComplete(QR_TYPES_BY_ID.url!, {}), false); // url is required
  });
});
