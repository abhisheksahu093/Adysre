import { BadgeCheck, Leaf, Truck, MonitorSmartphone } from 'lucide-react';
import { tavolaHref, type TavolaCategory, type TavolaCopy, type TavolaDish, type TavolaPost, type TavolaReview, type TavolaStep } from './tavola-kitchen-content';
import type { TemplateContent } from './types';

/**
 * TAVOLA - the same restaurant, in Japanese.
 *
 * Structurally identical to the English module BY CONTRACT: same ids, same
 * hrefs, same prices, same array order. Ids drive the menu filter, the basket
 * and `?page=` routing, so a drifted id would break the site silently and only
 * in one language. `tavola-locale-parity.test.ts` asserts it.
 *
 * Only human-readable text differs. Prices are absent from this file on
 * purpose - they are shared numbers converted at render, and a translated price
 * would be a different restaurant.
 *
 * Copy is written as Japanese, not transliterated English: 「本日の仕入れ」 rather
 * than a literal rendering of "market produce daily". Dish names keep the
 * original where a Japanese diner would expect it (a menu says リガトーニ), and
 * translate where they would not.
 */

export const TAVOLA_CATEGORIES_JA: TavolaCategory[] = [
  { id: 'signature', label: 'シグネチャー' },
  { id: 'pasta', label: 'パスタ' },
  { id: 'grill', label: '炭火' },
  { id: 'garden', label: '野菜' },
  { id: 'dessert', label: 'デザート' },
];

export const TAVOLA_DISHES_JA: TavolaDish[] = [
  {
    id: 'harvest-bowl',
    categoryId: 'garden',
    name: 'ハーベスト グレインボウル',
    blurb: '炭火のブロッコリーニ、ファッロ、半熟卵。レモンタヒニとデュカを添えて。',
    price: 16.5,
    rating: 4.8,
    reviews: 214,
    minutes: 15,
    palette: 'herb',
    badge: 'シェフのおすすめ',
  },
  {
    id: 'san-marzano',
    categoryId: 'pasta',
    name: 'サンマルツァーノのリガトーニ',
    blurb: 'じっくり煮込んだトマト、ちぎりバジル、熟成ペコリーノ、唐辛子バターをひとさじ。',
    price: 26.88,
    rating: 4.9,
    reviews: 388,
    minutes: 20,
    palette: 'tomato',
    badge: '一番人気',
  },
  {
    id: 'wild-mushroom',
    categoryId: 'pasta',
    name: '茸のタリアテッレ',
    blurb: '手打ちの生パスタ、ジロール茸、タイムのクリーム、黒トリュフを削って。',
    price: 55.0,
    rating: 4.9,
    reviews: 176,
    minutes: 22,
    palette: 'char',
  },
  {
    id: 'coal-chicken',
    categoryId: 'grill',
    name: '炭火ロースト チキン',
    blurb: '一晩ブラインし、熾火でじっくり。焦がしレモンとグリーンソースを添えて。',
    price: 32.4,
    rating: 4.7,
    reviews: 291,
    minutes: 28,
    palette: 'saffron',
  },
  {
    id: 'saffron-risotto',
    categoryId: 'signature',
    name: 'サフランのリゾット',
    blurb: 'カルナローリ米、骨髄バター、白ワインで開かせたサフラン。',
    price: 29.6,
    rating: 4.8,
    reviews: 152,
    minutes: 25,
    palette: 'saffron',
  },
  {
    id: 'sea-bream',
    categoryId: 'grill',
    name: '真鯛の塩釜焼き',
    blurb: '塩釜で焼き上げ、席で開きます。フェンネル、ケッパー、ブラッドオレンジと。',
    price: 41.0,
    rating: 4.9,
    reviews: 118,
    minutes: 30,
    palette: 'cream',
  },
  {
    id: 'garden-burrata',
    categoryId: 'garden',
    name: 'ブッラータと在来種トマト',
    blurb: 'プーリア産ブッラータ、その朝に摘んだトマト、バジルオイル、サワードゥのクラム。',
    price: 16.7,
    rating: 4.6,
    reviews: 203,
    minutes: 10,
    palette: 'tomato',
  },
  {
    id: 'olive-focaccia',
    categoryId: 'signature',
    name: 'ローズマリーのフォカッチャ',
    blurb: '24時間発酵。タジャスカオリーブ、海塩、新オイルで。',
    price: 10.7,
    rating: 4.7,
    reviews: 264,
    minutes: 8,
    palette: 'cream',
  },
  {
    id: 'chocolate-tart',
    categoryId: 'dessert',
    name: 'ビターチョコレートのタルト',
    blurb: 'カカオ70%のガナッシュ、オリーブオイル、海塩、サワークリーム。',
    price: 12.5,
    rating: 4.8,
    reviews: 187,
    minutes: 12,
    palette: 'char',
  },
  {
    id: 'fig-cheesecake',
    categoryId: 'dessert',
    name: 'いちじくの葉のチーズケーキ',
    blurb: '低温でゆっくり焼き、いちじくの葉を移して。ローストした秋いちじくと。',
    price: 13.8,
    rating: 4.7,
    reviews: 142,
    minutes: 12,
    palette: 'berry',
  },
  {
    id: 'short-rib',
    categoryId: 'grill',
    name: '牛ショートリブの赤ワイン煮',
    blurb: 'バローロで6時間、一晩プレス。仕上げに照りをかけ、燻製マッシュを添えて。',
    price: 38.5,
    rating: 4.9,
    reviews: 226,
    minutes: 26,
    palette: 'berry',
  },
  {
    id: 'citrus-salad',
    categoryId: 'garden',
    name: '冬柑橘とチコリ',
    blurb: 'ブラッドオレンジ、ピンクグレープフルーツ、苦味のある葉、ピスタチオ、蜂蜜ビネガー。',
    price: 14.2,
    rating: 4.5,
    reviews: 96,
    minutes: 10,
    palette: 'saffron',
  },
];

