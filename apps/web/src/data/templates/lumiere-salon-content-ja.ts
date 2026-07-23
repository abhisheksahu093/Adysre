import {
  Flower2,
  GraduationCap,
  HandHeart,
  Leaf,
  Scissors,
  Sparkles,
  Timer,
  Waves,
} from 'lucide-react';
import { lumiereHref } from './lumiere-salon-content';
import type {
  LumiereProduct,
  LumiereProductCategory,
  LumiereSalonCopy,
  LumiereServiceCategory,
  LumiereStylist,
} from './lumiere-salon-content';
import type { TemplateContent } from './types';

/**
 * LUMIERE - Japanese content.
 *
 * Why this module exists: the salon template's header carries a locale switch,
 * and the switch has to hand the renderer a *whole* content object rather than
 * translate strings one at a time. A section that reads
 * `content.hero.title` must get Japanese from the same shape it got English
 * from, so the locale is chosen once at the top and every section below is
 * unaware that a second language exists. This file is that second object.
 *
 * Structure is deliberately a mirror, not a variation:
 *
 * 1. Every type is IMPORTED from `./lumiere-salon-content` rather than
 *    re-declared here. A translated catalogue that grows a field the English
 *    one does not have is a catalogue the components cannot render, and
 *    importing the types makes that a compile error rather than a blank panel.
 * 2. `lumiereHref` is imported for the same reason: the nav's hrefs are page
 *    ids, and a hand-written `?page=...` in a translation is a broken link
 *    waiting for the first person who switches language on the shop page.
 *
 * !! Id parity !!
 * Only human-readable text is translated. Every `id`, `href`, `art` key,
 * `vessel` key, variant key, category id, product id, `<select>` option
 * `value`, and every number (price, duration, size) is byte-identical to the
 * English module and must stay that way. The shop filters products by
 * `category`, the basket looks lines up by `productId` + `variantId`, the CSS
 * paints an arch from `art` and a bottle from `vessel`, and the booking form
 * posts option values - all of that is keyed on ids that are shared across
 * locales. Translate an id and the page keeps rendering while quietly showing
 * nothing. Array order and length are part of the same contract: the two
 * catalogues are read positionally when a locale switch preserves the product
 * a visitor was looking at.
 *
 * Prices keep the English numeral and the `£` symbol wherever they appear in
 * prose. Currency is a separate concern with its own formatter, and a hardcoded
 * yen figure here would disagree with it the moment it is switched on.
 */

/* ------------------------------------------------------------- treatments */

