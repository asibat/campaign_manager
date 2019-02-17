const CAMPAIGNS = [
  {
    _id: '5a26396b99173b18b360bf23',
    campaignId: '50500',
    name: 'western union',
    product: '2250520',
    startDate: '2019-02-15T14:00:00.000Z',
    endDate: '2019-02-19T14:00:00.000Z',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf24',
    campaignId: '50501',
    name: 'the hershey',
    product: '2250576',
    startDate: '2019-02-18T05:00:00.000Z',
    endDate: '2019-02-21T04:00:00.000Z',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf28',
    campaignId: '50502',
    name: 'wells fargo & company',
    product: '2250582',
    startDate: '2019-01-05T09:00:00.000Z',
    endDate: '2019-01-10T21:00:00.000Z',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf26',
    campaignId: '50503',
    name: 'boston scientific corporation',
    product: '2250573',
    startDate: '2018-03-10T03:00:00.000Z',
    endDate: '2018-03-15T03:00:00.000Z',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf25',
    campaignId: '50504',
    name: 'plains all american pipeline',
    product: '2250572',
    startDate: '2018-05-15T07:00:00.000Z',
    endDate: '2018-06-15T07:00:00.000Z',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf22',
    campaignId: '50505',
    name: 'cabela',
    product: '2250570',
    startDate: '2018-02-05T08:00:00.000Z',
    endDate: '2018-03-05T08:00:00.000Z',
    source: 'api'
  }
]

const PRODUCTS = [
  {
    _id: '5a26396b99173b18b360bf01',
    productId: '2250570',
    name: 'stanley fatmax value bundle',
    company: 'stanley',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf02',
    productId: '2250571',
    name: 'gmc power equipment 4.6 gallon gmc syclone 4620a ultra quiet and oil free air compressor',
    company: 'gmc',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf03',
    productId: '2250572',
    name: 'skil 7510-01 3-inch x 18-inch auto track belt sander',
    company: 'Sand',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf04',
    productId: '2250573',
    name: 'hitachi 200-piece mini grinder accessory set',
    company: 'Hitatchu',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf05',
    productId: '2250574',
    name: 'rockwell shopseries 1.5 amp corner sander kit',
    company: 'rockwell',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf06',
    productId: '2250575',
    name: 'surebonder cordless high temperature glue gun',
    company: 'surebonder',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf07',
    productId: '2250576',
    name: 'hitachi',
    company: 'Hitatchu',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf08',
    productId: '2250577',
    name: 'hitachi 8 sliding compound miter saw with laser marker & led light',
    company: 'somthing',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf09',
    productId: '2250578',
    name: 'vermont american 5 15 tpi multi purpose pinned end scroll jig saw blade 30408',
    company: 'vermont',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf10',
    productId: '2250579',
    name: 'campbell hausfeld lever safety blowgun kit',
    company: 'campbell',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf11',
    productId: '2250580',
    name: 'eclipse 900-206 helping hands with solder iron holder - 2.5x',
    company: 'eclipse',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf12',
    productId: '2250581',
    name: 'black and decker reciprocating saw, rs600k',
    company: 'decker',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf13',
    productId: '2250582',
    name: 'century drill and tool reciprocating saw blade (set of 4)',
    company: 'century',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf14',
    productId: '2250583',
    name: 'hitachi 1 3/8" 23 gauge pin nailer',
    company: 'hitachi',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf15',
    productId: '2250584',
    name: 'wilmar electric impact gun set 1/2 dr',
    company: 'wilmar',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf16',
    productId: '2250585',
    name: 'astro pneumatic 223k air belt sander',
    company: 'astro',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf17',
    name: 'skil 9295-01 4-1/2" angle grinder',
    company: 'skil',
    productId: '2250586',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf18',
    productId: '2250587',
    company: 'edelmann',
    source: 'import',
    name: 'plews & edelmann lever-action grease gun, 6" extension, 6, 000psi, 14oz cartridge'
  },
  {
    _id: '5a26396b99173b18b360bf19',
    name: 'gmc power equipment 1.6 gallon gmc syclone 1650a ultra quiet and oil-free air compressor',
    productId: '2250588',
    company: 'edelm',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf20',
    productId: '22505877',
    company: 'qep',
    source: 'import',
    name: 'qep tile tools 60089 7" portable tile saw'
  },
  {
    _id: '5a26396b99173b18b360bf30',
    productId: '2250520',
    company: 'dixon',
    source: 'api',
    name: 'dixon valve air chief industrial quick connect fittings - dc25 septls238dc25'
  },
  {
    _id: '5a26396b99173b18b360bf31',
    productId: '2250521',
    company: 'bostitch',
    source: 'api',
    name: 'bostitch low-profile paper tape framing nailer, lpf33pt'
  },
  {
    _id: '5a26396b99173b18b360bf32',
    name: 'dewalt dc750ka 9. 6-volt cordless drill/driver kit',
    productId: '2250522',
    company: 'dewalt',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf33',
    name: 'hitachi 4.5 x 5.5 sv12sg perforfeltpad',
    productId: '2250523',
    company: 'hitachi',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf34',
    name: 'gmc power equipment 6.3 gallon gmc syclone 6310 ultra quiet and oil-free air compressor',
    productId: '2250523',
    company: 'hitachi',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf35',
    name: 'stalwart flexible drive shaft',
    productId: '2250524',
    company: 'stalwart',
    source: 'api'
  },
  {
    _id: '5a26396b99173b18b360bf36',
    name: 'lumberjack tools tac2000 2-inch commercial series tenon cutter',
    productId: '2250525',
    company: 'jack and sons',
    source: 'import'
  },
  {
    _id: '5a26396b99173b18b360bf37',
    productId: '2250526',
    company: 'rand',
    source: 'import',
    name: 'ingersoll rand 244a 1/2-inch drive super duty impact wrench'
  },
  {
    _id: '5a26396b99173b18b360bf38',
    productId: '2250527',
    company: 'cheer',
    source: 'api',
    name: '12-volt lith-ion drill w/ bonus case & 150-piece socket set'
  },
  {
    _id: '5a26396b99173b18b360bf39',
    productId: '2250528',
    company: 'northy',
    source: 'api',
    name: 'north american tool 51872 80-piece mini rotary tool kit'
  },
  {
    _id: '5a26396b99173b18b360bf40',
    productId: '2250529',
    company: 'deker',
    source: 'api',
    name: 'black & decker 7.5-amp reciprocating saw'
  },
  {
    _id: '5a26396b99173b18b360bf41',
    productId: '2250530',
    company: 'hitachi',
    source: 'api',
    name: 'hitachi 3/8" 6 amp drill with keyless chuck'
  },
  {
    _id: '5a26396b99173b18b360bf42',
    productId: '2250531',
    company: 'campbell',
    source: 'api',
    name: 'campbell hausfeld 3-gallon compressor'
  },
  {
    _id: '5a26396b99173b18b360bf43',
    productId: '2250532',
    company: 'hitachi',
    source: 'api',
    name: 'hitachi 2 1/4 horsepower 11 amp plunge and fixed base variable speed router kit'
  },
  {
    _id: '5a26396b99173b18b360bf44',
    productId: '2250533',
    company: 'bostitch',
    source: 'api',
    name: 'bostitch 15 amp 7 1/4" heavy duty circular saw, bte300k'
  }
]

const SOURCES = {
  API: 'api',
  IMPORT: 'import'
}

const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  ARCHIVED: 'archived'
}

const SHORT_ID_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~'

module.exports = { PRODUCTS, CAMPAIGNS, SOURCES, CAMPAIGN_STATUS, SHORT_ID_CHARACTERS }