export const TAVOLA_STEPS_JA: TavolaStep[] = [
  {
    id: 'quality',
    title: '料理の質',
    body: 'メニューはひとつ、すべて注文を受けてから。作り置きも保温もしません。',
    },
  {
    id: 'fresh',
    title: '新鮮な食材',
    body: '朝6時に市場の箱が届きます。その日の出来が悪ければ、その皿は外します。',
  },
  {
    id: 'delivery',
    title: '最速の配達',
    body: '保温ボックス、半径3キロ、8分以内に配達員が出ます。',
  },
  {
    id: 'order',
    title: '簡単な注文',
    body: 'メニューから玄関まで4タップ。前回のご注文は保存されます。',
  },
];

export const TAVOLA_POSTS_JA: TavolaPost[] = [
  {
    id: 'ember',
    title: '熾火で焼くと、何が変わるのか',
    excerpt:
      '直火は飾りではありません。肉の水分の保ち方が変わります。だからチキンは11分休ませてからお出しします。',
    date: '2026年9月16日',
    readMinutes: 10,
    author: 'マルコ・ベッリ',
    palette: 'char',
  },
  {
    id: 'market',
    title: '市場をまわる朝',
    excerpt:
      '6軒の生産者、1台のバン、そして箱ごとの判断。夜に読むメニューは、8時前に決まっています。',
    date: '2026年9月16日',
    readMinutes: 10,
    author: 'アナ・ルイス',
    palette: 'herb',
  },
  {
    id: 'pasta',
    title: 'パスタを1日2回のばす理由',
    excerpt:
      '打ったての生地は数時間で硬くなります。10時と16時にのばすことが、絹と厚紙の差になります。',
    date: '2026年9月16日',
    readMinutes: 10,
    author: 'マルコ・ベッリ',
    palette: 'saffron',
  },
];

export const TAVOLA_REVIEWS_JA: TavolaReview[] = [
  {
    id: 'r1',
    quote:
      '8人分を注文しました。すべて温かく、密封され、名前が書かれて届きました。リガトーニは、店で出されるものより良かったほどです。',
    name: 'プリヤ・ラマン',
    role: '今月2回利用',
    rating: 4.5,
    date: '2026年12月20日',
  },
  {
    id: 'r2',
    quote:
      '誕生日に予約しました。ナッツアレルギーの備考をきちんと読んでくれて、言わなくても別のデザートが出てきました。',
    name: 'ダニエル・オカフォー',
    role: '6名で来店',
    rating: 5,
    date: '2026年12月26日',
  },
  {
    id: 'r3',
    quote:
      'ショートリブのおかげで金曜に料理をしなくなりました。30分と言われて22分。普通はありえません。',
    name: '田中 芽衣',
    role: '2024年からの常連',
    rating: 4.5,
    date: '2026年12月30日',
  },
];

