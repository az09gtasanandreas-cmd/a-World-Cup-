import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── EQUIPOS ──────────────────────────────────────────────────────────────────
const TEAMS = {
  MEX:{name:'México',emoji:'🇲🇽'},       RSA:{name:'Sudáfrica',emoji:'🇿🇦'},
  KOR:{name:'Corea del Sur',emoji:'🇰🇷'}, CZE:{name:'Chequia',emoji:'🇨🇿'},
  CAN:{name:'Canadá',emoji:'🇨🇦'},        BIH:{name:'Bosnia-Herz.',emoji:'🇧🇦'},
  USA:{name:'EE. UU.',emoji:'🇺🇸'},       PAR:{name:'Paraguay',emoji:'🇵🇾'},
  QAT:{name:'Catar',emoji:'🇶🇦'},         SUI:{name:'Suiza',emoji:'🇨🇭'},
  BRA:{name:'Brasil',emoji:'🇧🇷'},         MAR:{name:'Marruecos',emoji:'🇲🇦'},
  HAI:{name:'Haití',emoji:'🇭🇹'},          SCO:{name:'Escocia',emoji:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  AUS:{name:'Australia',emoji:'🇦🇺'},      TUR:{name:'Türkiye',emoji:'🇹🇷'},
  GER:{name:'Alemania',emoji:'🇩🇪'},       CUR:{name:'Curazao',emoji:'🇨🇼'},
  NED:{name:'Países Bajos',emoji:'🇳🇱'},   JPN:{name:'Japón',emoji:'🇯🇵'},
  CIV:{name:'Costa de Marfil',emoji:'🇨🇮'},ECU:{name:'Ecuador',emoji:'🇪🇨'},
  SWE:{name:'Suecia',emoji:'🇸🇪'},         TUN:{name:'Túnez',emoji:'🇹🇳'},
  ESP:{name:'España',emoji:'🇪🇸'},         CPV:{name:'Cabo Verde',emoji:'🇨🇻'},
  BEL:{name:'Bélgica',emoji:'🇧🇪'},        EGY:{name:'Egipto',emoji:'🇪🇬'},
  KSA:{name:'Arabia Saudita',emoji:'🇸🇦'}, URU:{name:'Uruguay',emoji:'🇺🇾'},
  IRN:{name:'Irán',emoji:'🇮🇷'},           NZL:{name:'Nueva Zelanda',emoji:'🇳🇿'},
  FRA:{name:'Francia',emoji:'🇫🇷'},         SEN:{name:'Senegal',emoji:'🇸🇳'},
  IRQ:{name:'Irak',emoji:'🇮🇶'},           NOR:{name:'Noruega',emoji:'🇳🇴'},
  ARG:{name:'Argentina',emoji:'🇦🇷'},      DZA:{name:'Argelia',emoji:'🇩🇿'},
  AUT:{name:'Austria',emoji:'🇦🇹'},        JOR:{name:'Jordania',emoji:'🇯🇴'},
  POR:{name:'Portugal',emoji:'🇵🇹'},       COD:{name:'DR Congo',emoji:'🇨🇩'},
  ENG:{name:'Inglaterra',emoji:'🏴󠁧󠁢󠁥󠁮󠁧󠁿'}, CRO:{name:'Croacia',emoji:'🇭🇷'},
  GHA:{name:'Ghana',emoji:'🇬🇭'},          PAN:{name:'Panamá',emoji:'🇵🇦'},
  COL:{name:'Colombia',emoji:'🇨🇴'},       UZB:{name:'Uzbekistán',emoji:'🇺🇿'},
};

// ─── FIXTURE (72 partidos) ────────────────────────────────────────────────────
const ALL_MATCHES_DATA = [
  {id:1,  home:'MEX',away:'RSA', group:'Grupo A',dateLabel:'Jue 11 Jun',timeET:'15:00',kickoffUTC:'2026-06-11T19:00:00Z',stadium:'Ciudad de México (Azteca)'},
  {id:2,  home:'KOR',away:'CZE', group:'Grupo A',dateLabel:'Jue 11 Jun',timeET:'22:00',kickoffUTC:'2026-06-12T02:00:00Z',stadium:'Guadalajara (Akron)'},
  {id:3,  home:'CAN',away:'BIH', group:'Grupo B',dateLabel:'Vie 12 Jun',timeET:'15:00',kickoffUTC:'2026-06-12T19:00:00Z',stadium:'Toronto (BMO Field)'},
  {id:4,  home:'USA',away:'PAR', group:'Grupo D',dateLabel:'Vie 12 Jun',timeET:'21:00',kickoffUTC:'2026-06-13T01:00:00Z',stadium:'Los Ángeles (SoFi)'},
  {id:5,  home:'QAT',away:'SUI', group:'Grupo B',dateLabel:'Sáb 13 Jun',timeET:'15:00',kickoffUTC:'2026-06-13T19:00:00Z',stadium:"San Francisco (Levi's)"},
  {id:6,  home:'BRA',away:'MAR', group:'Grupo C',dateLabel:'Sáb 13 Jun',timeET:'18:00',kickoffUTC:'2026-06-13T22:00:00Z',stadium:'Nueva York/NJ (MetLife)'},
  {id:7,  home:'HAI',away:'SCO', group:'Grupo C',dateLabel:'Sáb 13 Jun',timeET:'21:00',kickoffUTC:'2026-06-14T01:00:00Z',stadium:'Boston (Gillette)'},
  {id:8,  home:'AUS',away:'TUR', group:'Grupo D',dateLabel:'Dom 14 Jun',timeET:'00:00',kickoffUTC:'2026-06-14T04:00:00Z',stadium:'Vancouver (BC Place)'},
  {id:9,  home:'GER',away:'CUR', group:'Grupo E',dateLabel:'Dom 14 Jun',timeET:'13:00',kickoffUTC:'2026-06-14T17:00:00Z',stadium:'Houston (NRG)'},
  {id:10, home:'NED',away:'JPN', group:'Grupo F',dateLabel:'Dom 14 Jun',timeET:'16:00',kickoffUTC:'2026-06-14T20:00:00Z',stadium:'Dallas (AT&T)'},
  {id:11, home:'CIV',away:'ECU', group:'Grupo E',dateLabel:'Dom 14 Jun',timeET:'19:00',kickoffUTC:'2026-06-14T23:00:00Z',stadium:'Philadelphia (Lincoln)'},
  {id:12, home:'SWE',away:'TUN', group:'Grupo F',dateLabel:'Dom 14 Jun',timeET:'22:00',kickoffUTC:'2026-06-15T02:00:00Z',stadium:'Monterrey (BBVA)'},
  {id:13, home:'ESP',away:'CPV', group:'Grupo H',dateLabel:'Lun 15 Jun',timeET:'12:00',kickoffUTC:'2026-06-15T16:00:00Z',stadium:'Atlanta (Mercedes-Benz)'},
  {id:14, home:'BEL',away:'EGY', group:'Grupo G',dateLabel:'Lun 15 Jun',timeET:'15:00',kickoffUTC:'2026-06-15T19:00:00Z',stadium:'Seattle (Lumen Field)'},
  {id:15, home:'KSA',away:'URU', group:'Grupo H',dateLabel:'Lun 15 Jun',timeET:'18:00',kickoffUTC:'2026-06-15T22:00:00Z',stadium:'Miami (Hard Rock)'},
  {id:16, home:'IRN',away:'NZL', group:'Grupo G',dateLabel:'Lun 15 Jun',timeET:'21:00',kickoffUTC:'2026-06-16T01:00:00Z',stadium:'Los Ángeles (SoFi)'},
  {id:17, home:'FRA',away:'SEN', group:'Grupo I',dateLabel:'Mar 16 Jun',timeET:'15:00',kickoffUTC:'2026-06-16T19:00:00Z',stadium:'Nueva York/NJ (MetLife)'},
  {id:18, home:'IRQ',away:'NOR', group:'Grupo I',dateLabel:'Mar 16 Jun',timeET:'18:00',kickoffUTC:'2026-06-16T22:00:00Z',stadium:'Boston (Gillette)'},
  {id:19, home:'ARG',away:'DZA', group:'Grupo J',dateLabel:'Mar 16 Jun',timeET:'21:00',kickoffUTC:'2026-06-17T01:00:00Z',stadium:'Kansas City (Arrowhead)'},
  {id:20, home:'AUT',away:'JOR', group:'Grupo J',dateLabel:'Mié 17 Jun',timeET:'00:00',kickoffUTC:'2026-06-17T04:00:00Z',stadium:"San Francisco (Levi's)"},
  {id:21, home:'POR',away:'COD', group:'Grupo K',dateLabel:'Mié 17 Jun',timeET:'13:00',kickoffUTC:'2026-06-17T17:00:00Z',stadium:'Houston (NRG)'},
  {id:22, home:'ENG',away:'CRO', group:'Grupo L',dateLabel:'Mié 17 Jun',timeET:'16:00',kickoffUTC:'2026-06-17T20:00:00Z',stadium:'Dallas (AT&T)'},
  {id:23, home:'GHA',away:'PAN', group:'Grupo L',dateLabel:'Mié 17 Jun',timeET:'19:00',kickoffUTC:'2026-06-17T23:00:00Z',stadium:'Toronto (BMO Field)'},
  {id:24, home:'UZB',away:'COL', group:'Grupo K',dateLabel:'Mié 17 Jun',timeET:'22:00',kickoffUTC:'2026-06-18T02:00:00Z',stadium:'Ciudad de México (Azteca)'},
  {id:25, home:'CZE',away:'RSA', group:'Grupo A',dateLabel:'Jue 18 Jun',timeET:'12:00',kickoffUTC:'2026-06-18T16:00:00Z',stadium:'Atlanta (Mercedes-Benz)'},
  {id:26, home:'SUI',away:'BIH', group:'Grupo B',dateLabel:'Jue 18 Jun',timeET:'15:00',kickoffUTC:'2026-06-18T19:00:00Z',stadium:'Los Ángeles (SoFi)'},
  {id:27, home:'CAN',away:'QAT', group:'Grupo B',dateLabel:'Jue 18 Jun',timeET:'18:00',kickoffUTC:'2026-06-18T22:00:00Z',stadium:'Vancouver (BC Place)'},
  {id:28, home:'MEX',away:'KOR', group:'Grupo A',dateLabel:'Jue 18 Jun',timeET:'21:00',kickoffUTC:'2026-06-19T01:00:00Z',stadium:'Guadalajara (Akron)'},
  {id:29, home:'TUR',away:'PAR', group:'Grupo D',dateLabel:'Vie 19 Jun',timeET:'00:00',kickoffUTC:'2026-06-19T04:00:00Z',stadium:"San Francisco (Levi's)"},
  {id:30, home:'USA',away:'AUS', group:'Grupo D',dateLabel:'Vie 19 Jun',timeET:'15:00',kickoffUTC:'2026-06-19T19:00:00Z',stadium:'Seattle (Lumen Field)'},
  {id:31, home:'SCO',away:'MAR', group:'Grupo C',dateLabel:'Vie 19 Jun',timeET:'18:00',kickoffUTC:'2026-06-19T22:00:00Z',stadium:'Boston (Gillette)'},
  {id:32, home:'BRA',away:'HAI', group:'Grupo C',dateLabel:'Vie 19 Jun',timeET:'20:30',kickoffUTC:'2026-06-20T00:30:00Z',stadium:'Philadelphia (Lincoln)'},
  {id:33, home:'NED',away:'SWE', group:'Grupo F',dateLabel:'Sáb 20 Jun',timeET:'13:00',kickoffUTC:'2026-06-20T17:00:00Z',stadium:'Houston (NRG)'},
  {id:34, home:'GER',away:'CIV', group:'Grupo E',dateLabel:'Sáb 20 Jun',timeET:'16:00',kickoffUTC:'2026-06-20T20:00:00Z',stadium:'Toronto (BMO Field)'},
  {id:35, home:'ECU',away:'CUR', group:'Grupo E',dateLabel:'Sáb 20 Jun',timeET:'20:00',kickoffUTC:'2026-06-21T00:00:00Z',stadium:'Kansas City (Arrowhead)'},
  {id:36, home:'TUN',away:'JPN', group:'Grupo F',dateLabel:'Dom 21 Jun',timeET:'00:00',kickoffUTC:'2026-06-21T04:00:00Z',stadium:'Monterrey (BBVA)'},
  {id:37, home:'ESP',away:'KSA', group:'Grupo H',dateLabel:'Dom 21 Jun',timeET:'12:00',kickoffUTC:'2026-06-21T16:00:00Z',stadium:'Atlanta (Mercedes-Benz)'},
  {id:38, home:'BEL',away:'IRN', group:'Grupo G',dateLabel:'Dom 21 Jun',timeET:'15:00',kickoffUTC:'2026-06-21T19:00:00Z',stadium:'Los Ángeles (SoFi)'},
  {id:39, home:'URU',away:'CPV', group:'Grupo H',dateLabel:'Dom 21 Jun',timeET:'18:00',kickoffUTC:'2026-06-21T22:00:00Z',stadium:'Miami (Hard Rock)'},
  {id:40, home:'NZL',away:'EGY', group:'Grupo G',dateLabel:'Dom 21 Jun',timeET:'21:00',kickoffUTC:'2026-06-22T01:00:00Z',stadium:'Vancouver (BC Place)'},
  {id:41, home:'ARG',away:'AUT', group:'Grupo J',dateLabel:'Lun 22 Jun',timeET:'13:00',kickoffUTC:'2026-06-22T17:00:00Z',stadium:'Dallas (AT&T)'},
  {id:42, home:'FRA',away:'IRQ', group:'Grupo I',dateLabel:'Lun 22 Jun',timeET:'17:00',kickoffUTC:'2026-06-22T21:00:00Z',stadium:'Philadelphia (Lincoln)'},
  {id:43, home:'NOR',away:'SEN', group:'Grupo I',dateLabel:'Lun 22 Jun',timeET:'20:00',kickoffUTC:'2026-06-23T00:00:00Z',stadium:'Nueva York/NJ (MetLife)'},
  {id:44, home:'JOR',away:'DZA', group:'Grupo J',dateLabel:'Lun 22 Jun',timeET:'23:00',kickoffUTC:'2026-06-23T03:00:00Z',stadium:"San Francisco (Levi's)"},
  {id:45, home:'POR',away:'UZB', group:'Grupo K',dateLabel:'Mar 23 Jun',timeET:'13:00',kickoffUTC:'2026-06-23T17:00:00Z',stadium:'Houston (NRG)'},
  {id:46, home:'ENG',away:'GHA', group:'Grupo L',dateLabel:'Mar 23 Jun',timeET:'16:00',kickoffUTC:'2026-06-23T20:00:00Z',stadium:'Boston (Gillette)'},
  {id:47, home:'PAN',away:'CRO', group:'Grupo L',dateLabel:'Mar 23 Jun',timeET:'19:00',kickoffUTC:'2026-06-23T23:00:00Z',stadium:'Toronto (BMO Field)'},
  {id:48, home:'COL',away:'COD', group:'Grupo K',dateLabel:'Mar 23 Jun',timeET:'22:00',kickoffUTC:'2026-06-24T02:00:00Z',stadium:'Guadalajara (Akron)'},
  {id:49, home:'SUI',away:'CAN', group:'Grupo B',dateLabel:'Mié 24 Jun',timeET:'15:00',kickoffUTC:'2026-06-24T19:00:00Z',stadium:'Vancouver (BC Place)'},
  {id:50, home:'BIH',away:'QAT', group:'Grupo B',dateLabel:'Mié 24 Jun',timeET:'15:00',kickoffUTC:'2026-06-24T19:00:00Z',stadium:'Seattle (Lumen Field)'},
  {id:51, home:'SCO',away:'BRA', group:'Grupo C',dateLabel:'Mié 24 Jun',timeET:'18:00',kickoffUTC:'2026-06-24T22:00:00Z',stadium:'Miami (Hard Rock)'},
  {id:52, home:'MAR',away:'HAI', group:'Grupo C',dateLabel:'Mié 24 Jun',timeET:'18:00',kickoffUTC:'2026-06-24T22:00:00Z',stadium:'Atlanta (Mercedes-Benz)'},
  {id:53, home:'CZE',away:'MEX', group:'Grupo A',dateLabel:'Mié 24 Jun',timeET:'21:00',kickoffUTC:'2026-06-25T01:00:00Z',stadium:'Ciudad de México (Azteca)'},
  {id:54, home:'RSA',away:'KOR', group:'Grupo A',dateLabel:'Mié 24 Jun',timeET:'21:00',kickoffUTC:'2026-06-25T01:00:00Z',stadium:'Monterrey (BBVA)'},
  {id:55, home:'CUR',away:'CIV', group:'Grupo E',dateLabel:'Jue 25 Jun',timeET:'16:00',kickoffUTC:'2026-06-25T20:00:00Z',stadium:'Philadelphia (Lincoln)'},
  {id:56, home:'ECU',away:'GER', group:'Grupo E',dateLabel:'Jue 25 Jun',timeET:'16:00',kickoffUTC:'2026-06-25T20:00:00Z',stadium:'Nueva York/NJ (MetLife)'},
  {id:57, home:'JPN',away:'SWE', group:'Grupo F',dateLabel:'Jue 25 Jun',timeET:'19:00',kickoffUTC:'2026-06-25T23:00:00Z',stadium:'Dallas (AT&T)'},
  {id:58, home:'TUN',away:'NED', group:'Grupo F',dateLabel:'Jue 25 Jun',timeET:'19:00',kickoffUTC:'2026-06-25T23:00:00Z',stadium:'Kansas City (Arrowhead)'},
  {id:59, home:'TUR',away:'USA', group:'Grupo D',dateLabel:'Jue 25 Jun',timeET:'22:00',kickoffUTC:'2026-06-26T02:00:00Z',stadium:'Los Ángeles (SoFi)'},
  {id:60, home:'PAR',away:'AUS', group:'Grupo D',dateLabel:'Jue 25 Jun',timeET:'22:00',kickoffUTC:'2026-06-26T02:00:00Z',stadium:"San Francisco (Levi's)"},
  {id:61, home:'NOR',away:'FRA', group:'Grupo I',dateLabel:'Vie 26 Jun',timeET:'15:00',kickoffUTC:'2026-06-26T19:00:00Z',stadium:'Boston (Gillette)'},
  {id:62, home:'SEN',away:'IRQ', group:'Grupo I',dateLabel:'Vie 26 Jun',timeET:'15:00',kickoffUTC:'2026-06-26T19:00:00Z',stadium:'Toronto (BMO Field)'},
  {id:63, home:'CPV',away:'KSA', group:'Grupo H',dateLabel:'Vie 26 Jun',timeET:'20:00',kickoffUTC:'2026-06-27T00:00:00Z',stadium:'Houston (NRG)'},
  {id:64, home:'URU',away:'ESP', group:'Grupo H',dateLabel:'Vie 26 Jun',timeET:'20:00',kickoffUTC:'2026-06-27T00:00:00Z',stadium:'Guadalajara (Akron)'},
  {id:65, home:'EGY',away:'IRN', group:'Grupo G',dateLabel:'Vie 26 Jun',timeET:'23:00',kickoffUTC:'2026-06-27T03:00:00Z',stadium:'Seattle (Lumen Field)'},
  {id:66, home:'NZL',away:'BEL', group:'Grupo G',dateLabel:'Vie 26 Jun',timeET:'23:00',kickoffUTC:'2026-06-27T03:00:00Z',stadium:'Vancouver (BC Place)'},
  {id:67, home:'PAN',away:'ENG', group:'Grupo L',dateLabel:'Sáb 27 Jun',timeET:'17:00',kickoffUTC:'2026-06-27T21:00:00Z',stadium:'Nueva York/NJ (MetLife)'},
  {id:68, home:'CRO',away:'GHA', group:'Grupo L',dateLabel:'Sáb 27 Jun',timeET:'17:00',kickoffUTC:'2026-06-27T21:00:00Z',stadium:'Philadelphia (Lincoln)'},
  {id:69, home:'COL',away:'POR', group:'Grupo K',dateLabel:'Sáb 27 Jun',timeET:'19:30',kickoffUTC:'2026-06-27T23:30:00Z',stadium:'Miami (Hard Rock)'},
  {id:70, home:'COD',away:'UZB', group:'Grupo K',dateLabel:'Sáb 27 Jun',timeET:'19:30',kickoffUTC:'2026-06-27T23:30:00Z',stadium:'Atlanta (Mercedes-Benz)'},
  {id:71, home:'DZA',away:'AUT', group:'Grupo J',dateLabel:'Sáb 27 Jun',timeET:'22:00',kickoffUTC:'2026-06-28T02:00:00Z',stadium:'Kansas City (Arrowhead)'},
  {id:72, home:'JOR',away:'ARG', group:'Grupo J',dateLabel:'Sáb 27 Jun',timeET:'22:00',kickoffUTC:'2026-06-28T02:00:00Z',stadium:'Dallas (AT&T)'},
];

// ─── MARCADORES REALES (fase de grupos completa) ──────────────────────────────
const REAL_SCORES = {
  1:[2,0],2:[2,1],25:[1,1],28:[1,0],53:[0,3],54:[1,0],
  3:[1,1],5:[1,1],26:[4,1],27:[6,0],49:[3,1],50:[3,1],
  6:[1,1],7:[0,1],31:[0,1],32:[3,0],51:[0,3],52:[4,2],
  4:[4,1],8:[0,2],29:[0,1],30:[2,0],59:[3,2],60:[0,0],
  9:[7,1],11:[1,0],34:[2,1],35:[0,0],55:[0,2],56:[2,1],
  10:[2,2],12:[5,1],33:[5,1],36:[0,4],57:[1,1],58:[1,3],
  14:[1,1],16:[2,2],38:[0,0],40:[1,3],65:[1,1],66:[1,5],
  13:[0,0],15:[1,1],37:[4,0],39:[2,2],63:[0,0],64:[0,1],
  17:[3,1],18:[1,4],42:[3,0],43:[3,2],61:[1,4],62:[5,0],
  19:[3,0],20:[3,1],41:[2,0],44:[1,2],71:[3,3],72:[1,3],
  21:[1,1],24:[1,3],45:[5,0],48:[1,0],69:[0,0],70:[3,1],
  22:[4,2],23:[1,0],46:[0,0],47:[0,1],67:[0,2],68:[2,1],
};

// ─── STATUS BASADO EN RELOJ REAL ──────────────────────────────────────────────
function getMatchStatus(kickoffUTC, now) {
  const ko = new Date(kickoffUTC);
  const elapsedMin = Math.floor((now - ko) / 60000);
  if (elapsedMin < 0)   return { status: 'scheduled', minute: 0 };
  if (elapsedMin < 97)  return { status: 'live',      minute: Math.min(90, elapsedMin) };
  return                       { status: 'finished',   minute: 90 };
}

function buildMatches(now) {
  return ALL_MATCHES_DATA.map(m => {
    const { status, minute } = getMatchStatus(m.kickoffUTC, now);
    const score = REAL_SCORES[m.id];
    const scoreHome = score ? score[0] : 0;
    const scoreAway = score ? score[1] : 0;
    return { ...m, status, minute, scoreHome, scoreAway, events: [] };
  });
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const AVATARS = ['⚽','🏆','🦅','🐉','🔥','⚡','🦁','🌟','🎯','💎','🦊','🦋','🐺','🏅','🎪','🌊'];
const BANNERS = [
  {id:'b1',style:'linear-gradient(135deg,#6366f1,#8b5cf6)'},
  {id:'b2',style:'linear-gradient(135deg,#ec4899,#f43f5e)'},
  {id:'b3',style:'linear-gradient(135deg,#10b981,#06b6d4)'},
  {id:'b4',style:'linear-gradient(135deg,#f59e0b,#ef4444)'},
  {id:'b5',style:'linear-gradient(135deg,#3b82f6,#6366f1)'},
  {id:'b6',style:'linear-gradient(135deg,#14b8a6,#22c55e)'},
  {id:'b7',style:'linear-gradient(135deg,#1e293b,#334155)'},
  {id:'b8',style:'linear-gradient(135deg,#fbbf24,#f97316)'},
];
const TITLES = ['Rookie','Apostador','Pro Bet','Shark','Legend','El Patrón','Cyber God'];
const CURRENCY_RATES = {COP:1, USD:0.00025, EUR:0.00023};
const CURRENCY_SYM   = {COP:'COP $', USD:'USD $', EUR:'EUR €'};
const ENTRY_FEE = 150;
const NAV = [
  {id:'live',    label:'En Vivo', icon:'⚡'},
  {id:'earn',    label:'Ganar',   icon:'🎁'},
  {id:'album',   label:'Álbum',   icon:'🃏'},
  {id:'bets',    label:'Mis Bets',icon:'🎯'},
  {id:'cashier', label:'Cajero',  icon:'💳'},
  {id:'profile', label:'Perfil',  icon:'👤'},
];
const COIN_PACKS = [
  {id:'p2k',coins:2000,priceCOP:15000,priceUSD:3.75,priceEUR:3.45,label:'Starter',emoji:'⚡',color:'#6366f1',bg:'linear-gradient(135deg,#1e1b4b,#0f172a)',border:'#6366f1',badge:null},
  {id:'p5k',coins:5000,priceCOP:30000,priceUSD:7.50,priceEUR:6.90,label:'Pro',    emoji:'💎',color:'#fbbf24',bg:'linear-gradient(135deg,#1c1408,#0f172a)',border:'#f59e0b',badge:'MEJOR VALOR'},
];

// ─── FIGURAS (900 cartas) ─────────────────────────────────────────────────────
const FIRST_NAMES=['Lionel','Kylian','Cristiano','Erling','Vinicius','Mohamed','Kevin','Luka','Robert','Harry','Neymar','Antoine','Jude','Bukayo','Bruno','Pedri','Federico','Heung-min','Guillermo','Santi','Hirving','Alphonso','Hakim','Edson','Luis','Casemiro','Marcus','Leroy','Riyad','Romelu','Raheem','Achraf','Trent','Virgil','Alisson','Manuel','Marc','Bernardo','Thiago','Jordan'];
const LAST_NAMES =['Messi','Mbappé','Ronaldo','Haaland','Jr.','Salah','De Bruyne','Modrić','Lewandowski','Kane','Jr.','Griezmann','Bellingham','Saka','Fernandes','Gavi','Valverde','Min','Ochoa','Cazorla','Lozano','Davies','Ziyech','Álvarez','Díaz','Casemiro','Rashford','Sané','Mahrez','Lukaku','Sterling','Hakimi','Alexander','van Dijk','Becker','Neuer','ter Stegen','Silva','Alcântara','Henderson'];
const POSITIONS=['POR','DEF','DEF','MED','MED','DEL','EXT','EXT','MED','DEF'];
const TEAM_CODES=Object.keys(TEAMS);
const RARITY_CONFIG=[
  {name:'Legendario',color:'#f59e0b',bg:'linear-gradient(135deg,#78350f,#451a03)',border:'#f59e0b'},
  {name:'Épico',     color:'#a855f7',bg:'linear-gradient(135deg,#4c1d95,#1e1b4b)',border:'#a855f7'},
  {name:'Raro',      color:'#3b82f6',bg:'linear-gradient(135deg,#1e3a5f,#0f172a)',border:'#3b82f6'},
  {name:'Común',     color:'#94a3b8',bg:'linear-gradient(135deg,#1e293b,#0f172a)',border:'#334155'},
];
function getRarity(id){const s=(id*7919)%100;if(s<2)return RARITY_CONFIG[0];if(s<10)return RARITY_CONFIG[1];if(s<30)return RARITY_CONFIG[2];return RARITY_CONFIG[3];}
const ALL_CARDS=Array.from({length:900},(_,i)=>{
  const id=i+1,r=getRarity(id);
  const base=r.name==='Legendario'?95+(id%5):r.name==='Épico'?88+(id%7):r.name==='Raro'?78+(id%10):65+(id%13);
  return{id,name:`${FIRST_NAMES[i%FIRST_NAMES.length]} ${LAST_NAMES[(i*3)%LAST_NAMES.length]}`,
    team:TEAM_CODES[i%TEAM_CODES.length],pos:POSITIONS[i%POSITIONS.length],
    rating:Math.min(99,base),rarity:r,num:String(id).padStart(3,'0')};
});
const CARDS_BY_TEAM={};
TEAM_CODES.forEach(c=>{CARDS_BY_TEAM[c]=ALL_CARDS.filter(x=>x.team===c);});

// ─── API football-data.org ────────────────────────────────────────────────────
const FD_KEY = '32f17c44f4fbf5336e1dd9772725a117';
const FD_URL = 'https://api.football-data.org/v4/competitions/WC/matches';

const API_NAME_MAP = {
  'Mexico':'MEX','South Africa':'RSA','South Korea':'KOR','Czech Republic':'CZE','Czechia':'CZE',
  'Canada':'CAN','Bosnia and Herzegovina':'BIH','USA':'USA','United States':'USA','Paraguay':'PAR',
  'Qatar':'QAT','Switzerland':'SUI','Brazil':'BRA','Morocco':'MAR','Haiti':'HAI','Scotland':'SCO',
  'Australia':'AUS','Turkey':'TUR','Türkiye':'TUR','Germany':'GER','Curacao':'CUR','Curaçao':'CUR',
  'Netherlands':'NED','Japan':'JPN','Ivory Coast':'CIV',"Côte d'Ivoire":'CIV','Ecuador':'ECU',
  'Sweden':'SWE','Tunisia':'TUN','Spain':'ESP','Cape Verde':'CPV','Cabo Verde':'CPV',
  'Belgium':'BEL','Egypt':'EGY','Saudi Arabia':'KSA','Iran':'IRN','New Zealand':'NZL',
  'France':'FRA','Senegal':'SEN','Iraq':'IRQ','Norway':'NOR','Argentina':'ARG','Algeria':'DZA',
  'Austria':'AUT','Jordan':'JOR','Portugal':'POR','DR Congo':'COD','Congo DR':'COD',
  'Uzbekistan':'UZB','England':'ENG','Croatia':'CRO','Ghana':'GHA','Panama':'PAN',
  'Colombia':'COL','Uruguay':'URU',
};

async function fetchFromAPI() {
  // Proxies CORS públicos que permiten headers personalizados
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(FD_URL)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(FD_URL + '?X-Auth-Token=' + FD_KEY)}`,
    `https://thingproxy.freeboard.io/fetch/${FD_URL}`,
  ];
  // Intento directo primero
  try {
    const r = await fetch(FD_URL, {
      headers: { 'X-Auth-Token': FD_KEY, 'Accept': 'application/json' },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    return d.matches || [];
  } catch (_) {}
  // Proxies como fallback
  for (const url of proxies) {
    try {
      const r = await fetch(url, {
        headers: { 'X-Auth-Token': FD_KEY, 'Accept': 'application/json' },
      });
      if (!r.ok) continue;
      const d = await r.json();
      if (d.matches) return d.matches;
    } catch (_) {}
  }
  return [];
}

// ─── HOOK PARTIDOS ────────────────────────────────────────────────────────────
function useMatches() {
  const [matches, setMatches] = useState(() => buildMatches(new Date()));
  const [apiStatus, setApiStatus] = useState('connecting');

  // Reloj local: actualiza minuto/estado cada 30s
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setMatches(prev => prev.map(m => {
        const { status, minute } = getMatchStatus(m.kickoffUTC, now);
        let events = [...(m.events || [])];
        if (m.status === 'scheduled' && status === 'live') {
          events = [{ text: `🏁 ¡PITAZO! ${TEAMS[m.home]?.name} vs ${TEAMS[m.away]?.name}` }];
        }
        if (m.status === 'live' && status === 'finished') {
          events = [...events, { text: `🏁 FIN · ${TEAMS[m.home]?.name} ${m.scoreHome}–${m.scoreAway} ${TEAMS[m.away]?.name}` }].slice(-5);
        }
        return { ...m, status, minute: m.apiMinute != null ? m.apiMinute : minute, events };
      }));
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  // API real: poll cada 60s
  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const apiMatches = await fetchFromAPI();
        if (cancelled) return;
        if (!apiMatches || apiMatches.length === 0) {
          setApiStatus('offline');
          return;
        }
        setApiStatus('live');
        setMatches(prev => prev.map(m => {
          const am = apiMatches.find(x => {
            const h = API_NAME_MAP[x.homeTeam?.name] || x.homeTeam?.tla;
            const a = API_NAME_MAP[x.awayTeam?.name] || x.awayTeam?.tla;
            return h === m.home && a === m.away;
          });
          if (!am) return m;
          const apiSt = am.status;
          const apiSH = am.score?.fullTime?.home ?? am.score?.halfTime?.home ?? null;
          const apiSA = am.score?.fullTime?.away ?? am.score?.halfTime?.away ?? null;
          const sh = apiSH !== null ? apiSH : m.scoreHome;
          const sa = apiSA !== null ? apiSA : m.scoreAway;
          const apiMin = am.minute ?? null;
          let status = m.status;
          if (apiSt === 'IN_PLAY' || apiSt === 'PAUSED') status = 'live';
          else if (apiSt === 'FINISHED') status = 'finished';
          else if (apiSt === 'SCHEDULED' || apiSt === 'TIMED') status = 'scheduled';
          let events = [...(m.events || [])];
          if (typeof sh === 'number' && sh > m.scoreHome) events.push({ text: `⚽ GOL de ${TEAMS[m.home]?.name}!` });
          if (typeof sa === 'number' && sa > m.scoreAway) events.push({ text: `⚽ GOL de ${TEAMS[m.away]?.name}!` });
          if (status === 'finished' && m.status !== 'finished') {
            events.push({ text: `🏁 FIN · ${TEAMS[m.home]?.name} ${sh}–${sa} ${TEAMS[m.away]?.name}` });
          }
          return {
            ...m, status,
            scoreHome: typeof sh === 'number' ? sh : m.scoreHome,
            scoreAway: typeof sa === 'number' ? sa : m.scoreAway,
            apiMinute: apiMin,
            minute: apiMin != null ? apiMin : m.minute,
            events: events.slice(-5),
          };
        }));
      } catch (e) {
        if (!cancelled) setApiStatus('offline');
      }
    }
    poll();
    const t = setInterval(poll, 60000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return { matches, apiStatus };
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function useCountdown() {
  const target = new Date('2026-06-11T19:00:00Z');
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const diff = target - now;
  if (diff <= 0) return { isOver: true, days:0, hours:0, minutes:0, seconds:0 };
  return { isOver:false, days:Math.floor(diff/86400000), hours:Math.floor((diff%86400000)/3600000),
    minutes:Math.floor((diff%3600000)/60000), seconds:Math.floor((diff%60000)/1000) };
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg}){
  if(!msg)return null;
  return(<div style={{position:'fixed',top:16,left:'50%',transform:'translateX(-50%)',
    background:'#0f172a',border:'1px solid #6366f1',borderRadius:12,padding:'10px 18px',
    color:'#f1f5f9',fontSize:13,fontWeight:700,zIndex:9999,maxWidth:340,textAlign:'center',
    boxShadow:'0 8px 32px #00000080',whiteSpace:'pre-line'}}>{msg}</div>);
}

// ─── FIGURE CARD ──────────────────────────────────────────────────────────────
function FigureCard({card,owned,small}){
  const r=card.rarity,team=TEAMS[card.team]||{emoji:'⚽',name:card.team};
  if(small)return(
    <div style={{background:owned?r.bg:'#0a0f1e',border:`1px solid ${owned?r.border:'#1e293b'}`,
      borderRadius:8,padding:'6px 4px',display:'flex',flexDirection:'column',alignItems:'center',opacity:owned?1:0.3}}>
      <div style={{fontSize:18,lineHeight:1}}>{owned?team.emoji:'❓'}</div>
      <div style={{color:owned?r.color:'#1e293b',fontSize:7,fontWeight:900,marginTop:2}}>{owned?card.rating:`#${card.num}`}</div>
    </div>
  );
  return(
    <div style={{background:owned?r.bg:'linear-gradient(135deg,#0f172a,#0a0f1e)',
      border:`2px solid ${owned?r.border:'#1e293b'}`,borderRadius:12,padding:'12px 8px',
      display:'flex',flexDirection:'column',alignItems:'center',opacity:owned?1:0.28,
      boxShadow:owned&&r.name!=='Común'?`0 0 12px ${r.border}60`:'none'}}>
      {owned&&r.name!=='Común'&&(
        <span style={{background:r.color,color:'#000',fontSize:7,fontWeight:900,
          padding:'1px 6px',borderRadius:99,marginBottom:4}}>
          {r.name==='Legendario'?'★ LEGEND':r.name==='Épico'?'◆ ÉPICO':'● RARO'}
        </span>
      )}
      <div style={{fontSize:28,lineHeight:1}}>{owned?team.emoji:'❓'}</div>
      {owned?(
        <>
          <div style={{color:'#f1f5f9',fontSize:9,fontWeight:800,marginTop:4,textAlign:'center',lineHeight:1.3,maxWidth:72}}>{card.name}</div>
          <div style={{color:'#64748b',fontSize:7,marginTop:2}}>{card.pos}·{team.name}</div>
          <div style={{background:r.color,color:'#000',borderRadius:6,padding:'2px 8px',fontSize:11,fontWeight:900,marginTop:5}}>{card.rating}</div>
        </>
      ):(
        <div style={{color:'#1e293b',fontSize:8,marginTop:4,fontWeight:700}}>#{card.num}</div>
      )}
    </div>
  );
}

// ─── PACK OPEN MODAL ──────────────────────────────────────────────────────────
function PackOpenModal({cards,onClose}){
  const [step,setStep]=useState(-1);
  const [flipped,setFlipped]=useState(false);
  const [done,setDone]=useState(false);
  const cur=step>=0&&step<cards.length?cards[step]:null;
  const hasLeg=cards.some(c=>c.rarity.name==='Legendario');
  const hasEpic=cards.some(c=>c.rarity.name==='Épico');
  const glow=hasLeg?'#f59e0b':hasEpic?'#a855f7':'#6366f1';
  function tap(){
    if(done){onClose();return;}
    if(step===-1){setStep(0);setFlipped(false);return;}
    if(!flipped){setFlipped(true);return;}
    const next=step+1;
    if(next>=cards.length)setDone(true);
    else{setStep(next);setFlipped(false);}
  }
  return(
    <div onClick={tap} style={{position:'fixed',inset:0,zIndex:500,
      background:`radial-gradient(ellipse at center,${glow}30 0%,#020817 70%)`,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',userSelect:'none'}}>
      <style>{`@keyframes packBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes cardIn{from{transform:rotateY(90deg) scale(0.8);opacity:0}to{transform:rotateY(0) scale(1);opacity:1}}`}</style>
      {step===-1&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <div style={{fontSize:10,color:'#a5b4fc',letterSpacing:3}}>{cards.length===7?'🎴 SOBRE PREMIUM · 7 FIGURAS':'⚡ SOBRE COINS · 3 FIGURAS'}</div>
          <div style={{animation:'packBounce 1.2s infinite',background:'linear-gradient(135deg,#6366f1,#ec4899,#f59e0b)',
            borderRadius:20,padding:'32px 28px',fontSize:64,boxShadow:`0 0 40px ${glow}80`}}>🎴</div>
          <div style={{color:'#f1f5f9',fontWeight:800,fontSize:15}}>Toca para abrir</div>
        </div>
      )}
      {step>=0&&!done&&cur&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
          <div style={{color:'#64748b',fontSize:10,letterSpacing:2}}>FIGURA {step+1} DE {cards.length}</div>
          <div style={{display:'flex',gap:6}}>
            {cards.map((_,i)=>(
              <div key={i} style={{width:6,height:6,borderRadius:'50%',
                background:i<step?'#4ade80':i===step?glow:'#1e293b'}}/>
            ))}
          </div>
          {!flipped?(
            <div style={{width:150,height:220,borderRadius:16,background:'linear-gradient(135deg,#1e1b4b,#312e81)',
              border:`2px solid ${glow}`,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:60,boxShadow:`0 0 30px ${glow}60`}}>🎴</div>
          ):(
            <div style={{animation:'cardIn 0.4s ease',background:cur.rarity.bg,border:`3px solid ${cur.rarity.border}`,
              borderRadius:16,padding:'16px 12px',width:150,display:'flex',flexDirection:'column',alignItems:'center',
              boxShadow:`0 0 30px ${cur.rarity.border}80`}}>
              {cur.rarity.name!=='Común'&&(
                <div style={{background:cur.rarity.color,color:'#000',fontSize:9,fontWeight:900,
                  padding:'2px 10px',borderRadius:99,marginBottom:8}}>
                  {cur.rarity.name==='Legendario'?'★ LEGENDARIO':cur.rarity.name==='Épico'?'◆ ÉPICO':'● RARO'}
                </div>
              )}
              <div style={{fontSize:42,lineHeight:1}}>{TEAMS[cur.team]?.emoji||'⚽'}</div>
              <div style={{color:'#f1f5f9',fontWeight:800,fontSize:12,marginTop:8,textAlign:'center',lineHeight:1.3}}>{cur.name}</div>
              <div style={{color:'#64748b',fontSize:9,marginTop:3}}>{cur.pos}·{TEAMS[cur.team]?.name}</div>
              <div style={{background:cur.rarity.color,color:'#000',borderRadius:8,padding:'4px 16px',
                fontSize:20,fontWeight:900,marginTop:10}}>{cur.rating}</div>
            </div>
          )}
          <div style={{color:flipped?'#4ade80':'#a5b4fc',fontSize:11,fontWeight:700}}>
            {!flipped?'Toca para revelar':step+1<cards.length?'Siguiente →':'Terminar ✓'}
          </div>
        </div>
      )}
      {done&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,padding:'0 16px',maxWidth:380}}>
          <div style={{color:'#fbbf24',fontSize:13,fontWeight:900,letterSpacing:2}}>✅ SOBRE COMPLETADO</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center'}}>
            {cards.map((c,i)=>(
              <div key={i} style={{background:c.rarity.bg,border:`2px solid ${c.rarity.border}`,borderRadius:10,
                padding:'8px 6px',display:'flex',flexDirection:'column',alignItems:'center',gap:3,minWidth:58,
                boxShadow:c.rarity.name!=='Común'?`0 0 8px ${c.rarity.border}80`:'none'}}>
                <span style={{fontSize:22}}>{TEAMS[c.team]?.emoji||'⚽'}</span>
                <span style={{color:'#f1f5f9',fontSize:7,fontWeight:700,textAlign:'center',lineHeight:1.2,maxWidth:54}}>{c.name}</span>
                <span style={{background:c.rarity.color,color:'#000',borderRadius:4,padding:'1px 5px',fontSize:9,fontWeight:900}}>{c.rating}</span>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{marginTop:8,background:'linear-gradient(135deg,#6366f1,#ec4899)',
            border:'none',borderRadius:12,padding:'12px 36px',color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>
            Guardar en álbum →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ALBUM TAB ────────────────────────────────────────────────────────────────
function AlbumTab({collection,setCollection,balanceUSD,setBalanceUSD,balanceCoins,setBalanceCoins,triggerAlert,currency,setCurrency}){
  const [screen,setScreen]=useState('shop');
  const [activeTeam,setActiveTeam]=useState(null);
  const [openingPack,setOpeningPack]=useState(null);
  const [filter,setFilter]=useState('all');
  const [searchQ,setSearchQ]=useState('');
  const totalOwned=Object.keys(collection).length;
  const pct=Math.round((totalOwned/900)*100);
  const processing=useRef(false);
  // price2000 y buyPack definidos al nivel del componente para que sean accesibles en todos los screens
  const price2000=currency==='COP'?'COP $2.000':currency==='USD'?'USD $0.50':'EUR €0.46';

  function pickCards(count){
    const picked=[],used=new Set();
    while(picked.length<count){
      const roll=Math.random();
      let pool;
      if(roll<0.02)pool=ALL_CARDS.filter(c=>c.rarity.name==='Legendario');
      else if(roll<0.10)pool=ALL_CARDS.filter(c=>c.rarity.name==='Épico');
      else if(roll<0.30)pool=ALL_CARDS.filter(c=>c.rarity.name==='Raro');
      else pool=ALL_CARDS.filter(c=>c.rarity.name==='Común');
      const cands=pool.filter(c=>!used.has(c.id));
      if(!cands.length)continue;
      const card=cands[Math.floor(Math.random()*cands.length)];
      used.add(card.id);picked.push(card);
    }
    return picked;
  }
  function addCards(cards){setCollection(prev=>{const n={...prev};cards.forEach(c=>{if(!n[c.id])n[c.id]=0;n[c.id]++;});return n;});}
  function buyPack(type){
    if(processing.current)return;
    if(type==='money7'){
      if(balanceUSD<2000){triggerAlert('❌ Saldo insuficiente · Recarga en Cajero 💳');return;}
      processing.current=true;
      setBalanceUSD(b=>b-2000);const cards=pickCards(7);addCards(cards);setOpeningPack(cards);
    }else{
      if(balanceCoins<500){triggerAlert('❌ Necesitas ⚡500 CyberCoins');return;}
      processing.current=true;
      setBalanceCoins(c=>c-500);const cards=pickCards(3);addCards(cards);setOpeningPack(cards);
    }
    setTimeout(()=>{processing.current=false;},2000);
  }
  if(screen==='shop')return(
    <div style={{padding:12}}>
      {openingPack&&<PackOpenModal cards={openingPack} onClose={()=>setOpeningPack(null)}/>}
      <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:14,padding:'14px 16px',marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{color:'#a5b4fc',fontSize:11,fontWeight:700,letterSpacing:1}}>📒 ÁLBUM MUNDIAL 2026</div>
          <div style={{color:'#fbbf24',fontWeight:900,fontSize:13}}>{totalOwned}/900</div>
        </div>
        <div style={{background:'#1e293b',borderRadius:99,height:8,overflow:'hidden'}}>
          <div style={{background:'linear-gradient(90deg,#6366f1,#ec4899)',height:'100%',width:`${pct}%`,borderRadius:99,transition:'width 0.5s'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
          <span style={{color:'#64748b',fontSize:9}}>{pct}% completado</span>
          <span style={{color:'#64748b',fontSize:9}}>{900-totalOwned} restantes</span>
        </div>
        <div style={{display:'flex',gap:6,marginTop:10}}>
          {RARITY_CONFIG.map(r=>{
            const total=ALL_CARDS.filter(c=>c.rarity.name===r.name).length;
            const owned=ALL_CARDS.filter(c=>c.rarity.name===r.name&&collection[c.id]).length;
            return(<div key={r.name} style={{flex:1,background:'#1e293b',borderRadius:8,padding:'6px 4px',textAlign:'center',border:`1px solid ${r.border}30`}}>
              <div style={{color:r.color,fontSize:9,fontWeight:800}}>{r.name.substring(0,3).toUpperCase()}</div>
              <div style={{color:'#f1f5f9',fontSize:11,fontWeight:900,marginTop:2}}>{owned}</div>
              <div style={{color:'#475569',fontSize:8}}>/{total}</div>
            </div>);
          })}
        </div>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:12}}>
        {['COP','USD','EUR'].map(c=>(
          <button key={c} onClick={()=>setCurrency(c)} style={{flex:1,background:currency===c?'#6366f1':'#1e293b',
            border:`1px solid ${currency===c?'#818cf8':'#334155'}`,borderRadius:8,padding:'7px 0',
            color:currency===c?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>{c}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div style={{background:'linear-gradient(160deg,#1e1b4b,#0f172a)',border:'2px solid #6366f1',borderRadius:16,padding:16,textAlign:'center',boxShadow:'0 0 20px #6366f130'}}>
          <div style={{fontSize:40,marginBottom:4}}>🎴</div>
          <div style={{color:'#a5b4fc',fontSize:9,fontWeight:900,letterSpacing:2,marginBottom:4}}>SOBRE PREMIUM</div>
          <div style={{color:'#f1f5f9',fontSize:28,fontWeight:900,lineHeight:1}}>7</div>
          <div style={{color:'#818cf8',fontSize:10,marginBottom:8}}>figuras</div>
          <div style={{background:'#10b98120',border:'1px solid #10b98140',borderRadius:8,padding:'4px 0',marginBottom:10}}>
            <div style={{color:'#4ade80',fontSize:9,fontWeight:700}}>✓ Garantía 1 Raro+</div>
          </div>
          <div style={{color:'#fbbf24',fontSize:18,fontWeight:900,marginBottom:12}}>{price2000}</div>
          <button onClick={()=>buyPack('money7')} style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border:'none',borderRadius:10,padding:'11px 0',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>Abrir sobre</button>
          <div style={{color:'#334155',fontSize:9,marginTop:8}}>Saldo: COP ${balanceUSD.toLocaleString()}</div>
        </div>
        <div style={{background:'linear-gradient(160deg,#1c1408,#0f172a)',border:'2px solid #f59e0b',borderRadius:16,padding:16,textAlign:'center',boxShadow:'0 0 20px #f59e0b30'}}>
          <div style={{fontSize:40,marginBottom:4}}>⚡</div>
          <div style={{color:'#fbbf24',fontSize:9,fontWeight:900,letterSpacing:2,marginBottom:4}}>SOBRE COINS</div>
          <div style={{color:'#f1f5f9',fontSize:28,fontWeight:900,lineHeight:1}}>3</div>
          <div style={{color:'#b45309',fontSize:10,marginBottom:8}}>figuras</div>
          <div style={{background:'#f59e0b10',border:'1px solid #f59e0b30',borderRadius:8,padding:'4px 0',marginBottom:10}}>
            <div style={{color:'#fbbf24',fontSize:9,fontWeight:700}}>Paga con CyberCoins</div>
          </div>
          <div style={{color:'#fbbf24',fontSize:18,fontWeight:900,marginBottom:12}}>⚡500 Coins</div>
          <button onClick={()=>buyPack('coins3')} style={{width:'100%',background:'linear-gradient(135deg,#92400e,#78350f)',
            border:'1px solid #f59e0b',borderRadius:10,padding:'11px 0',color:'#fbbf24',fontWeight:800,fontSize:13,cursor:'pointer'}}>Abrir sobre</button>
          <div style={{color:'#334155',fontSize:9,marginTop:8}}>Coins: ⚡{balanceCoins.toLocaleString()}</div>
        </div>
      </div>
      <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:12,padding:'10px 14px',marginBottom:12}}>
        <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:8}}>PROBABILIDADES</div>
        <div style={{display:'flex',gap:6}}>
          {[['★ LEGEND','2%','#f59e0b'],['◆ ÉPICO','8%','#a855f7'],['● RARO','20%','#3b82f6'],['○ COMÚN','70%','#94a3b8']].map(([l,p,c])=>(
            <div key={l} style={{flex:1,textAlign:'center'}}>
              <div style={{color:c,fontSize:9,fontWeight:800}}>{l}</div>
              <div style={{color:'#f1f5f9',fontSize:11,fontWeight:900,marginTop:2}}>{p}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={()=>setScreen('browse')} style={{width:'100%',background:'#0f172a',border:'1px solid #334155',
        borderRadius:12,padding:'13px 0',color:'#a5b4fc',fontWeight:700,fontSize:13,cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>📖 Ver álbum completo →</button>
    </div>
  );

  if(screen==='browse'&&!activeTeam)return(
    <div style={{padding:12}}>
      {openingPack&&<PackOpenModal cards={openingPack} onClose={()=>setOpeningPack(null)}/>}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <button onClick={()=>setScreen('shop')} style={{background:'#1e293b',border:'none',borderRadius:8,padding:'6px 10px',color:'#94a3b8',fontSize:11,cursor:'pointer'}}>← Tienda</button>
        <div style={{color:'#a5b4fc',fontSize:11,fontWeight:700,letterSpacing:1}}>ELIGE UNA SELECCIÓN</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
        {Object.entries(TEAMS).map(([code,team])=>{
          const tc=CARDS_BY_TEAM[code]||[];
          const oc=tc.filter(c=>collection[c.id]).length;
          const p=Math.round((oc/Math.max(1,tc.length))*100);
          return(<button key={code} onClick={()=>{setActiveTeam(code);setScreen('team');}}
            style={{background:'#0f172a',border:`1px solid ${oc===tc.length&&tc.length>0?'#10b981':'#1e293b'}`,
              borderRadius:10,padding:'10px 6px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <span style={{fontSize:22}}>{team.emoji}</span>
            <span style={{color:'#e2e8f0',fontSize:8,fontWeight:700,textAlign:'center',lineHeight:1.2}}>{team.name}</span>
            <span style={{color:oc===tc.length&&tc.length>0?'#10b981':'#475569',fontSize:8}}>{oc}/{tc.length}</span>
            <div style={{width:'100%',background:'#1e293b',borderRadius:99,height:3}}>
              <div style={{background:oc===tc.length&&tc.length>0?'#10b981':'#6366f1',height:'100%',width:`${p}%`,borderRadius:99}}/>
            </div>
          </button>);
        })}
      </div>
    </div>
  );

  if(screen==='team'&&activeTeam){
    const tc=CARDS_BY_TEAM[activeTeam]||[];
    const vis=filter==='owned'?tc.filter(c=>collection[c.id]):filter==='missing'?tc.filter(c=>!collection[c.id]):tc;
    const filtered=searchQ?vis.filter(c=>c.name.toLowerCase().includes(searchQ.toLowerCase())||c.pos.includes(searchQ.toUpperCase())):vis;
    return(
      <div style={{padding:12}}>
        {openingPack&&<PackOpenModal cards={openingPack} onClose={()=>setOpeningPack(null)}/>}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <button onClick={()=>{setActiveTeam(null);setScreen('browse');}} style={{background:'#1e293b',border:'none',borderRadius:8,padding:'6px 10px',color:'#94a3b8',fontSize:11,cursor:'pointer'}}>←</button>
          <span style={{fontSize:22}}>{TEAMS[activeTeam]?.emoji}</span>
          <div><div style={{color:'#f1f5f9',fontSize:13,fontWeight:800}}>{TEAMS[activeTeam]?.name}</div>
            <div style={{color:'#475569',fontSize:9}}>{tc.filter(c=>collection[c.id]).length}/{tc.length} figuras</div></div>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:10}}>
          {[['all','Todas'],['owned','Tengo'],['missing','Faltan']].map(([f,l])=>(
            <button key={f} onClick={()=>setFilter(f)} style={{flex:1,background:filter===f?'#6366f1':'#1e293b',
              border:`1px solid ${filter===f?'#818cf8':'#334155'}`,borderRadius:8,padding:'6px 0',
              color:filter===f?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>{l}</button>
          ))}
        </div>
        <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Buscar jugador..."
          style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:8,
            padding:'8px 12px',color:'#f1f5f9',fontSize:12,outline:'none',boxSizing:'border-box',marginBottom:10}}/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
          {filtered.map(card=><FigureCard key={card.id} card={card} owned={!!collection[card.id]} small={false}/>)}
        </div>
        {!filtered.length&&<div style={{textAlign:'center',color:'#334155',padding:24,fontSize:12}}>Sin figuras aquí</div>}
        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button onClick={()=>buyPack('money7')} style={{flex:1,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border:'none',borderRadius:10,padding:'10px 0',color:'#fff',fontWeight:800,fontSize:11,cursor:'pointer'}}>🎴 +7 · {price2000}</button>
          <button onClick={()=>buyPack('coins3')} style={{flex:1,background:'linear-gradient(135deg,#92400e,#78350f)',
            border:'1px solid #f59e0b40',borderRadius:10,padding:'10px 0',color:'#fbbf24',fontWeight:800,fontSize:11,cursor:'pointer'}}>⚡ +3 · 500</button>
        </div>
      </div>
    );
  }
  return null;
}

// ─── BET MODAL ────────────────────────────────────────────────────────────────
function BetModal({match,balanceCoins,balanceUSD,setBalanceCoins,setBalanceUSD,setPlacedBets,matchPools,setMatchPools,triggerAlert,onClose,profile}){
  const [currency,setCurrency]=useState('COP');
  const [amount,setAmount]=useState('');
  const [outcome,setOutcome]=useState('home');
  const processing=useRef(false);
  const pool=matchPools[match.id]||{home:0,draw:0,away:0,total:0};
  const quick={COP:['10000','25000','50000','100000'],USD:['3','6','12','25'],EUR:['3','6','11','23']};
  const opts=[{key:'home',label:`${TEAMS[match.home]?.emoji} ${TEAMS[match.home]?.name}`},{key:'draw',label:'🤝 Empate'},{key:'away',label:`${TEAMS[match.away]?.emoji} ${TEAMS[match.away]?.name}`}];

  function handleBet(){
    if(processing.current)return;
    const n=Number(amount);
    if(!n||n<=0){triggerAlert('⚠️ Ingresa un monto válido');return;}
    if(balanceCoins<ENTRY_FEE){triggerAlert('⚡ Necesitas 150 CyberCoins');return;}
    const cop=Math.round(n/CURRENCY_RATES[currency]);
    if(cop>balanceUSD){triggerAlert('❌ Saldo insuficiente');return;}
    processing.current=true;
    setBalanceCoins(c=>c-ENTRY_FEE);
    setBalanceUSD(b=>b-cop);
    setMatchPools(prev=>{const cur=prev[match.id]||{home:0,draw:0,away:0,total:0};
      return{...prev,[match.id]:{...cur,[outcome]:cur[outcome]+cop,total:cur.total+cop}};});
    setPlacedBets(prev=>[...prev,{id:Date.now(),matchId:match.id,home:match.home,away:match.away,
      outcome,currency,displayAmount:n,usdAmount:cop,status:'pending',
      playerName:profile.username,playerAvatar:profile.avatar}]);
    triggerAlert(`✅ ${CURRENCY_SYM[currency]}${Number(n).toLocaleString()} al pozo · -⚡${ENTRY_FEE}`);
    onClose();
  }

  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'#000000cc',zIndex:200,
      display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#0f172a',border:'1px solid #6366f1',
        borderRadius:'20px 20px 0 0',padding:'20px 16px 36px',width:'100%',maxWidth:480}}>
        <div style={{width:40,height:4,background:'#334155',borderRadius:2,margin:'0 auto 18px'}}/>
        <div style={{textAlign:'center',marginBottom:14}}>
          <div style={{color:'#818cf8',fontSize:10,letterSpacing:2,marginBottom:6}}>POZO DEL PARTIDO</div>
          <div style={{fontSize:22}}>{TEAMS[match.home]?.emoji} vs {TEAMS[match.away]?.emoji}</div>
          <div style={{color:'#cbd5e1',fontSize:13,fontWeight:700,marginTop:4}}>{TEAMS[match.home]?.name} – {TEAMS[match.away]?.name}</div>
          {match.status==='live'&&<div style={{color:'#10b981',fontSize:10,marginTop:4}}>● EN VIVO {match.minute}'</div>}
        </div>
        <div style={{background:'#1e1b4b',border:'1px solid #4f46e550',borderRadius:10,padding:'10px 14px',marginBottom:12}}>
          <div style={{color:'#a5b4fc',fontSize:9,letterSpacing:1,marginBottom:8}}>POZO ACUMULADO 🏆</div>
          <div style={{display:'flex',gap:8}}>
            {opts.map(o=>(
              <div key={o.key} style={{flex:1,textAlign:'center'}}>
                <div style={{color:'#64748b',fontSize:9}}>{o.label}</div>
                <div style={{color:'#fbbf24',fontSize:12,fontWeight:800,marginTop:2}}>COP ${(pool[o.key]||0).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:8,color:'#4ade80',fontSize:12,fontWeight:800}}>
            💰 Total: COP ${(pool.total||0).toLocaleString()}
          </div>
        </div>
        <div style={{background:'#1e1b4b',border:'1px solid #4f46e540',borderRadius:8,
          padding:'8px 12px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{color:'#a5b4fc',fontSize:10}}>⚡ Entrada: <b style={{color:'#fbbf24'}}>150 Coins</b></div>
          <div style={{color:balanceCoins>=150?'#4ade80':'#ef4444',fontSize:11,fontWeight:700}}>Tu saldo: ⚡{balanceCoins.toLocaleString()}</div>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:10}}>
          {opts.map(o=>(
            <button key={o.key} onClick={()=>setOutcome(o.key)} style={{flex:1,
              background:outcome===o.key?'#6366f1':'#1e293b',border:`1px solid ${outcome===o.key?'#818cf8':'#334155'}`,
              borderRadius:8,padding:'8px 4px',color:outcome===o.key?'#fff':'#64748b',fontSize:10,fontWeight:700,cursor:'pointer',lineHeight:1.4}}>
              {o.label}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,marginBottom:10}}>
          {['COP','USD','EUR'].map(c=>(
            <button key={c} onClick={()=>{setCurrency(c);setAmount('');}} style={{flex:1,
              background:currency===c?'#6366f1':'#1e293b',border:`1px solid ${currency===c?'#818cf8':'#334155'}`,
              borderRadius:8,padding:'7px 0',color:currency===c?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>{c}</button>
          ))}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#6366f1',fontSize:12,fontWeight:700}}>{CURRENCY_SYM[currency]}</span>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"
              style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:10,
                padding:'12px 12px 12px 64px',color:'#f1f5f9',fontSize:16,fontWeight:700,outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{display:'flex',gap:6,marginTop:6}}>
            {quick[currency].map(v=>(
              <button key={v} onClick={()=>setAmount(v)} style={{flex:1,background:'#1e293b',border:'1px solid #334155',
                borderRadius:7,padding:'5px 0',color:'#94a3b8',fontSize:10,cursor:'pointer'}}>
                {currency==='COP'?`$${(Number(v)/1000).toFixed(0)}K`:`${CURRENCY_SYM[currency]}${v}`}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleBet} style={{width:'100%',background:balanceCoins>=150
          ?'linear-gradient(135deg,#6366f1,#ec4899)':'#374151',border:'none',borderRadius:12,
          padding:14,color:'#fff',fontWeight:800,fontSize:14,cursor:balanceCoins>=150?'pointer':'not-allowed'}}>
          {balanceCoins>=150?'🏆 ENTRAR AL POZO · ⚡150 Coins':'⚡ Coins insuficientes'}
        </button>
        <button onClick={onClose} style={{width:'100%',background:'none',border:'none',color:'#475569',fontSize:12,marginTop:8,cursor:'pointer',padding:6}}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── LIVE TAB ─────────────────────────────────────────────────────────────────
function LiveTab({countdown,matches,apiStatus,placedBets,setPlacedBets,balanceUSD,setBalanceUSD,
                  balanceCoins,setBalanceCoins,matchPools,setMatchPools,triggerAlert,profile}){
  const [betModal,setBetModal]=useState(null);
  const [filter,setFilter]=useState('today');
  const {isOver,days,hours,minutes:cMin,seconds}=countdown;
  const todayStr=new Date().toISOString().slice(0,10);
  const liveCount=matches.filter(m=>m.status==='live').length;
  const finishedCount=matches.filter(m=>m.status==='finished').length;
  const visible=matches.filter(m=>{
    if(filter==='live')return m.status==='live';
    if(filter==='finished')return m.status==='finished';
    if(filter==='today'){const mDate=m.kickoffUTC.slice(0,10);return mDate===todayStr||m.status==='live';}
    return true;
  });

  return(
    <div style={{padding:12}}>
      <style>{`@keyframes dot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      {betModal&&<BetModal match={betModal} balanceCoins={balanceCoins} balanceUSD={balanceUSD}
        setBalanceCoins={setBalanceCoins} setBalanceUSD={setBalanceUSD}
        setPlacedBets={setPlacedBets} matchPools={matchPools} setMatchPools={setMatchPools}
        triggerAlert={triggerAlert} onClose={()=>setBetModal(null)} profile={profile}/>}

      {!isOver&&(
        <div style={{background:'linear-gradient(135deg,#0f172a,#1e1b4b)',border:'1px solid #4f46e5',
          borderRadius:14,padding:'16px 12px',marginBottom:14,textAlign:'center'}}>
          <div style={{color:'#a5b4fc',fontSize:10,letterSpacing:2,marginBottom:10}}>⚽ INICIO DEL MUNDIAL EN</div>
          <div style={{display:'flex',justifyContent:'center',gap:10}}>
            {[['DÍAS',days],['HRS',hours],['MIN',cMin],['SEG',seconds]].map(([l,v])=>(
              <div key={l} style={{background:'#1e1b4b',borderRadius:8,padding:'8px 10px',minWidth:52}}>
                <div style={{color:'#818cf8',fontSize:24,fontWeight:900,lineHeight:1}}>{String(v).padStart(2,'0')}</div>
                <div style={{color:'#6366f1',fontSize:9,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOver&&(
        <div style={{background:'linear-gradient(135deg,#052e16,#0f172a)',border:'1px solid #10b981',
          borderRadius:12,padding:'10px 14px',marginBottom:10,
          display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{color:'#4ade80',fontWeight:900,fontSize:13}}>⚽ MUNDIAL 2026 EN CURSO</div>
            <div style={{color:'#6ee7b7',fontSize:9,marginTop:2}}>
              {liveCount>0?`🔴 ${liveCount} partido${liveCount!==1?'s':''} EN VIVO`:`${finishedCount} partidos jugados`}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
            <div style={{background:'#022c22',border:'1px solid #10b98150',borderRadius:8,padding:'4px 10px',textAlign:'center'}}>
              <div style={{color:'#4ade80',fontSize:10,fontWeight:800}}>{finishedCount}/72</div>
              <div style={{color:'#064e3b',fontSize:8}}>jugados</div>
            </div>
            <div style={{
              background:apiStatus==='live'?'#052e16':apiStatus==='offline'?'#1a0a0a':'#0f1a2e',
              border:`1px solid ${apiStatus==='live'?'#10b98150':apiStatus==='offline'?'#ef444450':'#6366f150'}`,
              borderRadius:6,padding:'2px 7px',display:'flex',alignItems:'center',gap:4}}>
              <span style={{width:5,height:5,borderRadius:'50%',display:'inline-block',
                background:apiStatus==='live'?'#10b981':apiStatus==='offline'?'#ef4444':'#6366f1',
                animation:apiStatus==='connecting'?'dot 1s infinite':undefined}}/>
              <span style={{fontSize:8,fontWeight:700,
                color:apiStatus==='live'?'#4ade80':apiStatus==='offline'?'#f87171':'#a5b4fc'}}>
                {apiStatus==='live'?'API en vivo':apiStatus==='offline'?'Sin API · Reloj local':'Conectando...'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{display:'flex',gap:6,marginBottom:12}}>
        {[['live',`🔴 Vivo${liveCount>0?` (${liveCount})`:''}`],['today','📅 Hoy'],['finished','✓ Jugados'],['all','🌍 Todos']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{flex:1,
            background:filter===id?'#6366f1':'#0f172a',border:`1px solid ${filter===id?'#818cf8':'#1e293b'}`,
            borderRadius:8,padding:'6px 0',color:filter===id?'#fff':'#64748b',fontSize:9,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
        ))}
      </div>

      {visible.length===0&&(
        <div style={{textAlign:'center',padding:'32px 16px',color:'#475569',fontSize:12}}>
          {filter==='live'?'⏳ No hay partidos en vivo ahora mismo.':
           filter==='today'?'No hay partidos programados para hoy.':
           'No hay partidos para este filtro.'}
        </div>
      )}

      {visible.map(match=>{
        const ht=TEAMS[match.home]||{name:match.home,emoji:'⚽'};
        const at=TEAMS[match.away]||{name:match.away,emoji:'⚽'};
        const isLive=match.status==='live';
        const isFinished=match.status==='finished';
        const pool=matchPools[match.id]||{total:0};
        const displayMinute=match.minute<=45?`${match.minute}'`:match.minute<=90?`${match.minute}' (2T)`:`90'+`;

        return(
          <div key={match.id} style={{
            background:isLive?'linear-gradient(180deg,#052e1a,#0f172a)':'#0f172a',
            border:`1px solid ${isLive?'#10b981':isFinished?'#1e293b33':'#1e293b'}`,
            borderRadius:14,padding:14,marginBottom:10,
            boxShadow:isLive?'0 0 18px #10b98120':'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div>
                <span style={{fontSize:9,color:'#64748b',letterSpacing:1}}>{match.group}</span>
                <span style={{marginLeft:6,fontSize:9,color:'#334155'}}>· {match.dateLabel}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                {isLive&&(
                  <span style={{background:'#10b981',color:'#fff',fontSize:9,padding:'2px 9px',
                    borderRadius:99,fontWeight:800,display:'flex',alignItems:'center',gap:4}}>
                    <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',
                      background:'#fff',animation:'dot 1s infinite'}}/>
                    {displayMinute}
                  </span>
                )}
                {isFinished&&<span style={{background:'#1e293b',color:'#64748b',fontSize:9,padding:'2px 8px',borderRadius:99,fontWeight:700}}>✓ FINAL</span>}
                {!isLive&&!isFinished&&<span style={{background:'#1e293b',color:'#64748b',fontSize:9,padding:'2px 8px',borderRadius:99}}>⏰ {match.timeET} ET</span>}
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{textAlign:'center',flex:1}}>
                <div style={{fontSize:30}}>{ht.emoji}</div>
                <div style={{color:'#e2e8f0',fontSize:10,fontWeight:700,marginTop:3,maxWidth:80,margin:'3px auto 0',lineHeight:1.2}}>{ht.name}</div>
              </div>
              <div style={{textAlign:'center',padding:'0 8px',minWidth:80}}>
                {(isLive||isFinished)
                  ?<div style={{fontSize:32,fontWeight:900,color:'#f1f5f9',letterSpacing:2,lineHeight:1}}>
                    {match.scoreHome}<span style={{color:'#334155'}}> – </span>{match.scoreAway}
                  </div>
                  :<div style={{fontSize:16,fontWeight:700,color:'#334155'}}>VS</div>
                }
                {isLive&&<div style={{color:'#10b981',fontSize:8,marginTop:3,fontWeight:700}}>{match.minute<=45?'1ER TIEMPO':'2DO TIEMPO'}</div>}
                {isFinished&&<div style={{color:'#475569',fontSize:8,marginTop:3}}>PARTIDO FINALIZADO</div>}
                {!isLive&&!isFinished&&<div style={{color:'#475569',fontSize:8,marginTop:4}}>{match.stadium?.split('(')[0].trim()}</div>}
              </div>
              <div style={{textAlign:'center',flex:1}}>
                <div style={{fontSize:30}}>{at.emoji}</div>
                <div style={{color:'#e2e8f0',fontSize:10,fontWeight:700,marginTop:3,maxWidth:80,margin:'3px auto 0',lineHeight:1.2}}>{at.name}</div>
              </div>
            </div>
            {pool.total>0&&(
              <div style={{marginTop:10,background:'#0a0f1e',borderRadius:8,padding:'6px 10px',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:'#64748b',fontSize:9}}>💰 POZO</span>
                <span style={{color:'#fbbf24',fontSize:12,fontWeight:800}}>COP ${pool.total.toLocaleString()}</span>
              </div>
            )}
            {isOver&&!isFinished&&(
              <button onClick={()=>setBetModal(match)} style={{width:'100%',marginTop:10,
                background:isLive?'linear-gradient(135deg,#6366f1,#ec4899)':'#1e293b',
                border:`1px solid ${isLive?'#818cf8':'#334155'}`,
                borderRadius:10,padding:'10px 0',cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                <span style={{color:'#f1f5f9',fontWeight:800,fontSize:13}}>🎯 APOSTAR AL POZO</span>
                <span style={{background:'#00000040',borderRadius:6,padding:'2px 7px',color:'#fbbf24',fontSize:10,fontWeight:700}}>⚡150</span>
              </button>
            )}
            {match.events.slice(-3).map((ev,i)=>(
              <div key={i} style={{marginTop:6,background:'#0a0f1e',borderRadius:6,padding:'4px 8px',fontSize:10,color:'#94a3b8'}}>{ev.text}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ─── CALENDAR TAB ─────────────────────────────────────────────────────────────
function CalendarTab({matches}){
  const grouped={};
  ALL_MATCHES_DATA.forEach(m=>{if(!grouped[m.dateLabel])grouped[m.dateLabel]=[];grouped[m.dateLabel].push(m);});
  return(
    <div style={{padding:12}}>
      <div style={{color:'#818cf8',fontSize:10,letterSpacing:2,marginBottom:12}}>📅 FIXTURE OFICIAL MUNDIAL 2026</div>
      {Object.entries(grouped).map(([date,ms])=>(
        <div key={date} style={{marginBottom:16}}>
          <div style={{color:'#6366f1',fontSize:11,fontWeight:700,marginBottom:8,borderLeft:'2px solid #6366f1',paddingLeft:8}}>{date}</div>
          {ms.map(m=>{
            const matchState=matches.find(x=>x.id===m.id);
            const isLive=matchState?.status==='live';
            const isFinished=matchState?.status==='finished';
            const ht=TEAMS[m.home]||{name:m.home,emoji:'⚽'};
            const at=TEAMS[m.away]||{name:m.away,emoji:'⚽'};
            return(
              <div key={m.id} style={{background:'#0f172a',
                border:`1px solid ${isLive?'#10b981':isFinished?'#1e293b33':'#1e293b'}`,
                borderRadius:12,padding:'10px 12px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
                <div style={{textAlign:'center',minWidth:44}}>
                  {isLive
                    ?<div style={{color:'#10b981',fontSize:11,fontWeight:900,display:'flex',alignItems:'center',gap:3}}>
                        <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#10b981',animation:'dot 1s infinite'}}/>
                        {matchState.minute}'
                      </div>
                    :isFinished
                      ?<div style={{color:'#475569',fontSize:10,fontWeight:700}}>✓ FIN</div>
                      :<div style={{color:'#6366f1',fontSize:13,fontWeight:800}}>{m.timeET}</div>
                  }
                  <div style={{color:'#475569',fontSize:8}}>{m.group}</div>
                </div>
                <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:18}}>{ht.emoji}</span>
                    <span style={{color:'#e2e8f0',fontSize:11,fontWeight:700}}>{ht.name}</span>
                  </div>
                  {(isLive||isFinished)
                    ?<span style={{color:'#f1f5f9',fontSize:13,fontWeight:900,letterSpacing:1}}>{matchState.scoreHome}–{matchState.scoreAway}</span>
                    :<span style={{color:'#475569',fontSize:10,fontWeight:700}}>VS</span>
                  }
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:'#e2e8f0',fontSize:11,fontWeight:700}}>{at.name}</span>
                    <span style={{fontSize:18}}>{at.emoji}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── BETS TAB ─────────────────────────────────────────────────────────────────
function BetsTab({placedBets,matchPools}){
  if(!placedBets.length)return(
    <div style={{padding:32,textAlign:'center'}}>
      <div style={{fontSize:40,marginBottom:12}}>🎯</div>
      <div style={{color:'#475569',fontSize:13}}>No tienes apuestas aún.</div>
      <div style={{color:'#334155',fontSize:11,marginTop:4}}>Ve a En Vivo y entra al pozo.</div>
    </div>
  );
  const outLabel=(o,h,a)=>o==='home'?TEAMS[h]?.name:o==='away'?TEAMS[a]?.name:'Empate';
  return(
    <div style={{padding:12}}>
      <div style={{color:'#818cf8',fontSize:10,letterSpacing:2,marginBottom:12}}>MIS APUESTAS</div>
      {placedBets.map(bet=>{
        const pool=matchPools[bet.matchId]||{total:0};
        return(
          <div key={bet.id} style={{background:'#0f172a',
            border:`1px solid ${bet.status==='won'?'#10b981':bet.status==='lost'?'#ef444440':'#1e293b'}`,
            borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:700,color:'#cbd5e1'}}>
                {TEAMS[bet.home]?.emoji} {TEAMS[bet.home]?.name} vs {TEAMS[bet.away]?.emoji} {TEAMS[bet.away]?.name}
              </div>
              {bet.status==='pending'&&<span style={{background:'#f59e0b20',color:'#fbbf24',fontSize:9,padding:'2px 7px',borderRadius:99,fontWeight:700}}>⏳ ACTIVA</span>}
              {bet.status==='won'&&<span style={{background:'#10b98120',color:'#4ade80',fontSize:9,padding:'2px 7px',borderRadius:99,fontWeight:700}}>🏆 GANADA</span>}
              {bet.status==='lost'&&<span style={{background:'#ef444420',color:'#f87171',fontSize:9,padding:'2px 7px',borderRadius:99,fontWeight:700}}>❌ PERDIDA</span>}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#94a3b8'}}>
              <span>Elegiste: <b style={{color:'#818cf8'}}>{outLabel(bet.outcome,bet.home,bet.away)}</b></span>
              <span>Apostado: <b style={{color:'#fbbf24'}}>{CURRENCY_SYM[bet.currency]}{Number(bet.displayAmount).toLocaleString()}</b></span>
            </div>
            {pool.total>0&&(
              <div style={{marginTop:6,fontSize:10,color:'#64748b'}}>
                Pozo: <span style={{color:'#4ade80',fontWeight:700}}>COP ${pool.total.toLocaleString()}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CASHIER TAB ──────────────────────────────────────────────────────────────
function CashierTab({balanceUSD,setBalanceUSD,balanceCoins,setBalanceCoins,triggerAlert}){
  const [sub,setSub]=useState('deposit');
  const [currency,setCurrency]=useState('COP');
  const [amount,setAmount]=useState('50000');
  const [method,setMethod]=useState('card');
  const [account,setAccount]=useState('');
  const [msg,setMsg]=useState(null);
  const processing=useRef(false);
  const MIN_WITHDRAW=50000;
  const sym=CURRENCY_SYM[currency];
  function doDeposit(){
    if(processing.current)return;
    const n=Number(amount);if(!n||n<=0){triggerAlert('⚠️ Monto inválido');return;}
    processing.current=true;
    const cop=Math.round(n/CURRENCY_RATES[currency]);
    const bonus=Math.round(cop*0.1);
    setBalanceUSD(b=>b+cop);
    setBalanceCoins(c=>c+bonus);
    setMsg(`✅ +COP $${cop.toLocaleString()} · Bono +⚡${bonus} Coins`);
    setAmount('');
    setTimeout(()=>{setMsg(null);processing.current=false;},5000);
  }
  function doWithdraw(){
    if(processing.current)return;
    const n=Number(amount);if(!n||n<=0){triggerAlert('⚠️ Monto inválido');return;}
    const cop=Math.round(n/CURRENCY_RATES[currency]);
    if(cop<MIN_WITHDRAW){triggerAlert(`❌ Mínimo de retiro: COP $${MIN_WITHDRAW.toLocaleString()}`);return;}
    if(cop>balanceUSD){triggerAlert('❌ Saldo insuficiente');return;}
    if(!account.trim()){triggerAlert('⚠️ Ingresa tu cuenta destino');return;}
    processing.current=true;
    setBalanceUSD(b=>b-cop);
    setMsg(`💸 Retiro en proceso: COP $${cop.toLocaleString()} → ${account}`);
    setAmount('');
    setTimeout(()=>{setMsg(null);processing.current=false;},5000);
  }
  return(
    <div style={{padding:12}}>
      <div style={{display:'flex',gap:10,marginBottom:14}}>
        {[['💰 Saldo',`COP $${balanceUSD.toLocaleString()}`,'#4ade80'],['⚡ Coins',balanceCoins.toLocaleString(),'#fbbf24']].map(([l,v,c])=>(
          <div key={l} style={{flex:1,background:'#0f172a',border:'1px solid #1e293b',borderRadius:12,padding:12,textAlign:'center'}}>
            <div style={{color:'#64748b',fontSize:9,letterSpacing:1}}>{l}</div>
            <div style={{color:c,fontSize:18,fontWeight:900,marginTop:4}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:14}}>
        {[['deposit','⬇️ Depositar'],['withdraw','⬆️ Retirar']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSub(id)} style={{flex:1,
            background:sub===id?'#6366f1':'#1e293b',border:`1px solid ${sub===id?'#818cf8':'#334155'}`,
            borderRadius:10,padding:'10px 0',color:sub===id?'#fff':'#64748b',fontWeight:700,fontSize:13,cursor:'pointer'}}>{lbl}</button>
        ))}
      </div>
      {msg&&<div style={{background:'#10b98120',border:'1px solid #10b98150',borderRadius:10,
        padding:'10px 14px',marginBottom:12,color:'#4ade80',fontSize:12,fontWeight:700}}>{msg}</div>}
      <div style={{display:'flex',gap:6,marginBottom:10}}>
        {['COP','USD','EUR'].map(c=>(
          <button key={c} onClick={()=>{setCurrency(c);setAmount('');}} style={{flex:1,
            background:currency===c?'#6366f1':'#1e293b',border:`1px solid ${currency===c?'#818cf8':'#334155'}`,
            borderRadius:8,padding:'7px 0',color:currency===c?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>{c}</button>
        ))}
      </div>
      <div style={{marginBottom:12}}>
        <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:6}}>
          {sub==='deposit'?'MONTO A DEPOSITAR':`MONTO (mín. ${sym}${Math.round(MIN_WITHDRAW*CURRENCY_RATES[currency]).toLocaleString()})`}
        </div>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
          style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:10,
            padding:'12px 14px',color:'#f1f5f9',fontSize:16,fontWeight:700,outline:'none',boxSizing:'border-box'}}/>
        <div style={{display:'flex',gap:6,marginTop:6}}>
          {(currency==='COP'?['10000','50000','100000','500000']:currency==='USD'?['3','12','25','125']:['3','11','23','115']).map(v=>(
            <button key={v} onClick={()=>setAmount(v)} style={{flex:1,background:'#1e293b',border:'1px solid #334155',
              borderRadius:7,padding:'5px 0',color:'#94a3b8',fontSize:10,cursor:'pointer'}}>
              {currency==='COP'?`$${(Number(v)/1000).toFixed(0)}K`:`${sym}${v}`}
            </button>
          ))}
        </div>
      </div>
      {sub==='deposit'&&(
        <div style={{display:'flex',gap:6,marginBottom:12}}>
          {[['card','💳 Tarjeta'],['nequi','📱 Nequi'],['crypto','🔐 Cripto']].map(([id,lbl])=>(
            <button key={id} onClick={()=>setMethod(id)} style={{flex:1,
              background:method===id?'#1e293b':'#0f172a',border:`1px solid ${method===id?'#6366f1':'#1e293b'}`,
              borderRadius:8,padding:'8px 4px',color:method===id?'#a5b4fc':'#475569',fontSize:10,fontWeight:700,cursor:'pointer'}}>{lbl}</button>
          ))}
        </div>
      )}
      {sub==='withdraw'&&(
        <div style={{marginBottom:12}}>
          <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:6}}>CUENTA DESTINO</div>
          <input value={account} onChange={e=>setAccount(e.target.value)} placeholder="Cuenta, Nequi o wallet..."
            style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:10,
              padding:'11px 14px',color:'#f1f5f9',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
        </div>
      )}
      <button onClick={sub==='deposit'?doDeposit:doWithdraw} style={{width:'100%',
        background:'linear-gradient(135deg,#6366f1,#ec4899)',border:'none',borderRadius:12,
        padding:14,color:'#fff',fontWeight:800,fontSize:14,cursor:'pointer'}}>
        {sub==='deposit'?'💵 CONFIRMAR DEPÓSITO':'💸 SOLICITAR RETIRO'}
      </button>
      {sub==='deposit'&&<div style={{marginTop:10,background:'#1e1b4b',border:'1px solid #4f46e540',
        borderRadius:8,padding:'8px 12px',fontSize:10,color:'#a5b4fc',textAlign:'center'}}>
        🎁 Cada depósito te da <b>10% en CyberCoins</b> de bono
      </div>}
    </div>
  );
}

// ─── BUY COINS MODAL ──────────────────────────────────────────────────────────
function BuyCoinsModal({balanceUSD,setBalanceUSD,setBalanceCoins,triggerAlert,onClose}){
  const [currency,setCurrency]=useState('COP');
  const processing=useRef(false);
  function getPrice(p){return currency==='COP'?`COP $${p.priceCOP.toLocaleString()}`:currency==='USD'?`USD $${p.priceUSD.toFixed(2)}`:`EUR €${p.priceEUR.toFixed(2)}`;}
  function buy(p){
    if(processing.current)return;
    if(balanceUSD<p.priceCOP){triggerAlert('❌ Saldo insuficiente · Recarga en Cajero 💳');return;}
    processing.current=true;
    setBalanceUSD(b=>b-p.priceCOP);
    setBalanceCoins(c=>c+p.coins);
    triggerAlert(`⚡ ¡+${p.coins.toLocaleString()} CyberCoins añadidos!`);
    onClose();
  }
  return(
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'#000000cc',zIndex:300,
      display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#0f172a',border:'1px solid #6366f1',
        borderRadius:'20px 20px 0 0',padding:'20px 16px 36px',width:'100%',maxWidth:480}}>
        <div style={{width:40,height:4,background:'#334155',borderRadius:2,margin:'0 auto 18px'}}/>
        <div style={{textAlign:'center',marginBottom:16}}>
          <div style={{fontSize:11,color:'#818cf8',letterSpacing:2,fontWeight:700}}>COMPRAR CYBERCOINS</div>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:16}}>
          {['COP','USD','EUR'].map(c=>(
            <button key={c} onClick={()=>setCurrency(c)} style={{flex:1,
              background:currency===c?'#6366f1':'#1e293b',border:`1px solid ${currency===c?'#818cf8':'#334155'}`,
              borderRadius:8,padding:'7px 0',color:currency===c?'#fff':'#64748b',fontSize:11,fontWeight:700,cursor:'pointer'}}>{c}</button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:8}}>
          {COIN_PACKS.map(p=>(
            <div key={p.id} style={{background:p.bg,border:`2px solid ${p.border}`,borderRadius:16,
              padding:'16px 12px',textAlign:'center',position:'relative',boxShadow:`0 0 16px ${p.border}30`}}>
              {p.badge&&<div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',
                background:p.color,color:'#000',fontSize:8,fontWeight:900,padding:'2px 10px',borderRadius:99,whiteSpace:'nowrap'}}>{p.badge}</div>}
              <div style={{fontSize:36,marginBottom:6}}>{p.emoji}</div>
              <div style={{color:p.color,fontSize:9,fontWeight:900,letterSpacing:1,marginBottom:4}}>{p.label.toUpperCase()}</div>
              <div style={{color:'#f1f5f9',fontSize:26,fontWeight:900,lineHeight:1}}>{p.coins.toLocaleString()}</div>
              <div style={{color:'#64748b',fontSize:10,marginBottom:12}}>CyberCoins</div>
              <div style={{color:p.color,fontSize:16,fontWeight:900,marginBottom:14}}>{getPrice(p)}</div>
              <button onClick={()=>buy(p)} style={{width:'100%',background:`linear-gradient(135deg,${p.color},${p.color}99)`,
                border:'none',borderRadius:10,padding:'11px 0',
                color:p.id==='p2k'?'#fff':'#000',fontWeight:800,fontSize:13,cursor:'pointer'}}>Comprar</button>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{width:'100%',background:'none',border:'none',color:'#475569',fontSize:12,marginTop:10,cursor:'pointer',padding:6}}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({profile,setProfile,placedBets,balanceUSD,setBalanceUSD,balanceCoins,setBalanceCoins,collection,triggerAlert}){
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState({...profile});
  const [showBuy,setShowBuy]=useState(false);
  const won=placedBets.filter(b=>b.status==='won').length;
  const total=placedBets.length;
  const wr=total>0?Math.round((won/total)*100):0;
  const totalCards=Object.keys(collection).length;
  const banner=BANNERS.find(b=>b.id===(editing?draft.bannerId:profile.bannerId))||BANNERS[0];
  return(
    <div style={{paddingBottom:20}}>
      {showBuy&&<BuyCoinsModal balanceUSD={balanceUSD} setBalanceUSD={setBalanceUSD}
        setBalanceCoins={setBalanceCoins} triggerAlert={triggerAlert} onClose={()=>setShowBuy(false)}/>}
      <div style={{position:'relative',height:110,background:banner.style}}>
        <div style={{position:'absolute',bottom:-30,left:16,background:'#0f172a',
          border:'3px solid #0f172a',borderRadius:'50%',width:64,height:64,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:30}}>
          {editing?draft.avatar:profile.avatar}
        </div>
        {!editing&&<button onClick={()=>{setDraft({...profile});setEditing(true);}}
          style={{position:'absolute',top:10,right:12,background:'#00000060',
            border:'1px solid #ffffff30',borderRadius:8,padding:'5px 10px',
            color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer'}}>✏️ Editar</button>}
      </div>
      <div style={{padding:'38px 16px 0'}}>
        {!editing?(
          <>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:18,fontWeight:900,color:'#f1f5f9'}}>{profile.username}</div>
              <div style={{fontSize:11,color:'#818cf8',marginTop:2}}>{profile.title}</div>
              {profile.bio&&<div style={{fontSize:11,color:'#64748b',marginTop:6}}>{profile.bio}</div>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:16}}>
              {[['Apuestas',total,'🎯'],['Ganadas',won,'🏆'],['Win Rate',`${wr}%`,'📈'],['Figuras',totalCards,'🃏']].map(([l,v,ic])=>(
                <div key={l} style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:10,padding:'10px 6px',textAlign:'center'}}>
                  <div style={{fontSize:18}}>{ic}</div>
                  <div style={{color:'#f1f5f9',fontWeight:800,fontSize:15,marginTop:2}}>{v}</div>
                  <div style={{color:'#475569',fontSize:8,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:12,padding:14,marginBottom:14}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:10}}>MI CARTERA</div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{color:'#94a3b8',fontSize:12}}>Saldo real</span>
                <span style={{color:'#4ade80',fontSize:12,fontWeight:700}}>COP ${balanceUSD.toLocaleString()}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span style={{color:'#94a3b8',fontSize:12}}>CyberCoins</span>
                <span style={{color:'#fbbf24',fontSize:12,fontWeight:700}}>⚡{balanceCoins.toLocaleString()}</span>
              </div>
            </div>
            <div style={{background:'linear-gradient(135deg,#1e1b4b,#0f172a)',border:'2px solid #6366f1',
              borderRadius:14,padding:14,marginBottom:14}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div>
                  <div style={{color:'#a5b4fc',fontSize:10,fontWeight:900,letterSpacing:1}}>⚡ COMPRAR CYBERCOINS</div>
                  <div style={{color:'#475569',fontSize:9,marginTop:2}}>Para apostar y abrir sobres</div>
                </div>
                <div style={{fontSize:24}}>💎</div>
              </div>
              <button onClick={()=>setShowBuy(true)} style={{width:'100%',
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',
                borderRadius:10,padding:'12px 0',color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer'}}>
                ⚡ Comprar CyberCoins
              </button>
            </div>
            {profile.favTeam&&TEAMS[profile.favTeam]&&(
              <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:12,
                padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:28}}>{TEAMS[profile.favTeam].emoji}</span>
                <div>
                  <div style={{color:'#64748b',fontSize:9,letterSpacing:1}}>EQUIPO FAVORITO</div>
                  <div style={{color:'#e2e8f0',fontWeight:700,fontSize:13}}>{TEAMS[profile.favTeam].name}</div>
                </div>
              </div>
            )}
          </>
        ):(
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{color:'#818cf8',fontSize:11,fontWeight:700,letterSpacing:1}}>EDITAR PERFIL</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>{setProfile(draft);setEditing(false);}} style={{background:'#10b981',border:'none',borderRadius:8,padding:'6px 12px',color:'#fff',fontWeight:700,fontSize:11,cursor:'pointer'}}>✓ Guardar</button>
                <button onClick={()=>setEditing(false)} style={{background:'#374151',border:'none',borderRadius:8,padding:'6px 12px',color:'#fff',fontWeight:700,fontSize:11,cursor:'pointer'}}>✕ Cancelar</button>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:6}}>NOMBRE DE USUARIO</div>
              <input value={draft.username} onChange={e=>setDraft(d=>({...d,username:e.target.value}))}
                style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:10,
                  padding:'11px 14px',color:'#f1f5f9',fontSize:14,fontWeight:700,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:6}}>BIO</div>
              <textarea value={draft.bio} onChange={e=>setDraft(d=>({...d,bio:e.target.value}))}
                placeholder="Cuéntanos algo..." rows={2}
                style={{width:'100%',background:'#1e293b',border:'1px solid #334155',borderRadius:10,
                  padding:'11px 14px',color:'#f1f5f9',fontSize:12,resize:'none',outline:'none',boxSizing:'border-box',fontFamily:'inherit'}}/>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:8}}>AVATAR</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:6}}>
                {AVATARS.map(av=>(
                  <button key={av} onClick={()=>setDraft(d=>({...d,avatar:av}))}
                    style={{background:draft.avatar===av?'#6366f1':'#1e293b',
                      border:`1px solid ${draft.avatar===av?'#818cf8':'#334155'}`,
                      borderRadius:8,padding:'6px 0',fontSize:18,cursor:'pointer'}}>{av}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:8}}>BANNER</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
                {BANNERS.map(b=>(
                  <button key={b.id} onClick={()=>setDraft(d=>({...d,bannerId:b.id}))}
                    style={{background:b.style,border:`2px solid ${draft.bannerId===b.id?'#fff':'transparent'}`,
                      borderRadius:8,height:32,cursor:'pointer',position:'relative'}}>
                    {draft.bannerId===b.id&&<span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12}}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:8}}>TÍTULO</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {TITLES.map(t=>(
                  <button key={t} onClick={()=>setDraft(d=>({...d,title:t}))}
                    style={{background:draft.title===t?'#6366f1':'#1e293b',
                      border:`1px solid ${draft.title===t?'#818cf8':'#334155'}`,
                      borderRadius:20,padding:'5px 12px',color:draft.title===t?'#fff':'#64748b',
                      fontSize:11,fontWeight:700,cursor:'pointer'}}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{color:'#64748b',fontSize:9,letterSpacing:1,marginBottom:8}}>EQUIPO FAVORITO</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,maxHeight:160,overflowY:'auto'}}>
                {Object.entries(TEAMS).map(([code,t])=>(
                  <button key={code} onClick={()=>setDraft(d=>({...d,favTeam:code}))}
                    style={{background:draft.favTeam===code?'#1e293b':'#0f172a',
                      border:`1px solid ${draft.favTeam===code?'#6366f1':'#1e293b'}`,
                      borderRadius:8,padding:'6px 4px',cursor:'pointer',
                      display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <span style={{fontSize:16}}>{t.emoji}</span>
                    <span style={{color:draft.favTeam===code?'#a5b4fc':'#475569',fontSize:8,fontWeight:700}}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── EARN TAB ─────────────────────────────────────────────────────────────────
function EarnTab({balanceCoins,setBalanceCoins,triggerAlert}){
  const [watching,setWatching]=useState(null); // null | 'watching' | 'done'
  const [cooldowns,setCooldowns]=useState({});  // id -> timestamp cuando termina cooldown
  const [timeLeft,setTimeLeft]=useState(0);
  const timerRef=useRef(null);

  const TASKS=[
    {id:'ad1',  title:'Ver anuncio corto',   desc:'Mira 15 segundos de anuncio',  coins:50,  wait:15, icon:'📺'},
    {id:'ad2',  title:'Ver anuncio largo',   desc:'Mira 30 segundos de anuncio',  coins:120, wait:30, icon:'🎬'},
    {id:'ad3',  title:'Anuncio especial',    desc:'Mira 60 segundos y gana más',  coins:250, wait:60, icon:'⭐'},
    {id:'daily',title:'Bono diario',         desc:'Reclama tu bono de cada día',  coins:200, wait:0,  icon:'🎁', daily:true},
    {id:'share',title:'Compartir la app',    desc:'Copia el link y compártelo',   coins:100, wait:0,  icon:'🔗', share:true},
  ];

  // Tick del timer mientras se ve un anuncio
  useEffect(()=>{
    if(watching==='watching'&&timeLeft>0){
      timerRef.current=setTimeout(()=>setTimeLeft(t=>t-1),1000);
    } else if(watching==='watching'&&timeLeft===0){
      setWatching('done');
    }
    return()=>clearTimeout(timerRef.current);
  },[watching,timeLeft]);

  function startWatch(task){
    if(isCooldown(task.id))return;
    setWatching({...task});
    setTimeLeft(task.wait||15);
  }

  function claimReward(task){
    setBalanceCoins(c=>c+task.coins);
    setCooldowns(prev=>({...prev,[task.id]:Date.now()+86400000})); // 24h cooldown
    triggerAlert(`⚡ +${task.coins} CyberCoins ganados!`);
    setWatching(null);
  }

  function isCooldown(id){
    const cd=cooldowns[id];
    if(!cd)return false;
    return Date.now()<cd;
  }

  function cooldownLabel(id){
    const cd=cooldowns[id];
    if(!cd||Date.now()>=cd)return null;
    const left=Math.ceil((cd-Date.now())/3600000);
    return `${left}h`;
  }

  const totalEarned=Object.values(cooldowns).filter(v=>Date.now()<v).length;

  return(
    <div style={{padding:12}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#1e1b4b,#0f172a)',border:'2px solid #6366f1',
        borderRadius:16,padding:16,marginBottom:16,textAlign:'center',boxShadow:'0 0 24px #6366f130'}}>
        <div style={{fontSize:36,marginBottom:6}}>⚡</div>
        <div style={{color:'#a5b4fc',fontSize:11,fontWeight:900,letterSpacing:2,marginBottom:4}}>GANAR CYBERCOINS</div>
        <div style={{color:'#f1f5f9',fontSize:13,marginBottom:8}}>Mira anuncios y gana coins gratis</div>
        <div style={{background:'#0f172a',borderRadius:10,padding:'8px 16px',display:'inline-block'}}>
          <span style={{color:'#fbbf24',fontSize:20,fontWeight:900}}>⚡{balanceCoins.toLocaleString()}</span>
          <span style={{color:'#475569',fontSize:10,marginLeft:6}}>coins disponibles</span>
        </div>
      </div>

      {/* Modal de anuncio */}
      {watching&&(
        <div style={{position:'fixed',inset:0,background:'#000000ee',zIndex:400,
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
          <div style={{background:'#0f172a',border:'2px solid #6366f1',borderRadius:20,
            padding:28,width:'100%',maxWidth:380,textAlign:'center'}}>
            {watching==='done'?(
              <>
                <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                <div style={{color:'#4ade80',fontSize:18,fontWeight:900,marginBottom:6}}>¡Listo!</div>
                <div style={{color:'#94a3b8',fontSize:13,marginBottom:20}}>
                  Ganaste <span style={{color:'#fbbf24',fontWeight:900}}>⚡{watching.coins} Coins</span>
                </div>
                <button onClick={()=>claimReward(watching)} style={{width:'100%',
                  background:'linear-gradient(135deg,#6366f1,#ec4899)',border:'none',
                  borderRadius:12,padding:14,color:'#fff',fontWeight:900,fontSize:16,cursor:'pointer'}}>
                  🎁 RECLAMAR ⚡{watching.coins} COINS
                </button>
              </>
            ):(
              <>
                <div style={{fontSize:40,marginBottom:12}}>{watching.icon}</div>
                <div style={{color:'#a5b4fc',fontSize:11,letterSpacing:2,marginBottom:6}}>ANUNCIO EN CURSO</div>
                <div style={{color:'#f1f5f9',fontSize:15,fontWeight:700,marginBottom:16}}>{watching.title}</div>

                {/* Barra de progreso */}
                <div style={{background:'#1e293b',borderRadius:99,height:10,marginBottom:8,overflow:'hidden'}}>
                  <div style={{
                    background:'linear-gradient(90deg,#6366f1,#ec4899)',
                    height:'100%',borderRadius:99,
                    width:`${(1-(timeLeft/(watching.wait||15)))*100}%`,
                    transition:'width 1s linear'
                  }}/>
                </div>
                <div style={{color:'#64748b',fontSize:12,marginBottom:16}}>
                  Quedan <span style={{color:'#fbbf24',fontWeight:700}}>{timeLeft}s</span>
                </div>

                {/* Simulación del anuncio AADS */}
                <div style={{background:'#1e293b',borderRadius:12,padding:16,marginBottom:16,
                  border:'1px solid #334155',minHeight:80,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <iframe
                    data-aa="2448388"
                    src="//acceptable.a-ads.com/2448388/?size=Adaptive"
                    style={{border:0,padding:0,width:'100%',height:80,overflow:'hidden'}}
                    title="ad"
                  />
                </div>

                <button onClick={()=>setWatching(null)} style={{background:'none',border:'none',
                  color:'#475569',fontSize:12,cursor:'pointer',padding:6}}>Cancelar</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div style={{color:'#64748b',fontSize:9,letterSpacing:2,marginBottom:10}}>FORMAS DE GANAR</div>
      {TASKS.map(task=>{
        const cd=isCooldown(task.id);
        const cdLabel=cooldownLabel(task.id);
        return(
          <div key={task.id} style={{background:'#0f172a',border:`1px solid ${cd?'#1e293b':'#334155'}`,
            borderRadius:14,padding:'14px 16px',marginBottom:10,
            display:'flex',alignItems:'center',justifyContent:'space-between',
            opacity:cd?0.5:1}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontSize:28,lineHeight:1}}>{task.icon}</div>
              <div>
                <div style={{color:'#f1f5f9',fontSize:13,fontWeight:700}}>{task.title}</div>
                <div style={{color:'#475569',fontSize:10,marginTop:2}}>{task.desc}</div>
                <div style={{color:'#fbbf24',fontSize:11,fontWeight:800,marginTop:4}}>+⚡{task.coins} Coins</div>
              </div>
            </div>
            <button
              onClick={()=>{
                if(cd)return;
                if(task.share){
                  navigator.clipboard?.writeText('https://a-world-cup.vercel.app').catch(()=>{});
                  triggerAlert('🔗 Link copiado! Comparte y gana ⚡100');
                  setCooldowns(prev=>({...prev,[task.id]:Date.now()+86400000}));
                  setBalanceCoins(c=>c+task.coins);
                  return;
                }
                if(task.daily){
                  setBalanceCoins(c=>c+task.coins);
                  setCooldowns(prev=>({...prev,[task.id]:Date.now()+86400000}));
                  triggerAlert(`🎁 ¡Bono diario reclamado! +⚡${task.coins}`);
                  return;
                }
                startWatch(task);
              }}
              style={{
                background:cd?'#1e293b':'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border:'none',borderRadius:10,padding:'8px 14px',
                color:cd?'#475569':'#fff',fontSize:11,fontWeight:800,
                cursor:cd?'not-allowed':'pointer',whiteSpace:'nowrap',minWidth:80,textAlign:'center'
              }}>
              {cd?`⏳ ${cdLabel}`:'Ver →'}
            </button>
          </div>
        );
      })}

      {/* Info */}
      <div style={{background:'#0f172a',border:'1px solid #1e293b',borderRadius:12,
        padding:'10px 14px',marginTop:4,textAlign:'center'}}>
        <div style={{color:'#334155',fontSize:10}}>
          Los Coins ganados se pueden usar para apostar y abrir sobres del álbum
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const [activeTab,setActiveTab]=useState('live');
  const [balanceUSD,setBalanceUSD]=useState(0);
  const [balanceCoins,setBalanceCoins]=useState(1200);
  const [placedBets,setPlacedBets]=useState([]);
  const [matchPools,setMatchPools]=useState({});
  const [collection,setCollection]=useState({});
  const [albumCurrency,setAlbumCurrency]=useState('COP');
  const [toast,setToast]=useState(null);
  const toastTimer=useRef(null);
  const [profile,setProfile]=useState({
    username:'Apostador_Pro',avatar:'⚽',bannerId:'b1',bio:'',title:'Rookie',favTeam:'COL',
  });

  const countdown=useCountdown();
  const {matches,apiStatus}=useMatches();

  const triggerAlert=useCallback(msg=>{
    if(toastTimer.current)clearTimeout(toastTimer.current);
    setToast(msg);toastTimer.current=setTimeout(()=>setToast(null),3500);
  },[]);

  const liveCount=matches.filter(m=>m.status==='live').length;

  return(
    <div style={{minHeight:'100vh',background:'#020817',color:'#f1f5f9',
      fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',maxWidth:480,margin:'0 auto',position:'relative'}}>
      <style>{`@keyframes dot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>

      <Toast msg={toast}/>
      <div style={{background:'#0f172a',borderBottom:'1px solid #1e293b',
        padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',
        position:'sticky',top:0,zIndex:100}}>
        <div>
          <div style={{color:'#818cf8',fontWeight:900,fontSize:17,letterSpacing:1}}>
            CYBER<span style={{color:'#f1f5f9'}}>APUESTAS</span>
          </div>
          <div style={{color:'#475569',fontSize:9,marginTop:1,display:'flex',alignItems:'center',gap:4}}>
            Mundial 2026 · Pool Betting
            {liveCount>0&&(
              <span style={{background:'#10b981',color:'#fff',fontSize:8,padding:'1px 5px',borderRadius:99,fontWeight:800,display:'flex',alignItems:'center',gap:3}}>
                <span style={{width:4,height:4,borderRadius:'50%',background:'#fff',display:'inline-block',animation:'dot 1s infinite'}}/>
                {liveCount} VIVO
              </span>
            )}
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <div style={{textAlign:'center'}}>
            <div style={{color:'#fbbf24',fontSize:13,fontWeight:800}}>⚡{balanceCoins.toLocaleString()}</div>
            <div style={{color:'#475569',fontSize:8}}>Coins</div>
          </div>
          <div style={{width:1,background:'#1e293b'}}/>
          <div style={{textAlign:'center'}}>
            <div style={{color:'#4ade80',fontSize:13,fontWeight:800}}>${balanceUSD.toLocaleString()}</div>
            <div style={{color:'#475569',fontSize:8}}>COP</div>
          </div>
        </div>
      </div>
      {/* ── AADS AD UNIT 2448388 ── */}
      <div style={{position:'fixed',bottom:56,left:0,right:0,zIndex:200,textAlign:'center',pointerEvents:'none'}}>
        <div style={{position:'relative',display:'inline-block',width:'100%',maxWidth:480,pointerEvents:'all'}}>
          <input type="checkbox" id="aadsstickymrtfmwpo" hidden/>
          <label htmlFor="aadsstickymrtfmwpo" style={{
            position:'absolute',top:4,right:8,borderRadius:4,
            background:'rgba(248,248,249,0.85)',padding:'2px 5px',
            zIndex:201,cursor:'pointer',lineHeight:0,display:'inline-block'
          }}
