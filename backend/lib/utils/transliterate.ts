export type Lang = 'en' | 'hindi' | 'marathi';

const mapHi: Record<string, string> = {
  a:'अ', b:'ब', c:'क', d:'द', e:'ए', f:'फ', g:'ग', h:'ह',
  i:'इ', j:'ज', k:'क', l:'ल', m:'म', n:'न', o:'ओ', p:'प',
  q:'क', r:'र', s:'स', t:'त', u:'उ', v:'व', w:'व', x:'क्स',
  y:'य', z:'ज',
};

const mapMr: Record<string, string> = {
  a:'अ', b:'ब', c:'क', d:'द', e:'ए', f:'फ', g:'ग', h:'ह',
  i:'इ', j:'ज', k:'क', l:'ल', m:'म', n:'न', o:'ओ', p:'प',
  q:'क', r:'र', s:'स', t:'त', u:'उ', v:'व', w:'व', x:'क्स',
  y:'य', z:'झ',
};

export function transliterateName(name: string, lang: Lang): string {
  if (!name) return '';
  if (lang === 'en') return name;
  const map = lang === 'hindi' ? mapHi : mapMr;
  let out = '';
  for (const ch of name) {
    const lower = ch.toLowerCase();
    out += map[lower] ?? ch;
  }
  return out;
}
