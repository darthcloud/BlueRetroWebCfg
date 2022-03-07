var brUuid = [
    '56830f56-5180-fab0-314b-2fa176799a00',
    '56830f56-5180-fab0-314b-2fa176799a01',
    '56830f56-5180-fab0-314b-2fa176799a02',
    '56830f56-5180-fab0-314b-2fa176799a03',
    '56830f56-5180-fab0-314b-2fa176799a04',
    '56830f56-5180-fab0-314b-2fa176799a05',
    '56830f56-5180-fab0-314b-2fa176799a06',
];

var labelName = [
    'Default',
    'Keyboard',
    'Mouse',
    'PS3',
    'PS4 / PS5',
    'Wiimote',
    'Wiimote + Classic',
    'Wiimote + Nunchuck',
    'WiiU / Switch Pro',
    'Switch NES',
    'Switch SNES',
    'Switch MD / Genesis',
    'Switch N64',
    'Switch Joycon',
    'Xbox One S / X|S',
    'Steam',
    'NeoGeo (Paraller 1P)',
    'PCE',
    'PCE 6 btns',
    'NES',
    'SNES',
    'CD-i',
    'JVS',
    '3DO',
    'Jaguar',
    'Jaguar 6D',
    'PC-FX',
    'Virtual Boy',
    'N64',
    'GameCube',
    'Atari / SMS',
    'MD / Genesis',
    'Saturn',
    'Dreamcast',
    'PSX / PS2',
];