export const TAVOLA_COPY_JA: TavolaCopy = {
  common: {
    mainNav: 'メインナビゲーション',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
    cart: 'カート',
    cartCount: '点',
    signIn: 'ログイン',
    signUp: '新規登録',
    order: '注文する',
    currencyLabel: '通貨',
    languageLabel: '言語',
    addToCart: 'カートに入れる',
    added: '追加しました',
    from: 'より',
    minutes: '分',
    reviews: '件のレビュー',
    readMore: '続きを読む',
    viewAll: 'メニューをすべて見る',
    previous: '前へ',
    next: '次へ',
  },
  home: {
    heroBadge: '営業中 · 11:00 – 23:00',
    heroDiscount: '2品ご注文で15%オフ',
    heroDelivery: '配達 20分',
    heroReviews: 'レビュー2,400件以上',
    dishesEyebrow: '本日の一皿',
    dishesTitle: '人気の料理',
    stepsEyebrow: '要点だけ',
    stepsTitle: 'ご利用の流れ',
    stepsSubtitle: '市場からお客様の玄関まで、妥協しない4つのこと。',
    simpleEyebrow: 'タヴォラについて',
    simpleTitle: 'おいしさを、いちばん簡単に',
    simpleBody:
      'ひとつの厨房、ひとつのメニュー、そのために作られた店。テーブルでも、カウンターでも、ご自宅でも、厨房を出るときの状態は同じです。',
    simplePoints: ['オンライン注文', '事前予約', '豊富なメニュー', '年中無休の対応'],
    blogEyebrow: '厨房から',
    blogTitle: '最新のブログ',
    reviewsEyebrow: 'お客様の声',
    reviewsTitle: 'お客様の反応',
  },
  menu: {
    title: 'メニュー',
    subtitle: 'すべて注文を受けてから調理します。価格はヘッダーで通貨を選ぶと切り替わります。',
    all: 'すべて',
    empty: 'この条件に合う料理はまだありません。',
    count: '{count}品',
  },
  services: {
    title: 'ご提供の方法',
    subtitle: '同じ厨房へ、4つの経路。どの経路も、料理を作った本人が担当します。',
  },
  blog: {
    title: '厨房から',
    subtitle: '食材、火、そして皿に届くまでの小さな判断について。',
    readTime: '分で読めます',
    by: '文 ·',
  },
  contact: {
    title: 'テーブルのご予約',
    subtitle: '日時と人数をお知らせください。営業中は1時間以内にご返信します。',
    name: 'お名前',
    email: 'メールアドレス',
    guests: '人数',
    date: 'ご希望の日付',
    notes: 'ご要望など',
    submit: '予約を申し込む',
    sent: 'ありがとうございます。追ってメールでご連絡します。',
    hours: '営業時間',
    hoursValue: ['月 – 木 · 11:00 – 22:00', '金 – 土 · 11:00 – 23:30', '日 · 12:00 – 21:00'],
    address: '所在地',
    addressValue: 'ロンドン E2 8AA プロスペクト通り18',
    phone: '電話',
    phoneValue: '+44 20 7946 0812',
  },
  cart: {
    title: 'カート',
    empty: 'カートは空です。',
    emptyCta: 'メニューを見る',
    item: '商品',
    quantity: '数量',
    remove: '削除',
    subtotal: '小計',
    delivery: '配送料',
    deliveryFree: '40以上で無料',
    total: '合計',
    checkout: 'レジに進む',
    note: '価格は固定の参考レートで換算しています。公開前に自社のレートに差し替えてください。',
  },
};