export const LUMIERE_SERVICE_CATEGORIES_JA: LumiereServiceCategory[] = [
  {
    id: 'hair',
    name: 'ヘア',
    tagline: 'ドライカットで形を決め、手で仕上げます。ご自宅でも同じように落ちる髪へ。',
    art: 'petal',
    treatments: [
      {
        id: 'signature-cut',
        name: 'シグネチャーカット＆仕上げ',
        duration: 75,
        price: 96,
        description:
          '自然光の下でのカウンセリング、スキャルプマッサージを添えたシャンプー、そしてドライカット。普段どおりに動く髪の状態で形を見極めます。',
        note: 'シニアスタイリスト',
      },
      {
        id: 'restyle',
        name: 'リスタイル相談＆カット',
        duration: 105,
        price: 148,
        description:
          '長さや方向を変えたい方へ。コームを手に取る前に30分、伺いながら見極めます。保ち方は書面にしてお渡しします。',
        note: 'ディレクター',
      },
      {
        id: 'gloss-refresh',
        name: 'グロス＆トーン リフレッシュ',
        duration: 45,
        price: 68,
        description:
          'アンモニアを含まないデミパーマネントのグロス。キューティクルを閉じ、赤みや黄みを整え、今の明度を動かさずにツヤだけを足します。',
      },
      {
        id: 'balayage',
        name: 'ハンドペイント バレイヤージュ',
        duration: 180,
        price: 265,
        description:
          '中間から毛先へフリーハンドでリフトし、根元をぼかして塗布します。伸びてきた境目が4〜5か月見えないまま保たれます。',
        note: 'グロス込み',
      },
      {
        id: 'blow-dry',
        name: 'ブロードライ＆セット',
        duration: 45,
        price: 52,
        description:
          'ロールブラシ、またはラップ巻きで。スプレーではなく軽いクリームで仕上げるので、お帰りのときも髪が動きます。',
      },
      {
        id: 'keratin',
        name: 'スムージングトリートメント',
        duration: 150,
        price: 210,
        description:
          'ホルムアルデヒド不使用のケラチン施術。乾かす時間がおよそ半分になり、多くの髪質で12〜16週間持続します。',
      },
    ],
  },
  {
    id: 'skin',
    name: 'スキン',
    tagline: 'オプションの足し算ではなく、診断から組み立てるフェイシャル。',
    art: 'halo',
    treatments: [
      {
        id: 'lumiere-facial',
        name: 'ルミエール フェイシャル',
        duration: 90,
        price: 165,
        description:
          'ダブルクレンズ、酵素による角質ケア、リンパマッサージ、冷たい磁器での仕上げ。プロトコルは拡大鏡での肌診断のあとに決めます。',
        note: 'ご予約最多',
      },
      {
        id: 'express-glow',
        name: 'エクスプレス ラディアンス フェイシャル',
        duration: 45,
        price: 88,
        description:
          '昼休みのリセット。クレンジング、8%のマンデル酸ピーリング、ヒアルロン酸マスク、SPF。赤みもダウンタイムもテカリも残しません。',
      },
      {
        id: 'barrier-repair',
        name: 'バリアリペア トリートメント',
        duration: 75,
        price: 142,
        description:
          'レチノイドや酸で敏感に傾いた肌へ。セラミドとオート脂質を重ね、冷却LEDを当てます。2週間分のホームケアは書面でお渡しします。',
      },
      {
        id: 'microneedling',
        name: 'マイクロチャネル コラーゲンセラピー',
        duration: 80,
        price: 235,
        description:
          '深度を調整できるマイクロニードリングとペプチド美容液を、4週間おきに3回のコースで。事前にパッチテストを行います。',
        note: 'パッチテスト必須',
      },
    ],
  },
  {
    id: 'body',
    name: 'ボディ',
    tagline: '室温は24度。携帯電話はフロントにお預けいただきます。',
    art: 'wave',
    treatments: [
      {
        id: 'deep-tissue',
        name: 'ディープティシュー マッサージ',
        duration: 60,
        price: 105,
        description:
          '肩、首、腰まわりをゆっくり深く。温めたアーニカとカンファーのオイルを使います。圧は初めに2度確認し、あとは変えません。',
      },
      {
        id: 'aromatherapy',
        name: 'アロマテラピー 全身',
        duration: 90,
        price: 148,
        description:
          '6種の単品オイルから施術の初めに1つをお選びいただき、足元から長く均一に。最後は温かいタオルで締めくくります。',
      },
      {
        id: 'body-polish',
        name: 'ローズ＆ソルト ボディポリッシュ',
        duration: 50,
        price: 92,
        description:
          'ウェットテーブルで、細かいカマルグ塩とローズオイルによる角質ケア。続けてシアとネロリのラップを巻き、頭皮をほぐします。',
      },
      {
        id: 'pregnancy',
        name: 'マタニティ マッサージ',
        duration: 60,
        price: 112,
        description:
          'クッションで支えた横向きの姿勢で、無香料のスイートアーモンドオイルを使います。安定期以降、担当の助産師をカルテに控えたうえで承ります。',
        note: '妊娠14週から',
      },
    ],
  },
  {
    id: 'hands',
    name: 'ハンド＆フット',
    tagline: '手でファイリングし、薄く塗り、しっかり硬化させる。',
    art: 'bloom',
    treatments: [
      {
        id: 'lumiere-manicure',
        name: 'ルミエール マニキュア',
        duration: 55,
        price: 58,
        description:
          'ドライファイル、ニッパーではなくオイルでの甘皮ケア、手と前腕のマッサージ、そして拭き取り式トップを重ねた薄い2度塗り。',
      },
      {
        id: 'gel-overlay',
        name: 'ジェルオーバーレイ＆カラー',
        duration: 70,
        price: 74,
        description:
          '自爪の上に乗せるソークオフジェルを、低発熱のライトで硬化させます。ご予約から4週間以内のオフは無料です。',
      },
      {
        id: 'spa-pedicure',
        name: 'スパ ペディキュア',
        duration: 75,
        price: 82,
        description:
          'ミルクとローズの温浴、ガラスファイルでの角質ケア、足とふくらはぎのマッサージ。仕上げはカラーか、自爪のバフ仕上げから。',
      },
    ],
  },
];

/* --------------------------------------------------------------- stylists */

/**
 * The same five people, in the same order, with the same ids.
 *
 * `initials` is display text rather than a key - it draws the CSS portrait -
 * so it follows the Japanese name here instead of keeping the French one.
 */