var btnList = [
/*    Default                      Keyboard             Mouse                PS3                  PS4 / PS5            Wiimote              Wiimote + Classic    Wiimote + Nunchuck   WiiU / Switch Pro    Switch NES           Switch SNES          Switch MD / Genesis  Switch N64           Switch Joycon        Xbox One S / X|S     Steam                NeoGeo (Parallel 1P) PCE                  PCE 6 btns           NES                  SNES                 CD-i                 JVS                  3DO                  Jaguar         Jaguar 6D             PC-FX                VB                          N64                         GameCube             Atari / SMS          MD / Genesis         Saturn               Dreamcast            PSX / PS2           */
    ['GP: LX Left;  KB: A',       'KB: A',             '',                  'Left stick left',   'Left stick left',   '',                '[C] Left stick left',  '[N] Stick left',   'Left stick left',   '',                  '',                  '',                  'Stick left',        'Stick left (H)',    'Left stick left',   'Left pad left',     '',                  '',                  '',                  '',                  '',                  'Stick left',        'Stick left',        '*Stick left',       '8 (Y)',   'Left stick left (X)',    '',                  '',                         'Stick left',               'Left stick left',   '',                  '',                  '*Stick left',       'Left stick left',   'Left stick left',  ],
    ['GP: LX Right; KB: D',       'KB: D',             '',                  'Left stick right',  'Left stick right',  '',                '[C] Left stick right', '[N] Stick right',  'Left stick right',  '',                  '',                  '',                  'Stick right',       'Stick right (H)',   'Left stick right',  'Left pad right',    '',                  '',                  '',                  '',                  '',                  'Stick right',       'Stick right',       '*Stick right',      '6',       'Left stick right (X)',   '',                  '',                         'Stick right',              'Left stick right',  '',                  '',                  '*Stick right',      'Left stick right',  'Left stick right', ],
    ['GP: LY Down;  KB: S',       'KB: S',             '',                  'Left stick down',   'Left stick down',   '',                '[C] Left stick down',  '[N] Stick down',   'Left stick down',   '',                  '',                  '',                  'Stick down',        'Stick down (H)',    'Left stick down',   'Left pad down',     '',                  '',                  '',                  '',                  '',                  'Stick down',        'Stick down',        '*Stick down',       '7 (Z)',   'Left stick down (Y)',    '',                  '',                         'Stick down',               'Left stick down',   '',                  '',                  '*Stick down',       'Left stick down',   'Left stick down',  ],
    ['GP: LY Up;    KB: W',       'KB: W',             '',                  'Left stick up',     'Left stick up',     '',                '[C] Left stick up',    '[N] Stick up',     'Left stick up',     '',                  '',                  '',                  'Stick up',          'Stick up (H)',      'Left stick up',     'Left pad up',       '',                  '',                  '',                  '',                  '',                  'Stick up',          'Stick up',          '*Stick up',         '5',       'Left stick up (Y)',      '',                  '',                         'Stick up',                 'Left stick up',     '',                  '',                  '*Stick up',         'Left stick up',     'Left stick up',    ],
    ['GP: RX Left;  M: X Left',   '',                  'M: X Left',         'Right stick left',  'Right stick left',  '',                '[C] Right stick left', '',                 'Right stick left',  '',                  '',                  '',                  'C-Left',            '',                  'Right stick left',  'Right pad left',    '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '4',       'Right stick left (TX)',  '',                  'Right D-pad left',         'C-Left',                   'Right stick left',  '',                  '',                  '',                  '*Right stick left', 'Right stick left', ],
    ['GP: RX Right; M: X Right',  '',                  'M: X Right',        'Right stick right', 'Right stick right', '',                '[C] Right stick right','',                 'Right stick right', '',                  '',                  '',                  'C-Right',           '',                  'Right stick right', 'Right pad right',   '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '2',       'Right stick right (TX)', '',                  'Right D-pad right',        'C-Right',                  'Right stick right', '',                  '',                  '',                  '*Right stick right','Right stick right',],
    ['GP: RY Down;  M: Y Down',   '',                  'M: Y Down',         'Right stick down',  'Right stick down',  '',                '[C] Right stick down', '',                 'Right stick down',  '',                  '',                  '',                  'C-Down',            '',                  'Right stick down',  'Right pad down',    '',                  '',                  '',                  '',                  '',                  '',                  '',                  '*Throttle down',    '3',       'Right stick down (TY)',  '',                  'Right D-pad down',         'C-Down',                   'Right stick down',  '',                  '',                  '',                  '*Right stick down', 'Right stick down', ],
    ['GP: RY Up;    M: Y Up',     '',                  'M: Y Up',           'Right stick up',    'Right stick up',    '',                '[C] Right stick up',   '',                 'Right stick up',    '',                  '',                  '',                  'C-Up',              '',                  'Right stick up',    'Right pad up',      '',                  '',                  '',                  '',                  '',                  '',                  '',                  '*Throttle up',      '1',       'Right stick up (TY)',    '',                  'Right D-pad up',           'C-Up',                     'Right stick up',    '',                  '',                  '',                  '*Right stick up',   'Right stick up',   ],
    ['GP: LD Left;  KB: Left',    'KB: Left',          '',                  'D-pad left',        'D-pad left',        'D-pad left (H)',  '[C] D-pad left',     '[W] D-pad left (V)', 'D-pad left',        'D-pad left',        'D-pad left',        'D-pad left',        'D-pad left',        '',                  'D-pad left',        'Stick left',        'D-pad left',        'D-pad left',        'D-pad left',        'D-pad left',        'D-pad left',        '',                  'D-pad left',        'D-pad left',        'D-pad left',  'D-pad left',         'D-pad left',        'Left D-pad left',          'D-pad left',               'D-pad left',        'D-pad left',        'D-pad left',        'D-pad left',        'Left D-pad left',   'D-pad left',       ],
    ['GP: LD Right; KB: Right',   'KB: Right',         '',                  'D-pad right',       'D-pad right',       'D-pad right (H)', '[C] D-pad right',    '[W] D-pad right (V)','D-pad right',       'D-pad right',       'D-pad right',       'D-pad right',       'D-pad right',       '',                  'D-pad right',       'Stick right',       'D-pad right',       'D-pad right',       'D-pad right',       'D-pad right',       'D-pad right',       '',                  'D-pad right',       'D-pad right',       'D-pad right', 'D-pad right',        'D-pad right',       'Left D-pad right',         'D-pad right',              'D-pad right',       'D-pad right',       'D-pad right',       'D-pad right',       'Left D-pad right',  'D-pad right',      ],
    ['GP: LD Down;  KB: Down',    'KB: Down',          '',                  'D-pad down',        'D-pad down',        'D-pad down (H)',  '[C] D-pad down',     '[W] D-pad down (V)', 'D-pad down',        'D-pad down',        'D-pad down',        'D-pad down',        'D-pad down',        '',                  'D-pad down',        'Stick down',        'D-pad down',        'D-pad down',        'D-pad down',        'D-pad down',        'D-pad down',        '',                  'D-pad down',        'D-pad down',        'D-pad down',  'D-pad down',         'D-pad down',        'Left D-pad down',          'D-pad down',               'D-pad down',        'D-pad down',        'D-pad down',        'D-pad down',        'Left D-pad down',   'D-pad down',       ],
    ['GP: LD Up;    KB: Up',      'KB: Up',            '',                  'D-pad up',          'D-pad up',          'D-pad up (H)',    '[C] D-pad up',       '[W] D-pad up (V)',   'D-pad up',          'D-pad up',          'D-pad up',          'D-pad up',          'D-pad up',          '',                  'D-pad up',          'Stick up',          'D-pad up',          'D-pad up',          'D-pad up',          'D-pad up',          'D-pad up',          '',                  'D-pad up',          'D-pad up',          'D-pad up',    'D-pad up',           'D-pad up',          'Left D-pad up',            'D-pad up',                 'D-pad up',          'D-pad up',          'D-pad up',          'D-pad up',          'Left D-pad up',     'D-pad up',         ],
    ['GP: RD Left;  M: WX Left',  '',                  'M: WX Left',        '',                  'Mute',              '',                '[W] D-pad left (H)',  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  'L pad click',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '*',                  '',                  '',                         '',                         '',                  '',                  '',                  '',                  '*Right D-pad left', '',                 ],
    ['GP: RD Right; M: WX Right', '',                  'M: WX Right',       '',                  '',                  '',                '[W] D-pad right (H)', '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  'R pad click',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '0',                  '',                  '',                         '',                         '',                  '',                  '',                  '',                  '*Right D-pad right','',                 ],
    ['GP: RD Down;  M: WY Down',  '',                  'M: WY Down',        '',                  '',                  '',                '[W] D-pad down (H)',  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '#',                  '',                  '',                         '',                         '',                  '',                  '',                  '',                  '*Right D-pad down', '',                 ],
    ['GP: RD Up;    M: WY Up',    '',                  'M: WY Up',          '',                  '',                  '',                '[W] D-pad up (H)',    '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '*Right D-pad up',   '',                 ],
    ['GP: RB Left;  KB: Q; M: 4', 'KB: Q',             'M: 4',              'Square',            'Square',            '1',                 '[C] Y',             '[W] 1',             'Y',                 'B',                 'Y',                 'A',                 'B',                 'B | D-pad up',      'X',                 'X',                 'A',                 'II',                'III',               'B',                 'Y',                 '1',                 '3',                 'A',                 'C',           'C',                  'III',               'B',                        'B',                        'B',                 '1',                 'A',                 'A',                 'X',                 'Square',           ],
    ['GP: RB Right; KB: R; M: 5', 'KB: R',             'M: 5',              'Circle',            'Circle',            'B',                 '[C] A',             '[W] 2',             'A',                 '',                  'A',                 'C',                 '',                  'X | D-pad down',    'B',                 'B',                 'D',                 '',                  'I',                 '',                  'A',                 '',                  '2',                 'C',                 'A',           'A',                  'I',                 '',                         'C-Down',                   'X',                 '',                  'C',                 'C',                 'B',                 'Circle',           ],
    ['GP: RB Down;  KB: E; M: 6', 'KB: E',             'M: 6',              'X',                 'X',                 '2',                 '[C] B',             '[W] A',             'B',                 'A',                 'B',                 'B',                 'A',                 'A | D-pad left',    'A',                 'A',                 'B',                 'I',                 'II',                'A',                 'B',                 '2',                 '1',                 'B',                 'B',           'B',                  'II',                'A',                        'A',                        'A',                 '2',                 'B',                 'B',                 'A',                 'X',                ],
    ['GP: RB Up;    KB: F; M: 7', 'KB: F',             'M: 7',              'Triangle',          'Triangle',          'A',                 '[C] X',             '',                  'X',                 '',                  'X',                 'Y',                 '',                  'Y | D-pad right',   'Y',                 'Y',                 'C',                 '',                  'V',                 '',                  'X',                 '',                  '4',                 '*Trigger',          '8 (Y)',       '8 (Y)',              'V',                 '',                         'C-Left',                   'Y',                 '',                  '*Y',                'Y',                 'Y',                 'Triangle',         ],
    ['GP: MM; KB: Esc',           'KB: Esc',           '',                  'Start',             'OPTIONS',           '+',                 '[C] +',             '',                  '+',                 'Start',             'Start',             'Start',             'Start',             '+ | Capture',       'Menu',              'Start',             'Start',             'Run',               'Run',               'Start',             'Start',             '',                  'Start',             'P',                 'Option',      'Option',             'Run',               'Start',                    'Start',                    'Start',             '',                  'Start',             'Start',             'Start',             'Start',            ],
    ['GP: MS; KB: Enter',         'KB: Enter',         '',                  'Select',            'SHARE',             '-',                 '[C] -',             '',                  '-',                 'Select',            'Select',            'Mode',              '',                  '- | Home',          'View',              'Back',              'Select',            'Select',            'Select',            'Select',            'Select',            '',                  'Coin',              'X',                 'Pause',       'Pause',              'Select',            'Select',                   '',                         '',                  '',                  '*Mode',             '',                  '*D',                'Select',           ],
    ['GP: MT; KB: L Win',         'KB: L Win',         '',                  'PS',                'PS',                'Home',              '[C] Home',          '',                  'Home',              '',                  '',                  'Home',              'Home',              '',                  'Xbox',              'Steam',             'Extra',             '',                  '',                  '',                  '',                  '',                  'Service',           '',                  '0',           '2',                  '',                  'Start',                    '**Toggle Ctrl/Rumble pak', '',                  '',                  '',                  '',                  '',                  'Analog',           ],
    ['GP: MQ; KB: Hash',          'KB: Hash',          '',                  '',                  'TouchPad',          '',                  '[W] B',             '',                  'Capture',           '',                  '',                  'Capture',           'Capture',           '',                  'Share',             'Stick click',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '5',                  '',                  'Select',                   '**Rotate memory bank',     '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['GP: LM; M: Right',          '',                  'M: Right',          'L2',                'L2',                '',                  '[C] Analog L',      '[N] Z',             'ZL',                'L',                 'L',                 '',                  'Z',                 'SL',                'LT',                'Analog LT',         '6',                 '',                  'IV',                '',                  'L',                 '',                  '5',                 'L',                 '4 (L)',       'Z Axis',             'IV',                'L',                        'Z',                        'Analog L',          '',                  '*X',                'L',                 'L',                 'L2',               ],
    ['GP: LS; KB: Z',             'KB: Z',             '',                  'L1',                'L1',                '',                  '[C] ZL',            '[N] C',             'L',                 '',                  'ZL',                'X',                 'L',                 'L | R',             'LB',                'LB',                '6',                 '',                  'IV',                '',                  'L',                 '',                  '7',                 'L',                 '7 (Z)',       '4 (L)',              'IV',                'L',                        'L',                        'Z',                 '',                  '*X',                'X',                 '*Z',                'L1',               ],
    ['GP: LT; KB: L CTRL',        'KB: L CTRL',        '',                  '',                  '',                  '',                  '[C] Digital L',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  'Digital LT',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '1',                  '',                  '',                         '',                         'Digital L',         '',                  '',                  '',                  '',                  '',                 ],
    ['GP: LJ; M: Middle',         '',                  'M: Middle',         'L3',                'L3',                '',                  '[W] 1',             '',                  'L Stick',           '',                  '',                  '',                  '',                  'Stick click',       'L Stick',           'L grip',            '',                  '',                  '',                  '',                  '',                  '',                  '9',                 '',                  '*',           '7 (Z)',              'Mode 1',            '**VTAP PALETTE',           '',                         '',                  '',                  '',                  '',                  '',                  'L3',               ],
    ['GP: RM; M: Left',           '',                  'M: Left',           'R2',                'R2',                '',                  '[C] Analog R',      '[W] B',             'ZR',                'R',                 'R',                 '',                  'ZR',                'SR',                'RT',                'Analog RT',         'Credit',            '',                  'VI',                '',                  'R',                 '',                  '6',                 'R',                 '6 (R)',       'TZ Axis',            'VI',                'R',                        'Z',                        'Analog R',          '',                  '*Z',                'R',                 'R',                 'R2',               ],
    ['GP: RS; KB: X; M: 8',       'KB: X',             '',                  'R1',                'R1',                '',                  '[C] ZR',            '',                  'R',                 '',                  'ZR',                'Z',                 'R',                 'ZL | ZR',           'RB',                'RB',                'Credit',            '',                  'VI',                '',                  'R',                 '',                  '8',                 'R',                 '9 (X)',       '6 (R)',              'VI',                'R',                        'R',                        'Z',                 '',                  '*Z',                'Z',                 '*C',                'R1',               ],
    ['GP: RT; KB: L Shift',       'KB: L Shift',       '',                  '',                  '',                  '',                  '[C] Digital R',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  'Digital RT',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '3',                  '',                  '',                         '',                         'Digital R',         '',                  '',                  '',                  '',                  '',                 ],
    ['GP: RJ; KB: Space',         'KB: Space',         '',                  'R3',                'R3',                '',                  '[W] 2',             '',                  'R Stick',           '',                  '',                  '',                  '',                  '',                  'R Stick',           'R grip',            '',                  '',                  '',                  '',                  '',                  '',                  '10',                '',                  '#',           '9 (X)',              'Mode 2',            '**VTAP MODE',              '',                         '',                  '',                  '',                  '',                  '',                  'R3',               ],
    ['KB: B',                     'KB: B',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: C',                     'KB: C',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: G',                     'KB: G',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: H',                     'KB: H',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: I',                     'KB: I',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: J',                     'KB: J',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: K',                     'KB: K',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: L',                     'KB: L',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: M',                     'KB: M',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: N',                     'KB: N',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: O',                     'KB: O',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: P',                     'KB: P',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: T',                     'KB: T',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: U',                     'KB: U',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: V',                     'KB: V',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Y',                     'KB: Y',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 1',                     'KB: 1',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 2',                     'KB: 2',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 3',                     'KB: 3',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 4',                     'KB: 4',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 5',                     'KB: 5',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 6',                     'KB: 6',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 7',                     'KB: 7',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 8',                     'KB: 8',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 9',                     'KB: 9',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: 0',                     'KB: 0',             '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Backspace',             'KB: Backspace',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Tab',                   'KB: Tab',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Minus',                 'KB: Minus',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Equal',                 'KB: Equal',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: L Brace',               'KB: L Brace',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: R Brace',               'KB: R Brace',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Backslash',             'KB: Backslash',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Semicolon',             'KB: Semicolon',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Apostrophe',            'KB: Apostrophe',    '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Grave',                 'KB: Grave',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Comma',                 'KB: Comma',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Dot',                   'KB: Dot',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Slash',                 'KB: Slash',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Capslock',              'KB: Capslock',      '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F1',                    'KB: F1',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F2',                    'KB: F2',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F3',                    'KB: F3',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F4',                    'KB: F4',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F5',                    'KB: F5',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F6',                    'KB: F6',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F7',                    'KB: F7',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F8',                    'KB: F8',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F9',                    'KB: F9',            '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F10',                   'KB: F10',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F11',                   'KB: F11',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: F12',                   'KB: F12',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Print Screen',          'KB: Print Screen',  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Scroll',                'KB: Scroll',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Pause',                 'KB: Pause',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Insert',                'KB: Insert',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Home',                  'KB: Home',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Page Up',               'KB: Page Up',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Delete',                'KB: Delete',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: End',                   'KB: End',           '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Page Down',             'KB: Page Down',     '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: Numlock',               'KB: Numlock',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Div',                'KB: KP Div',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Multi',              'KB: KP Multi',      '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Minus',              'KB: KP Minus',      '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Plus',               'KB: KP Plus',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Enter',              'KB: KP Enter',      '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 1',                  'KB: KP 1',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 2',                  'KB: KP 2',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 3',                  'KB: KP 3',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 4',                  'KB: KP 4',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 5',                  'KB: KP 5',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 6',                  'KB: KP 6',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 7',                  'KB: KP 7',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 8',                  'KB: KP 8',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 9',                  'KB: KP 9',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP 0',                  'KB: KP 0',          '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: KP Dot',                'KB: KP Dot',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: L Alt',                 'KB: L Alt',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: R Ctrl',                'KB: R Ctrl',        '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: R Shift',               'KB: R Shift',       '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: R Alt',                 'KB: R Alt',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
    ['KB: R Win',                 'KB: R Win',         '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',                  '',            '',                   '',                  '',                         '',                         '',                  '',                  '',                  '',                  '',                  '',                 ],
];

var systemCfg = [
    'Auto',
    'Parallel_1P_PP',
    'Parallel_2P_PP',
    'NES',
    'PCE',
    'MD-Genesis',
    'SNES',
    'CD-i',
    'CD32',
    '3DO',
    'Jaguar',
    'PSX',
    'Saturn',
    'PC-FX',
    'JVS',
    'N64',
    'DC',
    'PS2',
    'GC',
    'Wii-Ext',
    "VB",
    "Parallel_1P_OD",
    "Parallel_2P_OD",
    "SEA Board",
];

var multitapCfg = [
    'None',
    'Slot 1',
    'Slot 2',
    'Dual',
    'Alt',
];

var inquiryMode = [
    'Auto',
    'Manual',
];

var devCfg = [
    'GamePad',
    'GamePadAlt',
    'Keyboard',
    'Mouse',
];

var accCfg = [
    'None',
    'Memory',
    'Rumble',
    'Both',
];

var scaling = [
    'Linear',
    'Aggressive',
    'Relaxed',
    'Wide',
    'S-Curve',
    'Passthrough',
];

var diagScaling = [
    'Passthrough',
    'Circular->Square',
    'Circular->N64 Hexagone',
    'Square->Circular',
    'Square->N64 Hexagone'
];

const maxMainInput = 12;
const maxSubInput = 4;
const maxOutput = 12;
const maxMax = 255;
const maxThres = 100;
const maxTurbo = 16;

var apiVersion = 0;
var bluetoothDevice;
var maxMapping = 255;
var nbMapping = 1;
let brService = null;
var mappingElement = null;
let inputChrc = null;
var pageInit = 0;
var srcLabel = 0;
var destLabel = 0;

function initGlobalCfg() {
    var div = document.createElement("div");

    /* System */
    var label = document.createElement("label");
    label.innerText = 'System: ';
    label.setAttribute("for", "systemCfg");

    var sel = document.createElement("select");
    for (var i = 0; i < systemCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = systemCfg[i];
        sel.add(option);
    }
    sel.id = "systemCfg";
    div.appendChild(label);
    div.appendChild(sel);

    var divGlobalCfg = document.getElementById("divGlobalCfg");
    divGlobalCfg.appendChild(div);

    div = document.createElement("div");

    /* Multitap */
    label = document.createElement("label");
    label.innerText = 'Multitap: ';
    label.setAttribute("for", "multitapCfg");

    sel = document.createElement("select");
    for (var i = 0; i < multitapCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = multitapCfg[i];
        sel.add(option);
    }
    sel.id = "multitapCfg";
    div.appendChild(label);
    div.appendChild(sel);

    divGlobalCfg.appendChild(div);

    if (apiVersion > 0) {
        div = document.createElement("div");

        /* Inquiry mode */
        label = document.createElement("label");
        label.innerText = 'Inquiry mode: ';
        label.setAttribute("for", "inquiryMode");

        sel = document.createElement("select");
        for (var i = 0; i < inquiryMode.length; i++) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = inquiryMode[i];
            sel.add(option);
        }
        sel.id = "inquiryMode";
        div.appendChild(label);
        div.appendChild(sel);

        divGlobalCfg.appendChild(div);
    }

    if (apiVersion > 1) {
        div = document.createElement("div");

        /* Banksel */
        label = document.createElement("label");
        label.innerText = 'Memory Card Bank: ';
        label.setAttribute("for", "banksel");

        sel = document.createElement("select");
        for (var i = 0; i < 4; i++) {
            var option  = document.createElement("option");
            option.value = i;
            option.text = 'Bank ' + eval(i + 1);
            sel.add(option);
        }
        sel.id = "banksel";
        div.appendChild(label);
        div.appendChild(sel);

        divGlobalCfg.appendChild(div);
    }

    div = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "globalSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveGlobal);
    div.appendChild(btn);
    div.setAttribute("style", "margin-top:1em;");

    divGlobalCfg.appendChild(div);

    div = document.createElement("div");
    div.id = "globalSaveText";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:red;");
    p.innerText = "Config saved, power cycle BlueRetro adapter for change to take effect.";

    div.appendChild(p);
    divGlobalCfg.appendChild(div);
}

function initOutputSelect() {
    var div = document.createElement("div");

    /* Output select */
    var label = document.createElement("label");
    label.innerText = 'Select output: ';
    label.setAttribute("for", "outputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        main.add(option);
    }
    main.id = "outputSelect";
    main.addEventListener("change", selectOutput);
    div.appendChild(label);
    div.appendChild(main);

    var divOutputCfg = document.getElementById("divOutputCfg");
    divOutputCfg.appendChild(div);
}

function initOutputMode() {
    var div = document.createElement("div");
    div.setAttribute("style", "margin-top:1em;");

    /* Output mode */
    var span = document.createElement("span");
    span.setAttribute("style", "display:inline-block;");
    var label = document.createElement("label");
    label.innerText = 'Mode';
    label.setAttribute("for", "outputMode");
    label.setAttribute("style", "display:block;");

    var main = document.createElement("select");
    for (var i = 0; i < devCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = devCfg[i];
        main.add(option);
    }
    main.id = "outputMode";
    span.appendChild(label);
    span.appendChild(main);
    div.appendChild(span);

    /* Output acessories */
    span = document.createElement("span");
    span.setAttribute("style", "display:inline-block;");
    label = document.createElement("label");
    label.innerText = 'Accessories';
    label.setAttribute("for", "outputAcc");
    label.setAttribute("style", "display:block;");

    main = document.createElement("select");
    for (var i = 0; i < accCfg.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = accCfg[i];
        main.add(option);
    }
    main.id = "outputAcc";
    span.appendChild(label);
    span.appendChild(main);
    div.appendChild(span);

    var divOutputCfg = document.getElementById("divOutputCfg");
    divOutputCfg.appendChild(div);

    div = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "outputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveOutput);
    div.appendChild(btn);
    div.setAttribute("style", "margin-top:1em;");

    divOutputCfg.appendChild(div);

    div = document.createElement("div");
    div.id = "outputSaveText";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:red;");
    p.innerText = "Config saved, power cycle BlueRetro adapter for Mode change to take effect.";

    div.appendChild(p);
    divOutputCfg.appendChild(div);

    div = document.createElement("div");
    div.id = "outputSaveMouse";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:orange;");
    p.innerText = "Mouse mode require setting <Default Mouse> preset.";

    div.appendChild(p);
    divOutputCfg.appendChild(div);
}

function initInputSelect() {
    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    /* Input select */
    var label = document.createElement("label");
    label.innerText = 'Select Bluetooth device: ';
    label.setAttribute("for", "inputSelect");

    var main = document.createElement("select");
    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Device " + (i + 1);
        main.add(option);
    }
    main.id = "inputSelect";
    main.addEventListener("change", selectInput);
    div.appendChild(label);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
}

function initLabelSelect() {
    var div = document.createElement("div");

    var label = document.createElement("label");
    label.innerText = 'Src label: ';
    label.setAttribute("for", "srcLabel");

    var main = document.createElement("select");
    for (var i = 0; i < labelName.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = labelName[i];
        main.add(option);
    }
    main.id = "srcLabel";
    main.addEventListener("change", changeSrcLabel);
    div.appendChild(label);
    div.appendChild(main);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);

    var div = document.createElement("div");
    div.setAttribute("style", "margin-bottom:1em;");

    label = document.createElement("label");
    label.innerText = 'Dst label: ';
    label.setAttribute("for", "dstLabel");

    main = document.createElement("select");
    for (var i = 0; i < labelName.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = labelName[i];
        main.add(option);
    }
    main.id = "dstLabel";
    main.addEventListener("change", changeDstLabel);
    div.appendChild(label);
    div.appendChild(main);

    divInputCfg.appendChild(div);
}

function initInputAssign() {
    var div = document.createElement("div");

    /* Main dev */
    var main = document.createElement("select");
    main.setAttribute("style", "max-width:40%;");
    for (var i = 0; i < maxMainInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Input " + (i + 1);
        main.add(option);
    }
    main.id = "mainInput";
    div.appendChild(main);

    /* Sub dev */
    var sub = document.createElement("select");
    sub.setAttribute("style", "max-width:40%;");
    for (var i = 0; i <= maxSubInput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Sub Input " + i;
        }
        else {
            option.text = "Sub Input Merged";
        }
        sub.add(option);
    }
    sub.id = "subInput";
    div.appendChild(sub);

    var divInputCfg = document.getElementById("divInputCfg");
    divInputCfg.appendChild(div);
}

function initFirstOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the source button/axis on the Bluetooth controller";
    var label = document.createElement("label");
    label.innerText = 'Src';
    label.setAttribute("style", "display:block;");

    var src = document.createElement("select");
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnList[i][srcLabel];
        src.add(option);
    }
    src.setAttribute("class", "src");
    span.appendChild(label);
    span.appendChild(src);
    mappingElement.appendChild(span);

    /* Dest */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the destination button/axis on the wired interface.";
    label = document.createElement("label");
    label.innerText = 'Dest';
    label.setAttribute("style", "display:block;");

    var dest = src.cloneNode(true);
    dest.setAttribute("class", "dest");
    span.appendChild(label);
    span.appendChild(dest);
    mappingElement.appendChild(span);

    /* Dest ID */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the ID of the wired interface.";
    label = document.createElement("label");
    label.innerText = 'Dest ID';
    label.setAttribute("style", "display:block;");

    var destId = document.createElement("select");
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        destId.add(option);
    }
    destId.setAttribute("class", "destId");
    span.appendChild(label);
    span.appendChild(destId);
    mappingElement.appendChild(span);

    /* Max */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source & destination is an axis then this is the scaling factor base on the destination maximum. If source is a button & destination is an axis then this is the value base on destination maximum that the axis will be set.";
    label = document.createElement("label");
    label.innerText = 'Max';
    label.setAttribute("style", "display:block;");

    var max = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    span.appendChild(label);
    span.appendChild(max);
    mappingElement.appendChild(span);

    /* Threshold */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "If source is an axis and destination is a button, this is the threshold requires on the source axis before the button is pressed.";
    label = document.createElement("label");
    label.innerText = 'Thres';
    label.setAttribute("style", "display:block;");

    var thres = document.createElement("select");
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    span.appendChild(label);
    span.appendChild(thres);
    mappingElement.appendChild(span);

    /* Deadone */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "This is the axis dead zone around reset value.";
    label = document.createElement("label");
    label.innerText = 'Deadzone';
    label.setAttribute("style", "display:block;");

    var dz = document.createElement("select");
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    span.appendChild(label);
    span.appendChild(dz);
    mappingElement.appendChild(span);

    /* Turbo */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Turbo function base on the system frame rate. (TBD Not implemented yet)";
    label = document.createElement("label");
    label.innerText = 'Turbo';
    label.setAttribute("style", "display:block;");

    var turbo = document.createElement("select");
    for (var i = 0; i < maxTurbo; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Framerate/" + i;
        }
        else {
            option.text = "Disable";
        }
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    span.appendChild(label);
    span.appendChild(turbo);
    mappingElement.appendChild(span);

    /* Scaling */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Various response curve for scaling. (Only Passthrough and Linear, others TBD)";
    label = document.createElement("label");
    label.innerText = 'Scaling';
    label.setAttribute("style", "display:block;");

    var sca = document.createElement("select");
    for (var i = 0; i < scaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = scaling[i];
        sca.add(option);
    }
    sca.setAttribute("class", "scaling");
    span.appendChild(label);
    span.appendChild(sca);
    mappingElement.appendChild(span);

    /* Scaling diag */
    span = document.createElement("span");
    span.setAttribute("style", "max-width:10%;display:inline-block;");
    span.title = "Diagonal scaling options between joystick type. (TBD Not implemented yet)";
    label = document.createElement("label");
    label.innerText = 'Diagonal';
    label.setAttribute("style", "display:block;");

    var diag = document.createElement("select");
    diag.setAttribute("style", "max-width:100%;");
    for (var i = 0; i < diagScaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = diagScaling[i];
        diag.add(option);
    }
    diag.setAttribute("class", "diag");
    span.appendChild(label);
    span.appendChild(diag);
    mappingElement.appendChild(span);

    /* Add button */
    var addButton = document.createElement("button");
    addButton.innerText = '+';
    addButton.addEventListener("click", addInput);

    /* Save */
    divSave = document.createElement("div");

    var btn = document.createElement("button");
    btn.id = "inputSave";
    btn.innerText = 'Save';
    btn.addEventListener("click", saveInput);
    divSave.appendChild(btn);
    divSave.setAttribute("style", "margin-top:1em;");

    var div = document.createElement("div");
    div.id = "inputSaveText";
    div.setAttribute("style", "display:none;margin-top:1em;");
    var p = document.createElement("p");
    p.setAttribute("style", "font-style:italic;font-size:small;color:green;");
    p.innerText = "Config saved, mapping changes take effect immediately.";

    div.appendChild(p);
    divSave.appendChild(div);

    /* Append first cfg */
    divMappingGrp = document.createElement("div");
    divMapping = document.createElement("div");
    divMapping.appendChild(mappingElement);
    divMapping.id = "divMapping";
    var divInputCfg = document.getElementById("divInputCfg");
    divMappingGrp.appendChild(divMapping);
    divMappingGrp.appendChild(addButton);
    divMappingGrp.appendChild(divSave);
    divInputCfg.appendChild(divMappingGrp);
}