export const TAVOLA_CONTENT_JA: TemplateContent = {
  brand: 'Tavola',
  nav: [
    { href: tavolaHref('home'), label: 'ホーム' },
    { href: tavolaHref('menu'), label: 'メニュー' },
    { href: tavolaHref('services'), label: 'サービス' },
    { href: tavolaHref('blog'), label: 'ブログ' },
    { href: tavolaHref('contact'), label: 'お問い合わせ' },
  ],
  hero: {
    badge: '営業中 · 11:00 – 23:00',
    title: '厨房から、',
    titleAccent: 'あなたの食卓へ',
    subtitle:
      '街の中心にある小さな厨房で、ひとつのメニューを注文ごとに仕上げます。店内にも、カウンターにも、ご自宅にも。',
    ctaPrimary: '料理を見る',
    ctaSecondary: '席を予約する',
    stats: [
      { value: 20, suffix: '分', label: '平均配達時間' },
      { value: 2400, suffix: '件以上', label: 'レビュー' },
      { value: 12, suffix: '品', label: '本日のメニュー' },
    ],
  },
  marquee: ['注文ごとに調理', '毎日の市場仕入れ', '炭火のグリル', '20分でお届け', '1日2回のパスタ'],
  about: {
    eyebrow: 'タヴォラについて',
    title: 'おいしさを、いちばん簡単に',
    body: [
      'ひとつの厨房、ひとつのメニュー、そのために作られた店。作り置きはせず、保温もしません。',
      'テーブルでも、カウンターでも、ご自宅でも、厨房を出るときの状態は同じです。',
    ],
    points: ['オンライン注文', '事前予約', '豊富なメニュー', '年中無休の対応'],
  },
  services: {
    eyebrow: '要点だけ',
    title: 'ご利用の流れ',
    subtitle: '市場からお客様の玄関まで、妥協しない4つのこと。',
    items: [
      {
        icon: BadgeCheck,
        title: '料理の質',
        body: 'メニューはひとつ、すべて注文を受けてから。作り置きも保温もしません。',
      },
      {
        icon: Leaf,
        title: '新鮮な食材',
        body: '朝6時に市場の箱が届きます。その日の出来が悪ければ、その皿は外します。',
      },
      {
        icon: Truck,
        title: '最速の配達',
        body: '保温ボックス、半径3キロ、8分以内に配達員が出ます。',
      },
      {
        icon: MonitorSmartphone,
        title: '簡単な注文',
        body: 'メニューから玄関まで4タップ。前回のご注文は保存されます。',
      },
    ],
  },
  why: {
    eyebrow: '本日の一皿',
    title: '人気の料理',
    subtitle: '厨房がいちばん多く送り出す皿と、店が知られている皿。',
    items: [
      {
        icon: BadgeCheck,
        title: 'サンマルツァーノのリガトーニ',
        body: 'じっくり煮込んだトマト、ちぎりバジル、熟成ペコリーノ、唐辛子バターをひとさじ。',
      },
      {
        icon: Leaf,
        title: 'ハーベスト グレインボウル',
        body: '炭火のブロッコリーニ、ファッロ、半熟卵。レモンタヒニとデュカを添えて。',
      },
      {
        icon: Truck,
        title: '炭火ロースト チキン',
        body: '一晩ブラインし、熾火でじっくり。焦がしレモンとグリーンソースを添えて。',
      },
    ],
  },
  faq: {
    eyebrow: 'ご注文の前に',
    title: 'よくあるご質問',
    items: [
      {
        question: '配達はどこまで対応していますか。',
        answer:
          '厨房から半径3キロまでです。この範囲なら箱の中で20分を超えません。それより遠い場合は、店までお越しいただくほうが良い状態でお出しできます。',
      },
      {
        question: 'アレルギーに対応してもらえますか。',
        answer:
          'はい。テーブルでではなく、ご注文の時点でお知らせいただけると確実です。すべて注文後に調理するため、変更はたいてい問題ありません。',
      },
      {
        question: '予約なしでも入れますか。',
        answer:
          'カウンターは毎営業日、予約なしのお客様のために空けています。テーブルは、特に木曜から土曜はご予約をおすすめします。',
      },
      {
        question: 'どの通貨で表示できますか。',
        answer:
          '4通貨で表示できるので、どなたにも金額をお伝えできます。お支払いは決済時に現地通貨で確定します。',
      },
    ],
  },
  contact: {
    eyebrow: 'テーブルのご予約',
    title: '日時と人数をお知らせください',
    subtitle: '営業中は1時間以内にご返信します。',
    fields: { name: 'お名前', email: 'メールアドレス', message: 'ご要望など' },
    submit: '予約を申し込む',
    details: [
      { label: '所在地', value: 'ロンドン E2 8AA プロスペクト通り18' },
      { label: '電話', value: '+44 20 7946 0812' },
      { label: 'メール', value: 'pass@tavola.restaurant' },
    ],
  },
  footer: {
    tagline: 'ひとつの厨房で、注文ごとに。厨房から、あなたの食卓へ。',
    columns: [
      { title: 'サイト', links: ['ホーム', 'メニュー', 'サービス', 'ブログ', 'お問い合わせ'] },
      { title: '規約', links: ['利用規約', 'プライバシー', 'クッキー', 'ライセンス', 'アレルギー'] },
      { title: '会社', links: ['会社概要', 'コミュニティ', 'ブログ', '採用', '生産者'] },
    ],
    legal: 'Tavola Kitchen. All rights reserved.',
  },
};