export const LUMIERE_STYLISTS_JA: LumiereStylist[] = [
  {
    id: 'camille',
    name: '白石 佳世',
    initials: 'KS',
    role: '創業者・クリエイティブディレクター',
    specialism: 'リスタイル、カーテンバング、伸びたカラーの補正',
    years: 19,
    days: '火曜〜金曜',
  },
  {
    id: 'noor',
    name: '相馬 玲奈',
    initials: 'RS',
    role: 'シニアカラリスト',
    specialism: 'ハンドペイントのバレイヤージュ、暗い髪のトーン設計',
    years: 12,
    days: '水曜〜土曜',
  },
  {
    id: 'ines',
    name: '三浦 詩織',
    initials: 'SM',
    role: 'チーフエステティシャン',
    specialism: 'バリアリペア、赤みの出やすい肌、施術後のケア',
    years: 15,
    days: '火曜・木曜・土曜',
  },
  {
    id: 'theo',
    name: '桐生 隼',
    initials: 'HK',
    role: 'マッサージセラピスト',
    specialism: 'ディープティシュー、顎と肩のこわばり、マタニティマッサージ',
    years: 9,
    days: '月曜・水曜・金曜',
  },
  {
    id: 'anyone',
    name: 'おまかせ',
    initials: 'OM',
    role: '指名なし',
    specialism: '施術に適した研修を受けたセラピストをこちらでお選びします',
    years: 0,
    days: '営業日はいつでも',
  },
];

/* --------------------------------------------------------------- products */

export const LUMIERE_PRODUCT_CATEGORIES_JA: LumiereProductCategory[] = [
  {
    id: 'hair',
    name: 'ヘア',
    description: 'シャンプー台で使っているものを、私たちが仕入れるのと同じサイズで。',
  },
  {
    id: 'skin',
    name: 'スキン',
    description: '有効成分と配合率を表面に記した、短い処方。',
  },
  {
    id: 'body',
    name: 'ボディ',
    description: 'グラースで調合し、ケントで瓶詰めするオイルとバーム。',
  },
  {
    id: 'fragrance',
    name: 'フレグランス',
    description: '施術室の香りと、その隣に置いた2つ。',
  },
];