function initOutputMapping() {
    mappingElement = document.createElement("div");

    /* Src */
    var src = document.createElement("select");
    src.setAttribute("style", "max-width:10%;");
    src.title = "This is the source button/axis on the Bluetooth controller";
    for (var i = 0; i < btnList.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = btnList[i][srcLabel];
        src.add(option);
    }
    src.setAttribute("class", "src");
    mappingElement.appendChild(src);

    /* Dest */
    var dest = src.cloneNode(true);
    dest.setAttribute("class", "dest");
    dest.title = "This is the destination button/axis on the wired interface.";
    mappingElement.appendChild(dest);

    /* Dest ID */
    var destId = document.createElement("select");
    destId.setAttribute("style", "max-width:10%;");
    destId.title = "This is the ID of the wired interface.";
    for (var i = 0; i < maxOutput; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = "Output " + (i + 1);
        destId.add(option);
    }
    destId.setAttribute("class", "destId");
    mappingElement.appendChild(destId);

    /* Max */
    var max = document.createElement("select");
    max.setAttribute("style", "max-width:10%;");
    max.title = "If source & destination is an axis then this is the scaling factor base on the destination maximum. If source is a button & destination is an axis then this is the value base on destination maximum that the axis will be set.";
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        max.add(option);
    }
    max.setAttribute("class", "max");
    max.value = 100;
    mappingElement.appendChild(max);

    /* Threshold */
    var thres = document.createElement("select");
    thres.setAttribute("style", "thres-width:10%;");
    thres.title = "If source is an axis and destination is a button, this is the threshold requires on the source axis before the button is pressed.";
    for (var i = 0; i <= maxThres; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i + "%";
        thres.add(option);
    }
    thres.setAttribute("class", "thres");
    thres.value = 50;
    mappingElement.appendChild(thres);

    /* Deadone */
    var dz = document.createElement("select");
    dz.setAttribute("style", "dz-width:10%;");
    dz.title = "This is the axis dead zone around reset value.";
    for (var i = 0; i <= maxMax; i += 5) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = i/10000 + "%";
        dz.add(option);
    }
    dz.setAttribute("class", "dz");
    dz.value = 135;
    mappingElement.appendChild(dz);

    /* Turbo */
    var turbo = document.createElement("select");
    turbo.setAttribute("style", "max-width:10%;");
    turbo.title = "Turbo function base on the system frame rate. (TBD Not implemented yet)";
    for (var i = 0; i < maxTurbo; i++) {
        var option  = document.createElement("option");
        option.value = i;
        if (i) {
            option.text = "Framerate/" + i;
        }
        else {
            option.text = "Disable";
        }
        turbo.add(option);
    }
    turbo.setAttribute("class", "turbo");
    mappingElement.appendChild(turbo);

    /* Scaling */
    var sca = document.createElement("select");
    sca.setAttribute("style", "max-width:10%;");
    sca.title = "Various response curve for scaling. (Only Passthrough and Linear, others TBD)";
    for (var i = 0; i < scaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = scaling[i];
        sca.add(option);
    }
    sca.setAttribute("class", "scaling");
    mappingElement.appendChild(sca);

    /* Scaling diag */
    var diag = document.createElement("select");
    diag.setAttribute("style", "max-width:10%;");
    diag.title = "Diagonal scaling options between joystick type. (TBD Not implemented yet)";
    for (var i = 0; i < diagScaling.length; i++) {
        var option  = document.createElement("option");
        option.value = i;
        option.text = diagScaling[i];
        diag.add(option);
    }
    diag.setAttribute("class", "diag");
    mappingElement.appendChild(diag);
}

