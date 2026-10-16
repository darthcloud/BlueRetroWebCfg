// Init function taken from MPKEdit by bryc:
// https://github.com/bryc/mempak/blob/dbd78db6ac55575838c6e107e5ea1e568981edc4/js/state.js#L8
export function makeFormattedPak() {
  function writeAt(ofs) {
    for (let i = 0; i < 32; i++) {
      data[ofs + i] = block[i];
    }
  }

  const data = new Uint8Array(32768);
  const block = new Uint8Array(32);

  // generate id block
  block[1] = 0 | ((Math.random() * 256) & 0x3f);
  block[5] = 0 | ((Math.random() * 256) & 0x7);
  block[6] = 0 | (Math.random() * 256);
  block[7] = 0 | (Math.random() * 256);
  block[8] = 0 | ((Math.random() * 256) & 0xf);
  block[9] = 0 | (Math.random() * 256);
  block[10] = 0 | (Math.random() * 256);
  block[11] = 0 | (Math.random() * 256);
  block[25] = 0x01; // device bit
  block[26] = 0x01; // bank size int (must be exactly '01')

  // calculate pakId checksum
  let sumA = 0,
    sumB = 0xfff2;
  for (let i = 0; i < 28; i += 2) {
    sumA += (block[i] << 8) + block[i + 1];
    sumA &= 0xffff;
  }
  sumB -= sumA;
  // store checksums
  block[28] = sumA >> 8;
  block[29] = sumA & 0xff;
  block[30] = sumB >> 8;
  block[31] = sumB & 0xff;

  // write checksum block to multiple sections in header page
  writeAt(32);
  writeAt(96);
  writeAt(128);
  writeAt(192);

  // init IndexTable and backup (plus checksums)
  for (let i = 5; i < 128; i++) {
    data[256 + i * 2 + 1] = 3;
    data[512 + i * 2 + 1] = 3;
  }
  data[257] = 0x71;
  data[513] = 0x71;

  //for(let i = 0; i < 32; i++) data[i] = i; // write label - needs to be verified
  //data[0] = 0x81; // libultra's 81 mark
  return data;
}

export default makeFormattedPak;