export const LUMIERE_PRODUCTS_JA: LumiereProduct[] = [
  {
    id: 'lait-cleansing-milk',
    name: 'レ・ドゥスール クレンジングミルク',
    price: 42,
    category: 'skin',
    vessel: 'bottle',
    size: '200ml',
    blurb:
      '当店のすべてのフェイシャルで使うファーストクレンズ。日焼け止めも色素も、乾かすことなく浮かせ、膜を残さずすすげます。',
    ingredients: 'スイートアーモンドオイル、オート穀粒エキス、グリセリン6%、無香料',
    usage:
      '乾いた肌に2プッシュを1分ほどなじませ、水を足して乳化させ、やわらかい布ですすぎます。朝と夜に。',
    variants: [
      { id: 'rose', label: '無香料' },
      { id: 'neroli', label: 'ネロリ' },
    ],
    featured: true,
  },
  {
    id: 'serum-lumiere',
    name: 'セラム・ルミエール 12%',
    price: 78,
    category: 'skin',
    vessel: 'dropper',
    size: '30ml',
    blurb:
      'エアレス構造のアンバードロッパーに収めた安定型ビタミンC美容液。赤みを出さずに毎日使える、私たちが確かめられた上限の濃度です。',
    ingredients: 'エチルアスコルビン酸12%、フェルラ酸0.5%、ビタミンE、スクワラン',
    usage:
      '朝、清潔で乾いた肌に4滴。保湿の前に、必ずSPFと合わせてお使いください。直射日光を避けて保管を。',
    variants: [
      { id: 'amber', label: '30ml' },
      { id: 'champagne', label: '50ml 詰め替え' },
    ],
    featured: true,
  },
  {
    id: 'baume-nuit',
    name: 'ボーム・ニュイ バリアバーム',
    price: 56,
    category: 'skin',
    vessel: 'jar',
    size: '50ml',
    blurb:
      'ピーリングをした夜のための、そして何をつけてもしみる2月の2週間のための、厚みのあるオクルーシブバーム。',
    ingredients: 'セラミドNP、コレステロール、シアバター18%、パンテノール5%',
    usage:
      '夜の最後に、美容液の上から米粒大をやさしく押し込みます。2週間は毎晩、その後は必要に応じて。',
    variants: [
      { id: 'rose', label: '50ml ジャー' },
      { id: 'mauve', label: '15ml トラベル' },
    ],
    featured: false,
  },
  {
    id: 'huile-cheveux',
    name: 'ユイル・ド・フィニシオン ヘアオイル',
    price: 38,
    category: 'hair',
    vessel: 'dropper',
    size: '50ml',
    blurb:
      'ブロードライの最後にスタイリストが手に取るオイル。細い前髪にも軽く、午後になってもべたつきません。',
    ingredients: 'カメリアオイル、マルラオイル、ビタミンE、シリコーン不使用',
    usage:
      '手のひらで温めた2滴を、乾いた髪の毛先に通します。それでも毛先が浮くときだけ、3滴目を。',
    variants: [
      { id: 'champagne', label: 'オリジナル' },
      { id: 'amber', label: 'リッチ（硬い髪に）' },
    ],
    featured: true,
  },
  {
    id: 'masque-restaurateur',
    name: 'マスク・レストラトゥール',
    price: 46,
    category: 'hair',
    vessel: 'jar',
    size: '250ml',
    blurb:
      'ブリーチした髪のための、週に一度のボンドケアマスク。ジャーの中では濃厚に見えますが、根元を重くせずに流せます。',
    ingredients: '加水分解ケラチン、マレイン酸、ムルムルバター、カチオン性コンディショニング成分',
    usage:
      'タオルドライした髪の中間から毛先へ。5分置いて冷たい水で流します。週に1回、ブリーチのあとは週に2回。',
    variants: [
      { id: 'rose', label: '250ml' },
      { id: 'mauve', label: '500ml サロンサイズ' },
    ],
    featured: true,
  },
  {
    id: 'shampooing-clair',
    name: 'シャンプワン・クレール',
    price: 32,
    category: 'hair',
    vessel: 'bottle',
    size: '300ml',
    blurb:
      '泡立ちを抑えたサルフェートフリーのシャンプー。ツヤとトナーが長く残ります。必要なのは4プッシュではなく2プッシュです。',
    ingredients: 'ココグルコシド、グリセリン、ライスプロテイン、pH5.0',
    usage:
      '濡れた手で2プッシュを乳化させ、頭皮だけを洗い、1分かけてすすぎます。そのあとにマスクかコンディショナーを。',
    variants: [
      { id: 'champagne', label: '300ml' },
      { id: 'mauve', label: '1L 詰め替え' },
    ],
    featured: false,
  },
  {
    id: 'huile-corps',
    name: 'ユイル・ド・コール ローズ・エ・ネロリ',
    price: 64,
    category: 'body',
    vessel: 'bottle',
    size: '150ml',
    blurb:
      'ボディポリッシュで使うオイルを、きちんとしたガラスピペットとともに瓶詰めしました。瓶の外側を伝って垂れることがありません。',
    ingredients:
      'スイートアーモンドオイル、ローズヒップシードオイル、ネロリアブソリュート、ダマスクローズ',
    usage:
      '入浴直後の湿った肌に、手のひらで温めた4プッシュを、足首から上へ押し込むようになじませます。',
    variants: [
      { id: 'rose', label: 'ローズ＆ネロリ' },
      { id: 'amber', label: 'アンバー＆シダー' },
    ],
    featured: true,
  },
  {
    id: 'creme-mains',
    name: 'クレーム・マン リッシュ',
    price: 26,
    category: 'body',
    vessel: 'tube',
    size: '75ml',
    blurb:
      'どの施術室の洗面台にも置いてあります。すぐになじむので、そのまま携帯電話を手に取れます。',
    ingredients: 'シアバター12%、尿素5%、グリセリン、アラントイン',
    usage: '手を洗ったあとと就寝前に、少量を手の甲と甘皮になじませます。',
    variants: [
      { id: 'neroli', label: 'ネロリ' },
      { id: 'rose', label: '無香料' },
    ],
    featured: false,
  },
  {
    id: 'eau-de-parfum',
    name: 'オード パルファン オンズ',
    price: 118,
    category: 'fragrance',
    vessel: 'mist',
    size: '50ml',
    blurb:
      '午前11時、1階に流れている香り。白い花に温かなレジンを重ね、そこにつきものの甘さは置いていません。',
    ingredients: 'ネロリ、オレンジフラワーアブソリュート、イリスルート、ベンゾイン、シダー',
    usage:
      '手首ではなく鎖骨に2プッシュ。温度が安定する場所なので、ドライダウンが6時間ほど続きます。',
    variants: [
      { id: 'neroli', label: '50ml' },
      { id: 'champagne', label: '10ml パーススプレー' },
    ],
    featured: true,
  },
  {
    id: 'brume-oreiller',
    name: 'ブリューム・ドレイエ',
    price: 34,
    category: 'fragrance',
    vessel: 'mist',
    size: '100ml',
    blurb:
      'ラベンダーにベチバーを合わせたリネン＆ピローミスト。薬めいた印象にならず、静かに落ち着きます。',
    ingredients: 'ラバンジンオイル、ベチバー、カモミールエキス、アルコールフリー基剤',
    usage:
      '就寝の20分前に、枕とめくったシーツへ3プッシュ。アルコールフリーの基剤が乾くまでの時間です。',
    variants: [
      { id: 'mauve', label: 'ラベンダー＆ベチバー' },
      { id: 'amber', label: 'フィグリーフ' },
    ],
    featured: false,
  },
  {
    id: 'poudre-teint',
    name: 'プードル・タン ヴォワル',
    price: 48,
    category: 'skin',
    vessel: 'compact',
    size: '9g',
    blurb:
      '細かく挽いた仕上げ用パウダー、4つの明るさ。フェイシャルのあとそのまま打ち合わせに戻る方の肌を整えます。',
    ingredients: 'ライススターチ、シリカ、マイカ、タルク不使用・無香料',
    usage:
      'ブラシの腹で、顔の中心に払わず押さえるように。一度に厚く乗せず、2度に分けて重ねます。',
    variants: [
      { id: 'champagne', label: 'ヴォワル01 フェア' },
      { id: 'rose', label: 'ヴォワル02 ライト' },
      { id: 'amber', label: 'ヴォワル03 ミディアム' },
      { id: 'mauve', label: 'ヴォワル04 ディープ' },
    ],
    featured: false,
  },
  {
    id: 'gommage-corps',
    name: 'ゴマージュ セル・ド・カマルグ',
    price: 52,
    category: 'body',
    vessel: 'jar',
    size: '300g',
    blurb:
      'ボディポリッシュで使うソルトスクラブ。デコルテや二の腕の裏にも使える細かさに挽いています。',
    ingredients: 'カマルグ海塩、ローズオイル、ホホバエステル、マグネシウム',
    usage:
      'シャワーで湿った肌に、足元から円を描くようになじませ、石けんを使わずに流します。多くても週に2回。',
    variants: [
      { id: 'rose', label: '300g' },
      { id: 'mauve', label: '600g' },
    ],
    featured: false,
  },
];