function initBlueRetroCfg() {
    initGlobalCfg();
    initOutputSelect();
    initOutputMode();
    initInputSelect();
    initLabelSelect();
    //initInputAssign();
    initFirstOutputMapping();
    initOutputMapping();
    pageInit = 1;
}

function getApiVersion() {
    return new Promise(function(resolve, reject) {
        log('Get Api version CHRC...');
        brService.getCharacteristic(brUuid[6])
        .then(chrc => {
            log('Reading Api version...');
            return chrc.readValue();
        })
        .then(value => {
            log('Api version size: ' + value.byteLength);
            apiVersion = value.getUint8(0);
            log('Api version: ' + apiVersion);
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadGlobalCfg() {
    return new Promise(function(resolve, reject) {
        log('Get Global Config CHRC...');
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            log('Reading Global Config...');
            return chrc.readValue();
        })
        .then(value => {
            log('Global Config size: ' + value.byteLength);
            document.getElementById("systemCfg").value = value.getUint8(0);
            document.getElementById("multitapCfg").value = value.getUint8(1);
            if (apiVersion > 0) {
                document.getElementById("inquiryMode").value = value.getUint8(2);
            }
            if (apiVersion > 1) {
                document.getElementById("banksel").value = value.getUint8(3);
            }
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadOutputCfg(cfgId) {
    return new Promise(function(resolve, reject) {
        log('Get Output ' + cfgId + ' CTRL CHRC...');
        brService.getCharacteristic(brUuid[2])
        .then(chrc => {
            log('Set Output ' + cfgId + ' on CTRL chrc...');
            var outputCtrl = new Uint16Array(1);
            outputCtrl[0] = Number(cfgId);
            return chrc.writeValue(outputCtrl);
        })
        .then(_ => {
            log('Get Output ' + cfgId + ' DATA CHRC...');
            return brService.getCharacteristic(brUuid[3]);
        })
        .then(chrc => {
            log('Reading Output ' + cfgId + ' Config...');
            return chrc.readValue();
        })
        .then(value => {
            log('Output ' + cfgId + ' Config size: ' + value.byteLength);
            document.getElementById("outputMode").value = value.getUint8(0);
            document.getElementById("outputAcc").value = value.getUint8(1);
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Reading Input Data CHRC...');
            return data_chrc.readValue();
        })
        .then(value => {
            log('Got Input Data ' + value.byteLength);
            var tmp = new Uint8Array(value.buffer);
            cfg.set(tmp, inputCtrl[1]);
            log('Got Input Data ' + cfg[2] + ' ' + value.getUint8(2));
            if (value.byteLength == 512) {
                inputCtrl[1] += Number(512);
                resolve(writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve(cfg);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function readInputCfg(cfgId, cfg) {
    return new Promise(function(resolve, reject) {
        let ctrl_chrc = null;
        let data_chrc = null;
        brService.getCharacteristic(brUuid[4])
        .then(chrc => {
            ctrl_chrc = chrc;
            return brService.getCharacteristic(brUuid[5])
        })
        .then(chrc => {
            var inputCtrl = new Uint16Array(2);
            inputCtrl[0] = Number(cfgId);
            inputCtrl[1] = 0;
            data_chrc = chrc;
            return writeReadRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + cfg.byteLength);
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function loadInputCfg(cfgId) {
    return new Promise(function(resolve, reject) {
        var cfg = new Uint8Array(2051);
        log('Get Input ' + cfgId + ' Config CHRC...');
        readInputCfg(cfgId, cfg)
        .then(value => {
            log('Input ' + cfgId + ' Config size: ' + value.byteLength);
            //document.getElementById("mainInput").value = value[0];
            //document.getElementById("subInput").value = value[1];

            var div = document.getElementById("divMapping");
            if (value[2] < nbMapping) {
                var range = nbMapping - value[2];
                for (var i = 0; i < range; i++) {
                    div.removeChild(div.lastChild);
                }
            }
            else if (value[2] > nbMapping) {
                var range = value[2] - nbMapping;
                for (var i = 0; i < range; i++) {
                    addInput();
                }
            }
            nbMapping = value[2];
            var src = document.getElementsByClassName("src");
            var dest = document.getElementsByClassName("dest");
            var destId = document.getElementsByClassName("destId");
            var max = document.getElementsByClassName("max");
            var thres = document.getElementsByClassName("thres");
            var dz = document.getElementsByClassName("dz");
            var turbo = document.getElementsByClassName("turbo");
            var scaling = document.getElementsByClassName("scaling");
            var diag = document.getElementsByClassName("diag");

            log('Loading Mapping Found: ' + src.length + ' nbMapping: ' + nbMapping + ' cfg: ' + value[2]);

            var j = 3;
            for (var i = 0; i < src.length; i++) {
                src[i].value = value[j++];
                dest[i].value = value[j++];
                destId[i].value = value[j++];
                max[i].value = value[j++];
                thres[i].value = value[j++];
                dz[i].value = value[j++];
                turbo[i].value = value[j++];
                scaling[i].value = value[j] & 0xF;
                diag[i].value = value[j++] >> 4;
            }
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveGlobal() {
    document.getElementById("globalSaveText").style.display = 'none';
    if (apiVersion > 1) {
        var data = new Uint8Array(4);
    }
    else if (apiVersion > 0) {
        var data = new Uint8Array(3);
    }
    else {
        var data = new Uint8Array(2);
    }
    data[0] = document.getElementById("systemCfg").value;
    data[1] = document.getElementById("multitapCfg").value;
    if (apiVersion > 0) {
        data[2] = document.getElementById("inquiryMode").value;
    }
    if (apiVersion > 1) {
        data[3] = document.getElementById("banksel").value;
    }
    return new Promise(function(resolve, reject) {
        log('Get Global Config CHRC...');
        brService.getCharacteristic(brUuid[1])
        .then(chrc => {
            log('Writing Global Config...');
            return chrc.writeValue(data);
        })
        .then(_ => {
            document.getElementById("globalSaveText").style.display = 'block';
            log('Global Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveOutput() {
    document.getElementById("outputSaveText").style.display = 'none';
    document.getElementById("outputSaveMouse").style.display = 'none';
    var data = new Uint8Array(2);
    data[0] = document.getElementById("outputMode").value;
    data[1] = document.getElementById("outputAcc").value;
    cfgId = document.getElementById("outputSelect").value;
    return new Promise(function(resolve, reject) {
        log('Get Output ' + cfgId + ' CTRL CHRC...');
        brService.getCharacteristic(brUuid[2])
        .then(chrc => {
            log('Set Output ' + cfgId + ' on CTRL chrc...');
            var outputCtrl = new Uint16Array(1);
            outputCtrl[0] = Number(cfgId);
            return chrc.writeValue(outputCtrl);
        })
        .then(_ => {
            log('Get Output ' + cfgId + ' DATA CHRC...');
            return brService.getCharacteristic(brUuid[3]);
        })
        .then(chrc => {
            log('Writing Output ' + cfgId + ' Config...');
            return chrc.writeValue(data);
        })
        .then(_ => {
            document.getElementById("outputSaveText").style.display = 'block';
            if (data[0] == 3) {
                document.getElementById("outputSaveMouse").style.display = 'block';
            }
            log('Output ' + cfgId + ' Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc) {
    return new Promise(function(resolve, reject) {
        log('Set Input Ctrl CHRC... ' + inputCtrl[1]);
        ctrl_chrc.writeValue(inputCtrl)
        .then(_ => {
            log('Writing Input Data CHRC...');
            var tmpViewSize = cfg.byteLength - inputCtrl[1];
            if (tmpViewSize > 512) {
                tmpViewSize = 512;
            }
            var tmpView = new DataView(cfg.buffer, inputCtrl[1], tmpViewSize);
            return data_chrc.writeValue(tmpView);
        })
        .then(_ => {
            log('Input Data Written');
            inputCtrl[1] += Number(512);
            if (inputCtrl[1] < cfg.byteLength) {
                resolve(writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc));
            }
            else {
                resolve();
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

function writeInputCfg(cfgId, cfg) {
    return new Promise(function(resolve, reject) {
        let ctrl_chrc = null;
        let data_chrc = null;
        brService.getCharacteristic(brUuid[4])
        .then(chrc => {
            ctrl_chrc = chrc;
            return brService.getCharacteristic(brUuid[5])
        })
        .then(chrc => {
            var inputCtrl = new Uint16Array(2);
            inputCtrl[0] = Number(cfgId);
            inputCtrl[1] = 0;
            data_chrc = chrc;
            return writeWriteRecursive(cfg, inputCtrl, ctrl_chrc, data_chrc);
        })
        .then(_ => {
            resolve(cfg);
        })
        .catch(error => {
            reject(error);
        });
    });
}

function saveInput() {
    document.getElementById("inputSaveText").style.display = 'none';
    var cfgSize = nbMapping*8 + 3;
    var cfg = new Uint8Array(cfgSize);
    cfgId = document.getElementById("inputSelect").value;

    var src = document.getElementsByClassName("src");
    var dest = document.getElementsByClassName("dest");
    var destId = document.getElementsByClassName("destId");
    var max = document.getElementsByClassName("max");
    var thres = document.getElementsByClassName("thres");
    var dz = document.getElementsByClassName("dz");
    var turbo = document.getElementsByClassName("turbo");
    var scaling = document.getElementsByClassName("scaling");
    var diag = document.getElementsByClassName("diag");

    var j = 0;
    cfg[j++] = 0;//document.getElementById("mainInput").value;
    cfg[j++] = 0;//document.getElementById("subInput").value;
    cfg[j++] = nbMapping;

    for (var i = 0; i < nbMapping; i++) {
        cfg[j++] = src[i].value;
        cfg[j++] = dest[i].value;
        cfg[j++] = destId[i].value;
        cfg[j++] = max[i].value;
        cfg[j++] = thres[i].value;
        cfg[j++] = dz[i].value;
        cfg[j++] = turbo[i].value;
        cfg[j++] = Number(scaling[i].value) | (Number(diag[i].value) << 4);
    }

    return new Promise(function(resolve, reject) {
        writeInputCfg(cfgId, cfg)
        .then(_ => {
            document.getElementById("inputSaveText").style.display = 'block';
            log('Input ' + cfgId + ' Config saved');
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

function onDisconnected() {
    log('> Bluetooth Device disconnected');
    document.getElementById("divBtConn").style.display = 'block';
    document.getElementById("divBtDisconn").style.display = 'none';
    document.getElementById("divGlobalCfg").style.display = 'none';
    document.getElementById("divOutputCfg").style.display = 'none';
    document.getElementById("divInputCfg").style.display = 'none';
}

function btConn() {
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(
        {filters: [{name: 'BlueRetro'}],
        optionalServices: [brUuid[0]]})
    .then(device => {
        log('Connecting to GATT Server...');
        bluetoothDevice = device;
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        return bluetoothDevice.gatt.connect();
    })
    .then(server => {
        log('Getting BlueRetro Service...');
        return server.getPrimaryService(brUuid[0]);
    })
    .then(service => {
        brService = service;
        return getApiVersion();
    })
    .catch(error => {
        if (error.name == 'NotFoundError') {
            return;
        }
        throw error;
    })
    .then(() => {
        if (!pageInit) {
            log('Init Cfg DOM...');
            initBlueRetroCfg();
        }
        return loadGlobalCfg();
    })
    .then(() => {
        return loadOutputCfg(0);
    })
    .then(() => {
        return loadInputCfg(0);
    })
    .then(() => {
        document.getElementById("divBtConn").style.display = 'none';
        //document.getElementById("divBtDisconn").style.display = 'block';
        document.getElementById("divGlobalCfg").style.display = 'block';
        document.getElementById("divOutputCfg").style.display = 'block';
        document.getElementById("divInputCfg").style.display = 'block';
    })
    .catch(error => {
        log('Argh! ' + error);
    });
}

function btDisconn() {
    if (!bluetoothDevice) {
        return;
    }
    log('Disconnecting from Bluetooth Device...');
    if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
    } else {
        log('> Bluetooth Device is already disconnected');
    }
    onDisconnected();
}

function addInput() {
    if (nbMapping < maxMapping){
        nbMapping++;
        var div = document.getElementById("divMapping");
        var newSubDiv = mappingElement.cloneNode(true);
        var newButton = document.createElement("button");
        newButton.innerText = '-';
        newButton.addEventListener("click", delInput);
        newSubDiv.appendChild(newButton);
        newSubDiv.querySelector('.max').value = 100;
        newSubDiv.querySelector('.thres').value = 50;
        newSubDiv.querySelector('.dz').value = 135;
        div.appendChild(newSubDiv);
    }
}

function delInput() {
    this.parentNode.remove();
    nbMapping--;
}

function selectOutput() {
    loadOutputCfg(this.value);
}

function selectInput() {
    loadInputCfg(this.value);
}

function changeSrcLabel() {
    var select = document.getElementsByClassName("src");
    var str = ""
    var tmp;

    srcLabel = this.value;

    for (var i = 0; i < btnList.length; i++) {
        str += "<option value=\"" + i + "\">" + btnList[i][srcLabel] + "</option>";
    }
    for (var i = 0; i < select.length; i++) {
        tmp = select[i].value;
        select[i].innerHTML = str;
        select[i].value = tmp;
    }
    mappingElement.querySelector('.src').innerHTML = str;
}

function changeDstLabel() {
    var select = document.getElementsByClassName("dest");
    var str = ""
    var tmp;

    destLabel = this.value;

    for (var i = 0; i < btnList.length; i++) {
        str += "<option value=\"" + i + "\">" + btnList[i][destLabel] + "</option>";
    }
    for (var i = 0; i < select.length; i++) {
        tmp = select[i].value;
        select[i].innerHTML = str;
        select[i].value = tmp;
    }
    mappingElement.querySelector('.dest').innerHTML = str;
}