/* -------------------------------------------------------------- salon copy */

export const LUMIERE_SALON_JA: LumiereSalonCopy = {
  common: {
    cart: 'カート',
    cartCount: 'カート内の商品点数',
    book: 'ご予約はこちら',
    addToCart: 'カートに入れる',
    added: 'カートに追加しました',
    free: '無料',
    from: '最低料金',
    duration: '所要時間',
    price: '料金',
    backToShop: 'ショップに戻る',
    demoNotice: 'デザインテンプレートです。ご予約は確保されず、料金も発生しません。',
    currencyLabel: '通貨',
    languageLabel: '言語',
    mainNav: 'メインナビゲーション',
    breadcrumbNav: 'パンくずリスト',
    marqueeLabel: 'お客さまの声',
    openMenu: 'メニューを開く',
    closeMenu: 'メニューを閉じる',
  },

  services: {
    masthead: {
      eyebrow: '施術メニュー',
      title: '4つの部屋、20分の対話、そして施術',
      subtitle:
        '記載の料金が、そのままお支払いいただく額です。カウンセリングは無料で、時間も区切りません。席に着いたお客さまに施術をお売りすることはいたしません。',
    },
    menuLabel: '施術一覧',
    bookTreatment: 'この施術を予約する',
    noteLabel: '備考',
    courseTitle: '3回のコース',
    courseBody:
      'フェイシャルとマイクロチャネルセラピーは、単発よりも続けて受けるほうが結果につながります。12週間以内に3回受けるコースは10%引きとし、前払いではなくご来店ごとにお支払いいただきます。',
    courseCta: 'コースについて相談する',
  },

  shop: {
    masthead: {
      eyebrow: 'ショップ',
      title: 'シャンプー台のものを、仕入れたままのサイズで',
      subtitle:
        'サロンのために調合した12の処方を、セラピストが手に取るのと同じ容器のまま販売しています。有効成分は配合率とともに、ラベルの表面に記しています。',
    },
    filterLabel: 'カテゴリーで絞り込む',
    allLabel: 'すべて',
    countOne: '点',
    countMany: '点',
    viewAll: '全ラインナップを見る',
  },

  product: {
    breadcrumb: 'ショップ',
    shopLabel: 'ショップ',
    variantLabel: '色みとサイズ',
    quantityLabel: '数量',
    decrease: '数量を減らす',
    increase: '数量を増やす',
    detailsTitle: '配合について',
    ingredientsLabel: '主な成分',
    usageLabel: '使い方',
    sizeLabel: '容量',
    relatedTitle: 'あわせて使うもの',
    relatedSubtitle:
      'セラピストがベッドの上で同じ順に重ねている、という理由で選んでいます。売れ筋の組み合わせではありません。',
  },

  cart: {
    masthead: {
      eyebrow: 'カート',
      title: 'お買い物かご',
      subtitle:
        '次のご来店時にサロンでお受け取りいただくか、ご自宅までお届けします。物販のご注文と施術のご予約は、別々に管理しています。',
    },
    empty: 'カートは空です。ショップに12の処方すべてがあります。',
    remove: '削除',
    removed: 'カートから削除しました',
    summaryTitle: 'ご注文内容',
    subtotal: '小計',
    shipping: '配送',
    shippingNote: '£75以上のご注文は送料無料。サロンでのお受け取りは無料です。',
    total: '合計',
    checkout: 'お支払いに進む',
    checkoutNote:
      'フロントエンドのデザインテンプレートのため、お支払いはこのページから先へ進みません。決済情報をお伺いすることは一切ありません。',
    lineTotalLabel: 'この商品の小計',
    continue: '買い物を続ける',
  },

  booking: {
    masthead: {
      eyebrow: 'ご予約',
      title: 'ご希望の施術と、ご都合のよい日時を',
      subtitle:
        'いただいたご依頼には、営業時間中であれば通常2時間以内に担当者が返信いたします。確認のご連絡を差し上げるまで、お席は確保されません。',
    },
    detailsTitle: 'ご希望の施術',
    aboutYouTitle: 'お客さま情報',
    serviceField: {
      id: 'lumiere-booking-service',
      label: '施術',
      type: 'select',
      autoComplete: 'off',
      placeholder: '施術をお選びください',
      hint: '迷われる場合は近いものをお選びください。こちらからご案内します。',
      /* No `options`: the treatment list is derived from the menu itself, so a
         second copy here could disagree with the page that prices it. */
    },
    stylistField: {
      id: 'lumiere-booking-stylist',
      label: '担当者',
      type: 'select',
      autoComplete: 'off',
      placeholder: '担当者をお選びください',
      /* Derived from `LUMIERE_STYLISTS_JA`, for the same reason. */
    },
    dateField: {
      id: 'lumiere-booking-date',
      label: 'ご希望日',
      type: 'date',
      autoComplete: 'off',
      placeholder: '',
      hint: '既存のお客さま向けに、当週分の枠を少数お残ししています。',
    },
    timeField: {
      id: 'lumiere-booking-time',
      label: 'ご希望の時間帯',
      type: 'select',
      autoComplete: 'off',
      placeholder: '時間帯をお選びください',
      options: [
        { value: 'morning-early', label: '午前 9:00〜11:00' },
        { value: 'morning-late', label: '午前遅め 11:00〜13:00' },
        { value: 'afternoon', label: '午後 13:00〜16:00' },
        { value: 'evening', label: '夕方 16:00〜19:30' },
      ],
    },
    personFields: [
      {
        id: 'lumiere-booking-name',
        label: 'お名前',
        type: 'text',
        autoComplete: 'name',
        placeholder: '山田 花子',
      },
      {
        id: 'lumiere-booking-email',
        label: 'メールアドレス',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
      },
      {
        id: 'lumiere-booking-phone',
        label: 'お電話番号',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '020 7946 0114',
        hint: 'ご予約の確認、または担当者の急な欠勤をお伝えする場合にのみ使用します。',
      },
    ],
    notesField: {
      id: 'lumiere-booking-notes',
      label: 'お伝えいただきたいこと',
      type: 'textarea',
      autoComplete: 'off',
      placeholder: 'アレルギー、カラーの履歴、ご妊娠、直近でブリーチをされた時期など。',
    },
    submit: '予約リクエストを送信',
    confirmed:
      'リクエストを受け付けました。デザインテンプレートのため、実際のご予約は確保されておらず、どなたにもご連絡はまいりません。',
    policyTitle: 'ご来店の前に',
    policyPoints: [
      'カラーおよびマイクロチャネル施術の前には、48時間以上前にパッチテストを行います',
      'ご予約の変更は24時間前までにご連絡ください。それ以降は施術料金の半額を申し受けます',
      '15分以上遅れてご到着の場合、次のお客さまではなく、当該施術の時間を短縮いたします',
      'サロン内へのお子さまのご同伴は歓迎いたしますが、施術室へはご入室いただけません',
    ],
  },

  contact: {
    masthead: {
      eyebrow: 'アクセス',
      title: 'チルターン・ストリートのタウンハウス、2フロアと中庭',
      subtitle:
        '営業時間中はフロントがお電話を承ります。時間外にお送りいただいたフォームも、同じ受信箱に届きます。',
    },
    formTitle: 'メッセージを送る',
    hoursTitle: '営業時間',
    hours: [
      { day: '月曜', open: '定休日' },
      { day: '火曜', open: '9:00〜18:00' },
      { day: '水曜', open: '9:00〜20:00' },
      { day: '木曜', open: '9:00〜20:00' },
      { day: '金曜', open: '9:00〜19:00' },
      { day: '土曜', open: '8:30〜17:00' },
      { day: '日曜', open: '定休日' },
    ],
    gettingHereTitle: '行き方',
    gettingHere: [
      'ベイカー・ストリート駅から徒歩6分、ボンド・ストリート駅から徒歩12分',
      'メリルボーン・ロードに2番・13番・30番・74番・274番のバスが停車します',
      'チルターン・ストリートの居住者用区画は18:30までアプリ決済制、日曜は無料です',
      '1階と中庭の施術室は段差がなく、2階へは階段のみとなります',
    ],
  },

  team: {
    eyebrow: 'スタッフ',
    title: '11人のうち、ご担当する可能性の高い4人',
    subtitle:
      'サロンが休みの月曜に、全員が研修を受けています。予約表が1日分減るのも、仕上がりが揺れないのも、その月曜のためです。',
    yearsLabel: '年のキャリア',
    daysLabel: '主な出勤日',
  },

  testimonials: [
    {
      quote: '数年ぶりに、3週間経ってもきちんと形の残るカットでした。',
      author: 'プリヤさま（2021年より）',
    },
    {
      quote:
        '三浦さんは肌をきちんと読んだうえで、私が頼むつもりでいたことの半分をやめさせてくれました。',
      author: 'ハンナさま（メリルボーン）',
    },
    {
      quote: 'バレイヤージュの配合をカルテに書き残してくれたので、次のときも寸分違わぬ仕上がりでした。',
      author: 'セシルさま（2019年より）',
    },
    {
      quote: '静かな部屋、最後の売り込みなし、そしてお茶は施術より先に出てきます。',
      author: 'マーカスさま（フィッツロヴィア）',
    },
    {
      quote: 'ぺたんとならずにスムージングが入りました。これまでどこでもできなかったことです。',
      author: 'イェミさま（2022年より）',
    },
  ],
};

/* ---------------------------------------------------- shared page content */

export const LUMIERE_CONTENT_JA: TemplateContent = {
  /* A brand is an identity, not a string: it stays Lumière in every locale. */
  brand: 'Lumière',

  nav: [
    { href: lumiereHref('services'), label: '施術メニュー' },
    { href: lumiereHref('shop'), label: 'ショップ' },
    { href: lumiereHref('booking'), label: 'ご予約' },
    { href: lumiereHref('contact'), label: 'アクセス' },
  ],

  hero: {
    badge: 'メリルボーン、チルターン・ストリート。火曜から土曜まで営業',
    title: '急がない美しさを、',
    titleAccent: '次のご来店まで',
    subtitle:
      'メリルボーンのタウンハウス2フロアを使った、サロン兼トリートメントハウス。ヘア、スキン、ボディ、ハンドの4分野に、その部屋のために調合した少数の処方を添えて。',
    ctaPrimary: 'ご予約はこちら',
    ctaSecondary: '施術メニューを見る',
    stats: [
      { value: 19, suffix: '年', label: '白石が2階を開いてから' },
      { value: 11, suffix: '', label: 'フロアに立つセラピストとスタイリスト' },
      { value: 92, suffix: '%', label: 'お帰りまでに次のご予約を取られるお客さま' },
    ],
  },

  marquee: [
    '冷たい磁器での仕上げ',
    'ハンドペイントのバレイヤージュ',
    'ホルムアルデヒド不使用のスムージング',
    'バリアリペアのプロトコル',
    'カマルグ塩のポリッシュ',
    '低発熱でのジェル硬化',
    '拡大鏡による肌診断',
    'グラース調合のオイル',
  ],

  about: {
    eyebrow: 'この家について',
    title: '一軒のタウンハウス、チェーンはなし、そして研修にあてる月曜',
    body: [
      '白石佳世が2007年、チルターン・ストリート34番地の2階を借りました。椅子は2台、かつて台所だった場所にシャンプー台を引いたところからの出発です。施術室は2014年、中庭の部屋は2019年、そしてボトルの中身を尋ねられ続けた末に、その翌年ショップを開きました。',
      '建物1軒、11人のまま続けているのは意図してのことです。カラーの配合を、調合した本人がカードに書き留められる規模。同じセラピストが、予約表を崩さずに3回のコースを見届けられる規模です。',
    ],
    points: [
      'カウンセリングは無料で、時間を区切らず、ご希望でない販売で終わることはありません',
      'カラーの配合、アレルギー、パッチテストの日付はカルテに残します',
      '月曜を休業日とし、全スタイリストが勤務扱いで研修を受けます',
    ],
  },

  services: {
    eyebrow: '私たちがすること',
    title: '4つの分野を、連携できるよう一つ屋根の下に',
    subtitle:
      '同じ週のカラーとバリアリペアのフェイシャルは、互いの内容を知っている必要があります。記録が一枚のカルテにまとまっているので、ここではそれができます。',
    items: [
      {
        icon: Scissors,
        title: 'ドライカットのヘア',
        body: '濡れた状態ではなく、実際に動く状態の髪で形を判断し、手で仕上げます。何でもない火曜日のご自宅でも、同じように落ちる髪へ。',
      },
      {
        icon: Sparkles,
        title: 'まず読むスキン',
        body: 'すべてのフェイシャルは、拡大鏡での診断と書面の記録から始まります。プロトコルはそのあとで決めるため、同じ内容は二つとありません。',
      },
      {
        icon: Waves,
        title: '本当に静かなボディ',
        body: '24度に保った2つの部屋。携帯電話はフロントにお預けいただきます。圧は初めに2度確認し、あとは変えません。',
      },
      {
        icon: Flower2,
        title: 'ハンド＆フット',
        body: 'ドライファイル、ニッパーではなくオイルでの甘皮ケア、薄い塗り重ね、そして爪を焼かない低発熱のライト。',
      },
    ],
  },

  why: {
    eyebrow: 'ルミエールを選ぶ理由',
    title: '帰り道で気づく、4つのこと',
    subtitle:
      'どれも写真には写りません。けれど、1日で終わる施術と1シーズン続く施術を分けているのは、この4つです。',
    items: [
      {
        icon: Timer,
        title: '予約表に余白がある',
        body: 'ご予約は15分の余裕をもって組んでいます。カウンセリングが長引いても、次のお客さまの時間を削りません。',
      },
      {
        icon: HandHeart,
        title: '席で物を売らない',
        body: 'セラピストは固定給で、商品の歩合はありません。おすすめする処方があれば、手に持たせるのではなく書いてお渡しします。',
      },
      {
        icon: Leaf,
        title: '短い処方と、印字された濃度',
        body: '当店の処方は、有効成分とその配合率をボトルの表面に記しています。200mlを超えるサイズにはすべて詰め替えをご用意しています。',
      },
      {
        icon: GraduationCap,
        title: '閉めている月曜',
        body: 'スタイリストとセラピストは全員、月曜に勤務扱いで研修を受けます。月に一度は外部の講師が建物に入ります。',
      },
    ],
  },

  faq: {
    eyebrow: 'ご予約の前に',
    title: 'フロントがよくお答えする質問',
    items: [
      {
        question: 'パッチテストは必要ですか',
        answer:
          'カラー施術とマイクロチャネルセラピーには必要です。48時間以上前に行い、6か月ごとに繰り返します。所要は5分ほどで、営業時間中であればご予約なしでも受けていただけます。',
      },
      {
        question: 'どのくらい前に予約すればよいですか',
        answer:
          'カットは2〜3週間前、バレイヤージュやスムージングは4〜5週間前が目安です。当週分の枠を既存のお客さま向けに少数お残ししていますので、お電話をいただく価値はあります。',
      },
      {
        question: '予約を変更したい場合はどうなりますか',
        answer:
          '24時間前までにご連絡いただければ費用はかかりません。24時間を切った場合は施術料金の半額を申し受けます。カラーの枠は当日に埋まることがまれなためです。',
      },
      {
        question: '建物はバリアフリーですか',
        answer:
          '1階、ショップ、中庭の施術室は段差がなく、扉も広く、多目的お手洗いがあります。2階へは階段のみのため、ヘアのご予約はご希望に応じて1階にお移しできます。',
      },
      {
        question: '予約なしで商品だけ購入できますか',
        answer:
          '営業時間中はどなたでもショップをご利用いただけます。フロントでは、施術のご予約をお取りすることなく、肌や髪に合う処方をお選びします。',
      },
      {
        question: 'ギフト券は扱っていますか',
        answer:
          '金額は自由にお選びいただけ、有効期限は18か月です。施術にも商品にも、その両方にもお使いいただけます。メールではなく、フロントで手書きしてお渡しします。',
      },
    ],
  },

  contact: {
    eyebrow: 'お問い合わせ',
    title: 'メニューに載っていないご質問に',
    subtitle:
      'カラーの履歴、アクセシビリティ、団体でのご予約、ギフト券。いずれも同じ受信箱に届き、システムではなくフロントの人間が読んでいます。',
    fields: {
      name: 'お名前',
      email: 'メールアドレス',
      message: 'ご用件',
    },
    submit: 'メッセージを送信',
    details: [
      { label: 'メール', value: 'desk@lumiere.example' },
      { label: '電話', value: '020 7946 0114' },
      { label: '住所', value: '34 Chiltern Street, London W1U 7QH' },
      { label: '営業', value: '火曜〜土曜（月曜・日曜定休）' },
    ],
  },

  footer: {
    tagline:
      'チルターン・ストリートのサロン兼トリートメントハウス。ヘア、スキン、ボディ、ハンドの4分野に、使う部屋のために調合した少数の処方を添えて。',
    columns: [
      { title: '施術', links: ['ヘア', 'スキン', 'ボディ', 'ハンド＆フット'] },
      { title: 'ショップ', links: ['ヘア', 'スキン', 'ボディ', 'フレグランス'] },
      { title: 'アクセス', links: ['営業時間', '行き方', 'ギフト券', 'バリアフリー'] },
    ],
    legal: '© 2026 Lumière Maison Ltd. 英国登記番号 06133482。',
  },
};
